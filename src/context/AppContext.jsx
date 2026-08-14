import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ================= API URLs =================

const EXPENSE_API = "http://localhost:5000/api/expenses";
const CATEGORY_API = "http://localhost:5000/api/categories";

export const AppContext = createContext();

// ================= HELPER =================

const getInitialData = (key, fallback) => {
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(`Error parsing localStorage key ${key}:`, error);
    }
  }

  return fallback;
};

// ================= DEFAULT CATEGORIES =================

const DEFAULT_CATEGORIES = [
  {
    name: "Groceries",
    color: "#C85A32",
    limit: 400
  },
  {
    name: "Cozy Cafe",
    color: "#D4A373",
    limit: 300
  },
  {
    name: "Home Decor",
    color: "#606C38",
    limit: 500
  },
  {
    name: "Self Care",
    color: "#8C4F2B",
    limit: 300
  },
  {
    name: "Leisure",
    color: "#8B7D74",
    limit: 300
  }
];

export const AppProvider = ({ children }) => {
  // ================= PROFILE =================

  const [profile, setProfile] = useState(() =>
    getInitialData("solosphere_profile", {
      name: "Anshika",
      avatar: "default",
      monthlyBudget: 1200,
      wellnessGoal:
        "To cultivate daily mindfulness and appreciate the quiet moments.",
      streak: 8,
      savedRecipes: ["2", "4"],
      likedBlogs: [],
      coffeeLimit: 2,
      wakeTime: "07:30",
      quietHour: "21:00"
    })
  );

  // ================= CATEGORIES =================

  const [categories, setCategories] = useState([]);

  // ================= EXPENSES =================

  const [expenses, setExpenses] = useState([]);

  // ================= RECIPES =================

  const INITIAL_RECIPES = [
    {
      id: 1,
      title: "Warm Fig & Honey Oatmeal",
      image:
        "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=800",
      time: "15m",
      difficulty: "Easy",
      calories: "320 kcal",
      cuisine: "Breakfast",
      description:
        "A cozy, steaming bowl of rolled oats cooked in almond milk, topped with sweet fresh figs, a generous drizzle of local honey, toasted pecans, and a pinch of cinnamon.",
      ingredients: [
        "1 cup Rolled Oats",
        "2 cups Almond Milk (or water)",
        "3 Fresh Figs, sliced",
        "1 tbsp Local Honey",
        "2 tbsp Toasted Pecans, chopped",
        "1/2 tsp Ground Cinnamon",
        "Pinch of sea salt"
      ],
      steps: [
        "In a small saucepan, bring the almond milk and salt to a gentle boil.",
        "Stir in the rolled oats and reduce the heat to low. Simmer for about 10 minutes, stirring occasionally, until the oats are thick and creamy.",
        "Stir in the ground cinnamon and half of the chopped pecans.",
        "Spoon the hot oatmeal into your favorite ceramic bowl.",
        "Arrange the fresh fig slices beautifully on top.",
        "Drizzle with honey and scatter the remaining pecans on top. Enjoy warm."
      ],
      nutrition: {
        protein: "8g",
        carbs: "54g",
        fat: "9g",
        fiber: "7g"
      }
    },
    {
      id: 2,
      title: "Miso Butter Roasted Pumpkin",
      image:
        "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=800",
      time: "40m",
      difficulty: "Medium",
      calories: "280 kcal",
      cuisine: "Cozy Dinner",
      description:
        "Golden, sweet roasted pumpkin wedges glazed with an umami-rich white miso and brown butter mixture, finished with toasted sesame seeds and fresh scallions.",
      ingredients: [
        "1 small Kabocha or Sugar Pumpkin, cut into wedges",
        "2 tbsp Unsalted Butter (melted)",
        "1.5 tbsp White Miso Paste",
        "1 tbsp Maple Syrup",
        "1 tbsp Olive Oil",
        "1 tbsp Sesame Seeds, toasted",
        "2 stalks Green Scallion, sliced"
      ],
      steps: [
        "Preheat your oven to 400°F (200°C) and line a baking sheet with parchment paper.",
        "Wash the pumpkin, scoop out the seeds, and cut it into wedges.",
        "In a small bowl, whisk together the melted butter, miso paste, maple syrup, and olive oil.",
        "Arrange the pumpkin wedges on the baking sheet and brush with the miso butter mixture.",
        "Roast in the oven for 30–35 minutes until golden.",
        "Transfer to a serving plate and garnish with sesame seeds and scallions."
      ],
      nutrition: {
        protein: "4g",
        carbs: "22g",
        fat: "14g",
        fiber: "5g"
      }
    },
    {
      id: 3,
      title: "Creamy Tuscan Wild Mushroom Pasta",
      image:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800",
      time: "25m",
      difficulty: "Easy",
      calories: "540 kcal",
      cuisine: "Lunch",
      description:
        "Tender pasta tossed in a velvety garlic and herb sauce with sautéed wild mushrooms, baby spinach, and sun-dried tomatoes.",
      ingredients: [
        "100g Pasta",
        "150g Mixed Wild Mushrooms, sliced",
        "2 cloves Garlic, minced",
        "30g Sun-dried Tomatoes, sliced",
        "1 cup Fresh Baby Spinach",
        "1/2 cup Heavy Cream",
        "1 tbsp Olive Oil"
      ],
      steps: [
        "Bring a large pot of salted water to a boil and cook the pasta.",
        "Heat olive oil in a skillet and cook mushrooms until browned.",
        "Add garlic and sun-dried tomatoes.",
        "Pour in cream and bring to a gentle simmer.",
        "Add pasta and spinach and toss together.",
        "Season and serve."
      ],
      nutrition: {
        protein: "14g",
        carbs: "68g",
        fat: "24g",
        fiber: "4g"
      }
    },
    {
      id: 4,
      title: "Warm Cardamom Pear Crisp",
      image:
        "https://images.unsplash.com/photo-1541014741259-df5290dbb82e?auto=format&fit=crop&q=80&w=800",
      time: "35m",
      difficulty: "Medium",
      calories: "310 kcal",
      cuisine: "Dessert",
      description:
        "Sweet, juicy pears baked with aromatic ground cardamom under a rustic, crunchy oat and pecan crumble topping.",
      ingredients: [
        "3 Pears",
        "1/2 tsp Ground Cardamom",
        "1 tsp Lemon Juice",
        "1 tbsp Maple Syrup",
        "1/2 cup Rolled Oats",
        "1/4 cup Pecans"
      ],
      steps: [
        "Preheat oven to 375°F.",
        "Toss pears with cardamom, lemon juice and maple syrup.",
        "Prepare the crumble topping.",
        "Scatter topping over pears.",
        "Bake for 25–30 minutes.",
        "Serve warm."
      ],
      nutrition: {
        protein: "3g",
        carbs: "45g",
        fat: "12g",
        fiber: "6g"
      }
    }
  ];

  const [recipes, setRecipes] = useState(INITIAL_RECIPES);

  // ================= PLANNER =================

  const [planner, setPlanner] = useState(() =>
    getInitialData("solosphere_planner", {
      tasks: [
        {
          id: "t1",
          text: "Water the monstera and fiddle leaf fig",
          completed: true
        },
        {
          id: "t2",
          text: "Prepare sourdough starter for baking",
          completed: false
        },
        {
          id: "t3",
          text: "Tidy up the cozy reading nook",
          completed: false
        },
        {
          id: "t4",
          text: "Go for a peaceful 20-minute evening walk",
          completed: true
        },
        {
          id: "t5",
          text: "Write down 3 things I am grateful for today",
          completed: false
        }
      ],

      weekly: {
        Mon: "Buy fresh flowers & groceries",
        Tue: "Clean kitchen space & wash linen",
        Wed: "Cozy movie night & chamomile tea",
        Thu: "Read 3 chapters of my novel",
        Fri: "Try a new soup recipe",
        Sat: "Visit the local pottery studio",
        Sun: "Meal prep and journal time"
      },

      goals: [
        "Read 2 books this month",
        "Maintain an 8-day wellness habit streak",
        "Keep weekly cafe spend under ₹2000"
      ],

      notes:
        "Remember: Living alone is a gift of time and space. Take it slow, decorate with things that tell a story, and cook meals that feel like a warm hug.",

      habits: [
        {
          id: "h1",
          name: "Morning Journaling",
          history: {
            Mon: true,
            Tue: true,
            Wed: false,
            Thu: true,
            Fri: true,
            Sat: true,
            Sun: false
          }
        },
        {
          id: "h2",
          name: "15m Stretching",
          history: {
            Mon: true,
            Tue: false,
            Wed: true,
            Thu: true,
            Fri: false,
            Sat: true,
            Sun: true
          }
        },
        {
          id: "h3",
          name: "No Screens After 10 PM",
          history: {
            Mon: false,
            Tue: true,
            Wed: true,
            Thu: false,
            Fri: true,
            Sat: false,
            Sun: true
          }
        },
        {
          id: "h4",
          name: "Water Intake (2L)",
          history: {
            Mon: true,
            Tue: true,
            Wed: true,
            Thu: true,
            Fri: true,
            Sat: false,
            Sun: false
          }
        }
      ]
    })
  );

  // ================= BLOG POSTS =================

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Slow Living Alone: Finding Comfort in Quiet Spaces",
      excerpt:
        "How to transform your single apartment from just a place to sleep into a true sanctuary.",
      content:
        "Living alone is often framed as a transitional phase, but it is actually one of the most powerful opportunities to understand who you are.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
      readTime: "6 min read",
      date: "July 11, 2026",
      tag: "Mindfulness",
      featured: true
    },
    {
      id: 2,
      title: "Designing a Cozy Reading Nook on a Tiny Budget",
      excerpt:
        "Creating a dedicated space for books doesn’t require a massive library.",
      content:
        "A reading nook is more than just a chair; it is an invitation.",
      image:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
      readTime: "4 min read",
      date: "July 09, 2026",
      tag: "Cozy Spaces",
      featured: false
    },
    {
      id: 3,
      title: "A Solo Cook’s Guide to Meal Prep Without the Waste",
      excerpt:
        "Learn how to prep base components that adapt into different meals.",
      content:
        "The biggest challenge of solo cooking is waste.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      readTime: "5 min read",
      date: "July 06, 2026",
      tag: "Solo Kitchen",
      featured: false
    },
    {
      id: 4,
      title: "The Magic of the Evening Tea Ritual",
      excerpt:
        "How a slow-brewed pot can signal to your body that it is time to rest.",
      content:
        "Our days are filled with constant digital stimulation.",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
      readTime: "3 min read",
      date: "July 02, 2026",
      tag: "Self Care",
      featured: false
    }
  ];

  // ================= NOTIFICATIONS =================

  const [notifications, setNotifications] = useState(() =>
    getInitialData("solosphere_notifications", [
      {
        id: "1",
        type: "reminder",
        text: "Your sourdough starter needs feeding!",
        time: "10:15 AM",
        group: "Today"
      },
      {
        id: "2",
        type: "info",
        text: "You completed all your wellness habits yesterday. Great job!",
        time: "9:00 PM",
        group: "Yesterday"
      }
    ])
  );

  // ================= AUTH =================

  const { user } = useAuth();

  // ================= FETCH BACKEND DATA =================

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        // Fetch expenses and categories
        const [expenseResponse, categoryResponse] = await Promise.all([
          fetch(EXPENSE_API),
          fetch(CATEGORY_API)
        ]);

        if (!expenseResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const expenseData = await expenseResponse.json();
        let categoryData = await categoryResponse.json();

        // If no categories exist in backend, create default ones
        if (!Array.isArray(categoryData) || categoryData.length === 0) {
          const createdCategories = [];

          for (const category of DEFAULT_CATEGORIES) {
            try {
              const response = await fetch(CATEGORY_API, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  name: category.name
                })
              });

              if (response.ok) {
                const data = await response.json();

                createdCategories.push({
                  ...data,
                  id: data._id,
                  color: category.color,
                  limit: category.limit
                });
              }
            } catch (error) {
              console.error(
                `Error creating category ${category.name}:`,
                error
              );
            }
          }

          categoryData = createdCategories;
        }

        const formattedExpenses = Array.isArray(expenseData)
          ? expenseData.map((expense) => ({
              ...expense,
              id: expense._id,
              date: expense.date
                ? new Date(expense.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }))
          : [];

        const formattedCategories = Array.isArray(categoryData)
          ? categoryData.map((category, index) => ({
              ...category,
              id: category._id || category.id,
              color:
                category.color ||
                DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length]?.color ||
                "#C85A32",
              limit:
                category.limit ||
                DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length]?.limit ||
                200
            }))
          : [];

        setExpenses(formattedExpenses);
        setCategories(formattedCategories);

        console.log("Expenses loaded:", formattedExpenses);
        console.log("Categories loaded:", formattedCategories);
      } catch (error) {
        console.error("Error fetching expense tracker data:", error);
      }
    };

    fetchExpenseData();
  }, []);

  // ================= FIREBASE LOAD =================

  useEffect(() => {
    if (!user) return;

    const loadFirebaseData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();

          if (data.profile) {
            setProfile(data.profile);
          }

          if (data.planner) {
            setPlanner(data.planner);
          }

          if (data.notifications) {
            setNotifications(data.notifications);
          }
        } else {
          await setDoc(userDocRef, {
            profile: {
              ...profile,
              name: user.displayName || profile.name,
              email: user.email || ""
            },
            planner,
            notifications
          });
        }
      } catch (error) {
        console.error("Error loading user data from Firebase:", error);
      }
    };

    loadFirebaseData();
  }, [user]);

  // ================= FIREBASE SYNC =================

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    setDoc(
      userDocRef,
      {
        profile,
        planner,
        notifications
      },
      { merge: true }
    ).catch((error) => {
      console.error("Error syncing state to Firebase:", error);
    });
  }, [profile, planner, notifications, user]);

  // ================= LOCAL STORAGE =================

  useEffect(() => {
    localStorage.setItem(
      "solosphere_profile",
      JSON.stringify(profile)
    );
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "solosphere_planner",
      JSON.stringify(planner)
    );
  }, [planner]);

  useEffect(() => {
    localStorage.setItem(
      "solosphere_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // ================= RECIPE API =================

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const response = await fetch("/api/random?limit=12");

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            setRecipes(data);
          }
        }
      } catch (error) {
        console.error("Error fetching random recipes:", error);
      }
    };

    fetchRandomRecipes();
  }, []);

  // ================= ADD NOTIFICATION =================

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now().toString(),
      ...notif
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ================= ADD EXPENSE =================

  const addExpense = async (expense) => {
    try {
      const response = await fetch(EXPENSE_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          amount: Number(expense.amount),
          category: expense.category,
          description: expense.description,
          date:
            expense.date ||
            new Date().toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add expense"
        );
      }

      const formattedExpense = {
        ...data,
        id: data._id || data.id,
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      };

      setExpenses((prev) => [
        formattedExpense,
        ...prev
      ]);

      addNotification({
        type: "expense",
        text: `Added expense: ₹${Number(
          data.amount
        ).toFixed(2)} for ${data.description}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        group: "Today"
      });

      return formattedExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  };

  // ================= DELETE EXPENSE =================

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(
        `${EXPENSE_API}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  };

  // ================= UPDATE EXPENSE =================

  const updateExpense = async (id, updatedExpense) => {
    try {
      const response = await fetch(
        `${EXPENSE_API}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...updatedExpense,
            amount: Number(updatedExpense.amount)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update expense"
        );
      }

      const formattedExpense = {
        ...data,
        id: data._id || data.id,
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      };

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id
            ? formattedExpense
            : expense
        )
      );

      return formattedExpense;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  // ================= ADD CATEGORY =================

  const addCategory = async (category) => {
    try {
      const response = await fetch(CATEGORY_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: category.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add category"
        );
      }

      const formattedCategory = {
        ...data,
        id: data._id || data.id,
        color: category.color || "#C85A32",
        limit: Number(category.limit) || 200
      };

      setCategories((prev) => [
        ...prev,
        formattedCategory
      ]);

      return formattedCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  // ================= UPDATE CATEGORY =================

  const updateCategory = async (
    id,
    updatedCategory
  ) => {
    try {
      const response = await fetch(
        `${CATEGORY_API}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: updatedCategory.name
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update category"
        );
      }

      const formattedCategory = {
        ...data,
        id: data._id || data.id,
        color: updatedCategory.color || "#C85A32",
        limit: Number(updatedCategory.limit) || 200
      };

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id
            ? formattedCategory
            : category
        )
      );

      return formattedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  // ================= DELETE CATEGORY =================

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${CATEGORY_API}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  // ================= RECIPE OPERATIONS =================

  const toggleRecipeSaved = (id) => {
    const stringId = String(id);

    setProfile((prev) => {
      const savedRecipes = prev.savedRecipes || [];

      const isSaved = savedRecipes
        .map(String)
        .includes(stringId);

      const updatedRecipes = isSaved
        ? savedRecipes
            .map(String)
            .filter((recipeId) => recipeId !== stringId)
        : [...savedRecipes.map(String), stringId];

      return {
        ...prev,
        savedRecipes: updatedRecipes
      };
    });
  };

  // ================= BLOG OPERATIONS =================

  const toggleBlogLiked = (id) => {
    const stringId = String(id);

    setProfile((prev) => {
      const likedBlogs = prev.likedBlogs || [];

      const isLiked = likedBlogs
        .map(String)
        .includes(stringId);

      const updatedBlogs = isLiked
        ? likedBlogs
            .map(String)
            .filter((blogId) => blogId !== stringId)
        : [...likedBlogs.map(String), stringId];

      return {
        ...prev,
        likedBlogs: updatedBlogs
      };
    });
  };

  // ================= PLANNER OPERATIONS =================

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
      tasks: [...prev.tasks, newTask]
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

  const toggleHabitDay = (habitId, day) => {
    setPlanner((prev) => ({
      ...prev,

      habits: prev.habits.map((habit) => {
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
      })
    }));
  };

  const updateWeeklyAnchor = (day, text) => {
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

      goals: (prev.goals || []).filter(
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

      habits: (prev.habits || []).filter(
        (habit) => habit.id !== id
      )
    }));
  };

  // ================= NOTIFICATION OPERATIONS =================

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
        (notification) => notification.id !== id
      )
    );
  };

  // ================= CONTEXT PROVIDER =================

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