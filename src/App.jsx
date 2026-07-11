import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Planner from './pages/Planner';
import Blog from './pages/Blog';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Render correct page view
  const renderPageView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            setSelectedRecipeId={setSelectedRecipeId} 
          />
        );
      case 'recipes':
        return (
          <Recipes 
            setCurrentTab={setCurrentTab} 
            setSelectedRecipeId={setSelectedRecipeId} 
          />
        );
      case 'recipe-detail':
        return (
          <RecipeDetail 
            recipeId={selectedRecipeId} 
            setCurrentTab={setCurrentTab} 
          />
        );
      case 'expenses':
        return <ExpenseTracker />;
      case 'planner':
        return <Planner />;
      case 'blog':
        return <Blog />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return (
          <Profile 
            setCurrentTab={setCurrentTab} 
            setSelectedRecipeId={setSelectedRecipeId} 
          />
        );
      default:
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            setSelectedRecipeId={setSelectedRecipeId} 
          />
        );
    }
  };

  return (
    <AppProvider>
      <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
        {renderPageView()}
      </Layout>
    </AppProvider>
  );
}

export default App;
