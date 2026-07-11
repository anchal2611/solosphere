import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Helper to load from localStorage or fallback to default
const getInitialData = (key, fallback) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing localStorage key " + key, e);
    }
  }
  return fallback;
};

export const AppProvider = ({ children }) => {
  // 1. Profile State
  const [profile, setProfile] = useState(() => getInitialData('solosphere_profile', {
    name: 'Anshika',
    avatar: 'default',
    monthlyBudget: 1200,
    wellnessGoal: 'To cultivate daily mindfulness and appreciate the quiet moments.',
    streak: 8,
    savedRecipes: [1, 3]
  }));

  // 2. Expense Categories State
  const [categories, setCategories] = useState(() => getInitialData('solosphere_categories', [
    { id: '1', name: 'Groceries', color: '#C85A32', limit: 400 }, // Terracotta
    { id: '2', name: 'Cozy Cafe', color: '#D4A373', limit: 150 }, // Gold
    { id: '3', name: 'Home Decor', color: '#606C38', limit: 250 }, // Olive
    { id: '4', name: 'Self Care', color: '#8C4F2B', limit: 200 },  // Cinnamon
    { id: '5', name: 'Leisure', color: '#8B7D74', limit: 200 }    // Dusty Brown
  ]));

  // 3. Expenses State
  const [expenses, setExpenses] = useState(() => getInitialData('solosphere_expenses', [
    { id: '1', date: '2026-07-11', amount: 12.50, description: 'Cardamom Latte & Scone', category: 'Cozy Cafe' },
    { id: '2', date: '2026-07-10', amount: 62.80, description: 'Weekly farmers market haul', category: 'Groceries' },
    { id: '3', date: '2026-07-09', amount: 48.00, description: 'Scented beeswax candle & linen mist', category: 'Self Care' },
    { id: '4', date: '2026-07-07', amount: 120.00, description: 'Vintage ceramic vase', category: 'Home Decor' },
    { id: '5', date: '2026-07-05', amount: 28.50, description: 'Paperback novel & journal notebook', category: 'Leisure' }
  ]));

  // 4. Recipes Database (ReadOnly mockup list, but saved state is in profile.savedRecipes)
  const recipes = [
    {
      id: 1,
      title: 'Warm Fig & Honey Oatmeal',
      image: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=800',
      time: '15m',
      difficulty: 'Easy',
      calories: '320 kcal',
      cuisine: 'Breakfast',
      description: 'A cozy, steaming bowl of rolled oats cooked in almond milk, topped with sweet fresh figs, a generous drizzle of local honey, toasted pecans, and a pinch of cinnamon.',
      ingredients: [
        '1 cup Rolled Oats',
        '2 cups Almond Milk (or water)',
        '3 Fresh Figs, sliced',
        '1 tbsp Local Honey',
        '2 tbsp Toasted Pecans, chopped',
        '1/2 tsp Ground Cinnamon',
        'Pinch of sea salt'
      ],
      steps: [
        'In a small saucepan, bring the almond milk and salt to a gentle boil.',
        'Stir in the rolled oats and reduce the heat to low. Simmer for about 10 minutes, stirring occasionally, until the oats are thick and creamy.',
        'Stir in the ground cinnamon and half of the chopped pecans.',
        'Spoon the hot oatmeal into your favorite ceramic bowl.',
        'Arrange the fresh fig slices beautifully on top.',
        'Drizzle with honey and scatter the remaining pecans on top. Enjoy warm.'
      ],
      nutrition: {
        protein: '8g',
        carbs: '54g',
        fat: '9g',
        fiber: '7g'
      }
    },
    {
      id: 2,
      title: 'Miso Butter Roasted Pumpkin',
      image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=800',
      time: '40m',
      difficulty: 'Medium',
      calories: '280 kcal',
      cuisine: 'Cozy Dinner',
      description: 'Golden, sweet roasted pumpkin wedges glazed with an umami-rich white miso and brown butter mixture, finished with toasted sesame seeds and fresh scallions.',
      ingredients: [
        '1 small Kabocha or Sugar Pumpkin, cut into wedges',
        '2 tbsp Unsalted Butter (melted)',
        '1.5 tbsp White Miso Paste',
        '1 tbsp Maple Syrup',
        '1 tbsp Olive Oil',
        '1 tbsp Sesame Seeds, toasted',
        '2 stalks Green Scallion, sliced'
      ],
      steps: [
        'Preheat your oven to 400°F (200°C) and line a baking sheet with parchment paper.',
        'Wash the pumpkin, scoop out the seeds, and cut it into wedges (about 1-inch thick). Keep the skin on for texture.',
        'In a small bowl, whisk together the melted butter, miso paste, maple syrup, and olive oil until smooth.',
        'Arrange the pumpkin wedges on the baking sheet and brush both sides generously with the miso butter mixture.',
        'Roast in the oven for 30–35 minutes, turning halfway through, until transition edges are golden and caramelized.',
        'Transfer to a serving plate, garnish with sesame seeds and fresh scallions.'
      ],
      nutrition: {
        protein: '4g',
        carbs: '22g',
        fat: '14g',
        fiber: '5g'
      }
    },
    {
      id: 3,
      title: 'Creamy Tuscan Wild Mushroom Pasta',
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
      time: '25m',
      difficulty: 'Easy',
      calories: '540 kcal',
      cuisine: 'Lunch',
      description: 'Tender pasta tossed in a velvety garlic and herb sauce with sautéed wild mushrooms, baby spinach, and sun-dried tomatoes. Perfect for a cozy solo evening.',
      ingredients: [
        '100g Pasta (Tagliatelle or Rigatoni)',
        '150g Mixed Wild Mushrooms (Cremini, Shiitake, Oyster), sliced',
        '2 cloves Garlic, minced',
        '30g Sun-dried Tomatoes, sliced',
        '1 cup Fresh Baby Spinach',
        '1/2 cup Heavy Cream (or coconut cream)',
        '1 tbsp Olive Oil',
        '1/4 cup Grated Parmesan (optional)',
        'Fresh thyme and black pepper to taste'
      ],
      steps: [
        'Bring a large pot of salted water to a boil and cook the pasta according to package instructions. Reserve 1/2 cup of pasta water before draining.',
        'Meanwhile, heat olive oil in a skillet over medium-high heat. Add sliced mushrooms and cook until browned and moisture evaporates (about 6-8 minutes).',
        'Add minced garlic and sun-dried tomatoes. Sauté for 1-2 minutes until fragrant.',
        'Reduce heat to low, pour in the cream, and bring to a gentle simmer.',
        'Add the cooked pasta and baby spinach directly to the skillet. Toss gently until spinach is wilted. If too dry, add a splash of reserved pasta water.',
        'Season with fresh thyme, freshly cracked black pepper, and top with grated parmesan before serving.'
      ],
      nutrition: {
        protein: '14g',
        carbs: '68g',
        fat: '24g',
        fiber: '4g'
      }
    },
    {
      id: 4,
      title: 'Warm Cardamom Pear Crisp',
      image: 'https://images.unsplash.com/photo-1541014741259-df5290dbb82e?auto=format&fit=crop&q=80&w=800',
      time: '35m',
      difficulty: 'Medium',
      calories: '310 kcal',
      cuisine: 'Dessert',
      description: 'Sweet, juicy pears baked with aromatic ground cardamom under a rustic, crunchy oat and pecan crumble topping. Simply comforting.',
      ingredients: [
        '3 Pears (ripe but firm), peeled and diced',
        '1/2 tsp Ground Cardamom',
        '1 tsp Lemon Juice',
        '1 tbsp Maple Syrup',
        '1/2 cup Rolled Oats (for crumble)',
        '1/4 cup Pecans, chopped',
        '2 tbsp Cinnamon Brown Sugar',
        '2 tbsp Cold Butter, cubed'
      ],
      steps: [
        'Preheat oven to 375°F (190°C) and grease a small baking dish.',
        'Toss the diced pears with the ground cardamom, lemon juice, and maple syrup, then arrange them in the baking dish.',
        'In a bowl, combine rolled oats, chopped pecans, brown sugar, and cold butter cubes. Rub the butter into the oats with your fingers until it forms clumps.',
        'Scatter the crumble topping evenly over the pears.',
        'Bake for 25–30 minutes until the fruit is bubbling and the top is golden and crisp.',
        'Let cool slightly and serve warm as is, or with a scoop of vanilla ice cream.'
      ],
      nutrition: {
        protein: '3g',
        carbs: '45g',
        fat: '12g',
        fiber: '6g'
      }
    }
  ];

  // 5. Planner State
  const [planner, setPlanner] = useState(() => getInitialData('solosphere_planner', {
    tasks: [
      { id: 't1', text: 'Water the monstera and fiddle leaf fig', completed: true },
      { id: 't2', text: 'Prepare sourdough starter for baking', completed: false },
      { id: 't3', text: 'Tidy up the cozy reading nook', completed: false },
      { id: 't4', text: 'Go for a peaceful 20-minute evening walk', completed: true },
      { id: 't5', text: 'Write down 3 things I am grateful for today', completed: false }
    ],
    weekly: {
      Mon: 'Buy fresh flowers & groceries',
      Tue: 'Clean kitchen space & wash linen',
      Wed: 'Cozy movie night & chamomile tea',
      Thu: 'Read 3 chapters of my novel',
      Fri: 'Try a new soup recipe',
      Sat: 'Visit the local pottery studio',
      Sun: 'Meal prep and journal time'
    },
    goals: [
      'Read 2 books this month',
      'Maintain an 8-day wellness habit streak',
      'Keep weekly cafe spend under $40'
    ],
    notes: 'Remember: Living alone is a gift of time and space. Take it slow, decorate with things that tell a story, and cook meals that feel like a warm hug.',
    habits: [
      { id: 'h1', name: 'Morning Journaling', history: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false } },
      { id: 'h2', name: '15m Stretching', history: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: false, Sat: true, Sun: true } },
      { id: 'h3', name: 'No Screens After 10 PM', history: { Mon: false, Tue: true, Wed: true, Thu: false, Fri: true, Sat: false, Sun: true } },
      { id: 'h4', name: 'Water Intake (2L)', history: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false } }
    ]
  }));

  // 6. Blog Posts
  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Slow Living Alone: Finding Comfort in Quiet Spaces',
      excerpt: 'How to transform your single apartment from just a place to sleep into a true sanctuary that nurtures your creativity, rest, and peace.',
      content: 'Living alone is often framed as a transitional phase, but it is actually one of the most powerful opportunities to understand who you are. When there is no one else to satisfy, you can design every square inch and every hour of the day around your own rhythms. Slow living is the practice of doing things with intention. It means making coffee in a French press and watching the steam rise. It means sitting in a chair without your phone and just looking out the window. In this post, we discuss how to build a daily routine that values quality over speed, peace over productivity, and comfort above all else.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      readTime: '6 min read',
      date: 'July 11, 2026',
      tag: 'Mindfulness',
      featured: true
    },
    {
      id: 2,
      title: 'Designing a Cozy Reading Nook on a Tiny Budget',
      excerpt: 'Creating a dedicated space for books doesn’t require a massive library. Here is how to style a corner with warm lighting and soft textiles.',
      content: 'A reading nook is more than just a chair; it is an invitation. To build one, you only need three elements: comfortable seating, adjustable warm lighting, and a soft texture to wrap yourself in. We look at thrifted options, the magic of floor cushions, and choosing warm-toned light bulbs (2700K) to set a relaxing mood for your evening reads.',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
      readTime: '4 min read',
      date: 'July 09, 2026',
      tag: 'Cozy Spaces',
      featured: false
    },
    {
      id: 3,
      title: 'A Solo Cook’s Guide to Meal Prep Without the Waste',
      excerpt: 'Cooking for one can lead to ingredient fatigue. Learn how to prep base components that adapt into entirely different meals throughout the week.',
      content: 'The biggest challenge of solo cooking is waste. A bag of spinach or a carton of cream is often too much for one portion. The secret lies in "component prepping" rather than full-meal prepping. Instead of making five identical boxes of chili, roast a tray of seasonal vegetables, cook a batch of grains, and make a versatile dressing. We explore how to mix and match components to keep your dinners exciting and fresh.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      readTime: '5 min read',
      date: 'July 06, 2026',
      tag: 'Solo Kitchen',
      featured: false
    },
    {
      id: 4,
      title: 'The Magic of the Evening Tea Ritual',
      excerpt: 'How winding down with loose-leaf herbs and a slow-brewed pot can signal to your body that it is safe and time to rest.',
      content: 'Our days are filled with constant digital stimulation. Creating a physical boundary between the "doing" of the day and the "resting" of the night is crucial. A loose-leaf tea ritual is the perfect anchor. The act of boiling water, watching leaves unfurl in a glass pot, and holding a warm ceramic mug forces you into the present moment. Try chamomile, lavender, and valerian root blends for a relaxing sleep.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
      readTime: '3 min read',
      date: 'July 02, 2026',
      tag: 'Self Care',
      featured: false
    }
  ];

  // 7. Notifications State
  const [notifications, setNotifications] = useState(() => getInitialData('solosphere_notifications', [
    { id: '1', type: 'reminder', text: 'Your sourdough starter needs feeding!', time: '10:15 AM', group: 'Today' },
    { id: '2', type: 'info', text: 'You completed all your wellness habits yesterday. Great job!', time: '9:00 PM', group: 'Yesterday' },
    { id: '3', type: 'save', text: 'Saved "Warm Fig & Honey Oatmeal" to your breakfast planner.', time: '8:30 AM', group: 'Yesterday' },
    { id: '4', type: 'warning', text: 'Cozy Cafe budget is nearing 85% of limit.', time: '2:15 PM', group: 'Earlier' },
    { id: '5', type: 'system', text: 'Welcome to SoloSphere! Let\'s create a peaceful space.', time: 'July 5', group: 'Earlier' }
  ]));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('solosphere_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('solosphere_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('solosphere_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('solosphere_planner', JSON.stringify(planner));
  }, [planner]);

  useEffect(() => {
    localStorage.setItem('solosphere_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Operations
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...expense
    };
    setExpenses(prev => [newExpense, ...prev]);

    // Push dynamic notification
    addNotification({
      type: 'expense',
      text: `Added expense: $${expense.amount.toFixed(2)} for ${expense.description}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      group: 'Today'
    });
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addCategory = (category) => {
    const newCat = {
      id: Date.now().toString(),
      ...category
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id, updated) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updated } : cat));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const toggleRecipeSaved = (id) => {
    setProfile(prev => {
      const isSaved = prev.savedRecipes.includes(id);
      const savedRecipes = isSaved
        ? prev.savedRecipes.filter(rid => rid !== id)
        : [...prev.savedRecipes, id];
      
      // Notify
      setTimeout(() => {
        addNotification({
          type: 'save',
          text: isSaved ? `Removed recipe from saved library.` : `Saved recipe to your collection!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          group: 'Today'
        });
      }, 100);

      return { ...prev, savedRecipes };
    });
  };

  const toggleTask = (id) => {
    setPlanner(prev => {
      const tasks = prev.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return { ...prev, tasks };
    });
  };

  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setPlanner(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const deleteTask = (id) => {
    setPlanner(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const updateNotes = (notes) => {
    setPlanner(prev => ({ ...prev, notes }));
  };

  const toggleHabitDay = (habitId, day) => {
    setPlanner(prev => {
      const habits = prev.habits.map(habit => {
        if (habit.id === habitId) {
          const currentVal = habit.history[day];
          return {
            ...habit,
            history: {
              ...habit.history,
              [day]: !currentVal
            }
          };
        }
        return habit;
      });
      return { ...prev, habits };
    });
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now().toString(),
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
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
      addCategory,
      updateCategory,
      deleteCategory,
      toggleRecipeSaved,
      toggleTask,
      addTask,
      deleteTask,
      updateNotes,
      toggleHabitDay,
      addNotification,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};
