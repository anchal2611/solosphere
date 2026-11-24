import React, {
  createContext,
  useState,
  useEffect,
  useRef
} from "react";

import { useAuth } from "./AuthContext";
import { BLOG_POSTS, mergeBlogPosts } from "../data/blogPosts";

import { db } from "../firebase/firebase";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

export const AppContext = createContext();


// ============================================================
// DEFAULT DATA
// ============================================================

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  avatar: "default",
  monthlyBudget: 0,
  wellnessGoal: "",
  savedRecipes: [],
  likedBlogs: [],
  coffeeLimit: 2,
  wakeTime: "07:30",
  quietHour: "21:00"
};

const DEFAULT_PLANNER = {
  tasks: [],
  weekly: Object.fromEntries(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => [day, ""])),
  goals: [],
  notes: "",
  habits: []
};

const DEFAULT_NOTIFICATIONS = [];

const cleanPlannerData = (planner = {}) => {
  planner ||= {};
  const sampleTaskIds = new Set(["t1", "t2", "t3", "t4", "t5"]);
  const sampleHabitIds = new Set(["h1", "h2", "h3", "h4"]);
  const sampleGoals = new Set([
    "Read 2 books this month",
    "Maintain an 8-day wellness habit streak",
    "Keep weekly cafe spend under ₹2000"
  ]);
  const sampleWeeklyPlans = new Set([
    "Buy fresh flowers & groceries", "Clean kitchen space & wash linen",
    "Cozy movie night & chamomile tea", "Read 3 chapters of my novel",
    "Try a new soup recipe", "Visit the local pottery studio", "Meal prep and journal time"
  ]);
  const sampleNotes = "Remember: Living alone is a gift of time and space. Take it slow, decorate with things that tell a story, and cook meals that feel like a warm hug.";

  return {
    ...DEFAULT_PLANNER,
    ...planner,
    tasks: (planner.tasks || []).filter(task => !sampleTaskIds.has(String(task.id))),
    weekly: Object.fromEntries(Object.entries({ ...DEFAULT_PLANNER.weekly, ...(planner.weekly || {}) })
      .map(([day, note]) => [day, sampleWeeklyPlans.has(note) ? "" : note])),
    goals: (planner.goals || []).filter(goal => !sampleGoals.has(goal)),
    notes: planner.notes === sampleNotes ? "" : planner.notes || "",
    habits: (planner.habits || []).filter(habit => !sampleHabitIds.has(String(habit.id)))
  };
};

const cleanNotifications = (notifications = []) => {
  const sampleMessages = new Set([
    "Your sourdough starter needs feeding!",
    "You completed all your wellness habits yesterday. Great job!",
    'Saved "Warm Fig & Honey Oatmeal" to your breakfast planner.',
    "Cozy Cafe budget is nearing 85% of limit.",
    "Welcome to SoloSphere! Let's create a peaceful space."
  ]);
  return (Array.isArray(notifications) ? notifications : [])
    .filter(notification => !sampleMessages.has(notification.text));
};

// ============================================================
// RECIPES
// ============================================================

// ============================================================
// APP PROVIDER
// ============================================================

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // Prevents old user's data from syncing before Firebase finishes loading
  const [dataReady, setDataReady] = useState(false);

  const previousUserId = useRef(null);


  // ================= PROFILE =================

  const [profile, setProfile] = useState(DEFAULT_PROFILE);


  // ================= CATEGORIES =================

  const [categories, setCategories] = useState([]);


  // ================= EXPENSES =================

  const [expenses, setExpenses] = useState([]);


  // ================= RECIPES =================

  const [recipes, setRecipes] = useState([]);
  const [blogPosts, setBlogPosts] = useState(BLOG_POSTS);


  // ================= PLANNER =================

  const [planner, setPlanner] = useState(DEFAULT_PLANNER);


  // ================= NOTIFICATIONS =================

  const [notifications, setNotifications] =
    useState(DEFAULT_NOTIFICATIONS);


  // ============================================================
  // RESET DATA WHEN USER CHANGES
  // Reset state when the authenticated user changes.
  // ============================================================

  useEffect(() => {
    if (!user) {
      previousUserId.current = null;
      setDataReady(false);

      setProfile(DEFAULT_PROFILE);
      setPlanner(DEFAULT_PLANNER);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setBlogPosts(BLOG_POSTS);
      setExpenses([]);
      setCategories([]);

      return;
    }

    if (previousUserId.current !== user.uid) {
      previousUserId.current = user.uid;
      setDataReady(false);

      setProfile({
        ...DEFAULT_PROFILE,
        name: user.displayName || "",
        email: user.email || ""
      });

      setPlanner(DEFAULT_PLANNER);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setBlogPosts(BLOG_POSTS);
      setExpenses([]);
      setCategories([]);
    }
  }, [user]);


  // ============================================================
  // LOAD USER PROFILE / PLANNER / NOTIFICATIONS FROM FIREBASE
  // ============================================================

  useEffect(() => {
    if (!user) return;

    const loadFirebaseData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);

        const userDocSnap = await getDoc(userDocRef);


        // --------------------------------------------------------
        // EXISTING USER
        // --------------------------------------------------------

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();


          const loadedProfile = {
            ...DEFAULT_PROFILE,
            ...(data.profile || {}),
            name:
              user.displayName ||
              data.profile?.name ||
              "User",
            email:
              user.email ||
              data.profile?.email ||
              ""
          };

          setProfile(loadedProfile);


          if (data.planner) {
            setPlanner(cleanPlannerData({
              ...DEFAULT_PLANNER,
              ...data.planner
            }));
          } else {
            setPlanner(cleanPlannerData(DEFAULT_PLANNER));
          }


          if (data.notifications) {
            setNotifications(cleanNotifications(data.notifications));
          } else {
            setNotifications(DEFAULT_NOTIFICATIONS);
          }
          setBlogPosts(mergeBlogPosts(data.blogPosts));
        }


        // --------------------------------------------------------
        // COMPLETELY NEW USER
        // --------------------------------------------------------

        else {
          const newProfile = {
            ...DEFAULT_PROFILE,
            name: user.displayName || "User",
            email: user.email || ""
          };

          setProfile(newProfile);
          setPlanner(cleanPlannerData(DEFAULT_PLANNER));
          setNotifications(DEFAULT_NOTIFICATIONS);
          setBlogPosts(BLOG_POSTS);

          await setDoc(userDocRef, {
            profile: newProfile,
            planner: cleanPlannerData(DEFAULT_PLANNER),
            notifications: DEFAULT_NOTIFICATIONS
          });
        }

        setDataReady(true);
      } catch (error) {
        console.error(
          "Error loading user data from Firebase:",
          error
        );

        // App should not get permanently stuck even if Firebase fails
        setDataReady(true);
      }
    };

    loadFirebaseData();
  }, [user]);


  // ============================================================
  // LOAD EXPENSES AND CATEGORIES FOR CURRENT USER
  // ============================================================

  useEffect(() => {
    if (!user) return;

    const loadExpenseTrackerData = async () => {
      try {
        const expensesRef = collection(db, "expenses");

        const expensesQuery = query(
          expensesRef,
          where("userId", "==", user.uid)
        );

        const expensesSnapshot =
          await getDocs(expensesQuery);

        const loadedExpenses =
          expensesSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data()
          }));

        setExpenses(loadedExpenses);


        // ---------------- CATEGORIES ----------------

        const categoriesRef =
          collection(db, "categories");

        const categoriesQuery = query(
          categoriesRef,
          where("userId", "==", user.uid)
        );

        const categoriesSnapshot =
          await getDocs(categoriesQuery);

        const loadedCategories =
          categoriesSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data()
          }));

        setCategories(loadedCategories);

      } catch (error) {
        console.error(
          "Error loading expense tracker data:",
          error
        );
      }
    };

    loadExpenseTrackerData();
  }, [user]);


  // ============================================================
  // SYNC PROFILE / PLANNER / NOTIFICATIONS TO FIREBASE
  // Only AFTER initial data has loaded
  // ============================================================

  useEffect(() => {
    if (!user || !dataReady) return;

    const syncFirebaseData = async () => {
      try {
        const userDocRef =
          doc(db, "users", user.uid);

        await setDoc(
          userDocRef,
          {
            profile,
            planner,
            notifications,
            blogPosts
          },
          {
            merge: true
          }
        );
      } catch (error) {
        console.error(
          "Error syncing state to Firebase:",
          error
        );
      }
    };

    syncFirebaseData();
  }, [
    profile,
    planner,
    notifications,
    blogPosts,
    user,
    dataReady
  ]);


  // ============================================================
  // RECIPE API
  // ============================================================

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const response =
          await fetch("/api/random?limit=12");

        if (response.ok) {
          const data = await response.json();

          if (
            Array.isArray(data) &&
            data.length > 0
          ) {
            setRecipes(data);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching random recipes:",
          error
        );
      }
    };

    fetchRandomRecipes();
  }, []);


  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...notif
    };

    setNotifications((prev) => [
      newNotif,
      ...prev
    ]);
  };


  // ============================================================
  // EXPENSE OPERATIONS
  // ============================================================

  const addExpense = async (expense) => {
    try {
      if (!user) {
        throw new Error("Please log in first");
      }

      const newExpense = {
        userId: user.uid,
        amount: Number(expense.amount),
        category: expense.category,
        description: expense.description || "",
        date:
          expense.date ||
          new Date()
            .toISOString()
            .split("T")[0]
      };

      const expenseRef = await addDoc(
        collection(db, "expenses"),
        newExpense
      );

      const formattedExpense = {
        id: expenseRef.id,
        ...newExpense
      };

      setExpenses((prev) => [
        formattedExpense,
        ...prev
      ]);

      addNotification({
        type: "expense",
        text: `Added expense: ₹${Number(
          newExpense.amount
        ).toFixed(2)} for ${newExpense.description}`,
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        ),
      });

      return formattedExpense;

    } catch (error) {
      console.error(
        "Error adding expense:",
        error
      );

      throw error;
    }
  };


  const deleteExpense = async (id) => {
    try {
      await deleteDoc(
        doc(db, "expenses", id)
      );

      setExpenses((prev) =>
        prev.filter(
          (expense) => expense.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Error deleting expense:",
        error
      );

      throw error;
    }
  };


  const updateExpense = async (
    id,
    updatedExpense
  ) => {
    try {
      if (!user) {
        throw new Error("Please log in first");
      }

      const expenseRef =
        doc(db, "expenses", id);

      const updatedData = {
        amount: Number(updatedExpense.amount),
        category: updatedExpense.category,
        description:
          updatedExpense.description || "",
        date:
          updatedExpense.date ||
          new Date()
            .toISOString()
            .split("T")[0]
      };

      await updateDoc(
        expenseRef,
        updatedData
      );

      const formattedExpense = {
        id,
        userId: user.uid,
        ...updatedData
      };

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id
            ? {
                ...expense,
                ...formattedExpense
              }
            : expense
        )
      );

      return formattedExpense;

    } catch (error) {
      console.error(
        "Error updating expense:",
        error
      );

      throw error;
    }
  };


  // ============================================================
  // CATEGORY OPERATIONS
  // ============================================================

  const addCategory = async (category) => {
    try {
      if (!user) {
        throw new Error("Please log in first");
      }

      const categoryName =
        category.name.trim();

      const alreadyExists =
        categories.some(
          (existingCategory) =>
            existingCategory.name
              .trim()
              .toLowerCase() ===
            categoryName.toLowerCase()
        );

      if (alreadyExists) {
        throw new Error(
          "Category already exists"
        );
      }

      const newCategory = {
        userId: user.uid,
        name: categoryName,
        color:
          category.color || "#C85A32",
        limit:
          Number(category.limit) || 200
      };

      const categoryRef = await addDoc(
        collection(db, "categories"),
        newCategory
      );

      const formattedCategory = {
        id: categoryRef.id,
        ...newCategory
      };

      setCategories((prev) => [
        ...prev,
        formattedCategory
      ]);

      return formattedCategory;

    } catch (error) {
      console.error(
        "Error adding category:",
        error
      );

      throw error;
    }
  };


  const updateCategory = async (
    id,
    updatedCategory
  ) => {
    try {
      if (!user) {
        throw new Error("Please log in first");
      }

      const categoryName =
        updatedCategory.name.trim();

      const alreadyExists =
        categories.some(
          (category) =>
            category.id !== id &&
            category.name
              .trim()
              .toLowerCase() ===
              categoryName.toLowerCase()
        );

      if (alreadyExists) {
        throw new Error(
          "Category already exists"
        );
      }

      const categoryRef =
        doc(db, "categories", id);

      const updatedData = {
        name: categoryName,
        color:
          updatedCategory.color ||
          "#C85A32",
        limit:
          Number(updatedCategory.limit) || 200
      };

      await updateDoc(
        categoryRef,
        updatedData
      );

      const formattedCategory = {
        id,
        userId: user.uid,
        ...updatedData
      };

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id
            ? {
                ...category,
                ...updatedData
              }
            : category
        )
      );

      return formattedCategory;

    } catch (error) {
      console.error(
        "Error updating category:",
        error
      );

      throw error;
    }
  };


  const deleteCategory = async (id) => {
    try {
      await deleteDoc(
        doc(db, "categories", id)
      );

      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Error deleting category:",
        error
      );

      throw error;
    }
  };


  // ============================================================
  // RECIPE OPERATIONS
  // ============================================================

  const toggleRecipeSaved = (id) => {
    const stringId = String(id);

    setProfile((prev) => {
      const savedRecipes =
        prev.savedRecipes || [];

      const isSaved = savedRecipes
        .map(String)
        .includes(stringId);

      const updatedRecipes = isSaved
        ? savedRecipes
            .map(String)
            .filter(
              (recipeId) =>
                recipeId !== stringId
            )
        : [
            ...savedRecipes.map(String),
            stringId
          ];

      return {
        ...prev,
        savedRecipes: updatedRecipes
      };
    });
  };


  // ============================================================
  // BLOG OPERATIONS
  // ============================================================

  const toggleBlogLiked = (id) => {
    const stringId = String(id);

    setProfile((prev) => {
      const likedBlogs =
        prev.likedBlogs || [];

      const isLiked = likedBlogs
        .map(String)
        .includes(stringId);

      const updatedBlogs = isLiked
        ? likedBlogs
            .map(String)
            .filter(
              (blogId) =>
                blogId !== stringId
            )
        : [
            ...likedBlogs.map(String),
            stringId
          ];

      return {
        ...prev,
        likedBlogs: updatedBlogs
      };
    });
  };


  // ============================================================
  // PLANNER OPERATIONS
  // ============================================================

  const toggleTask = (id) => {
    setPlanner((prev) => ({
      ...prev,

      tasks: prev.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    }));
  };


  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false
    };

    setPlanner((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        newTask
      ]
    }));
  };


  const deleteTask = (id) => {
    setPlanner((prev) => ({
      ...prev,

      tasks: prev.tasks.filter(
        (task) => task.id !== id
      )
    }));
  };


  const updateNotes = (notes) => {
    setPlanner((prev) => ({
      ...prev,
      notes
    }));
  };


  const toggleHabitDay = (
    habitId,
    day
  ) => {
    setPlanner((prev) => ({
      ...prev,

      habits: prev.habits.map(
        (habit) => {
          if (habit.id === habitId) {
            return {
              ...habit,

              history: {
                ...habit.history,
                [day]: !habit.history[day]
              }
            };
          }

          return habit;
        }
      )
    }));
  };


  const updateWeeklyAnchor = (
    day,
    text
  ) => {
    setPlanner((prev) => ({
      ...prev,

      weekly: {
        ...prev.weekly,
        [day]: text
      }
    }));
  };


  const addPlannerGoal = (goal) => {
    setPlanner((prev) => ({
      ...prev,

      goals: [
        ...(prev.goals || []),
        goal
      ]
    }));
  };


  const deletePlannerGoal = (index) => {
    setPlanner((prev) => ({
      ...prev,

      goals: (
        prev.goals || []
      ).filter(
        (_, i) => i !== index
      )
    }));
  };


  const addPlannerHabit = (name) => {
    const newHabit = {
      id: "h_" + Date.now().toString(),
      name,

      history: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false
      }
    };

    setPlanner((prev) => ({
      ...prev,

      habits: [
        ...(prev.habits || []),
        newHabit
      ]
    }));
  };


  const deletePlannerHabit = (id) => {
    setPlanner((prev) => ({
      ...prev,

      habits: (
        prev.habits || []
      ).filter(
        (habit) =>
          habit.id !== id
      )
    }));
  };


  // ============================================================
  // NOTIFICATION OPERATIONS
  // ============================================================

  const clearNotifications = () => {
    setNotifications([]);
  };


  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true
            }
          : notification
      )
    );
  };


  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };


  // ============================================================
  // CONTEXT PROVIDER
  // ============================================================

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,

        categories,
        expenses,

        recipes,
        blogPosts,

        planner,
        notifications,

        addExpense,
        deleteExpense,
        updateExpense,

        addCategory,
        updateCategory,
        deleteCategory,

        toggleRecipeSaved,
        toggleBlogLiked,

        toggleTask,
        addTask,
        deleteTask,

        updateNotes,
        toggleHabitDay,
        updateWeeklyAnchor,

        addPlannerGoal,
        deletePlannerGoal,

        addPlannerHabit,
        deletePlannerHabit,

        addNotification,
        clearNotifications,
        markNotificationAsRead,
        deleteNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
