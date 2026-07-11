import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Settings2, 
  DollarSign, 
  Calendar,
  X,
  PlusCircle,
  PiggyBank,
  TrendingDown
} from 'lucide-react';

export default function ExpenseTracker() {
  const { 
    expenses, 
    categories, 
    profile, 
    addExpense, 
    deleteExpense, 
    addCategory, 
    deleteCategory, 
    updateCategory 
  } = useContext(AppContext);

  // Sub-tabs: 'list' (Journal) or 'categories' (Category Manager)
  const [activeSubTab, setActiveSubTab] = useState('list');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);

  // Form states for adding expense
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState(categories[0]?.name || '');

  // Form states for Category Management
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#C85A32');
  const [newCatLimit, setNewCatLimit] = useState(200);

  // 1. Math calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetRemaining = profile.monthlyBudget - totalSpent;

  // 2. Spending by category for Donut Chart
  const categoryTotals = categories.map(cat => {
    const total = expenses
      .filter(exp => exp.category.toLowerCase() === cat.name.toLowerCase())
      .reduce((sum, curr) => sum + curr.amount, 0);
    return {
      ...cat,
      total
    };
  });

  // Filter out categories with zero spend for donut calculation, but keep all for legends
  const activeSpendCategories = categoryTotals.filter(c => c.total > 0);
  const totalActiveSpend = activeSpendCategories.reduce((sum, c) => sum + c.total, 0);

  // SVG Donut Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  let accumulatedPercent = 0;

  const donutSegments = activeSpendCategories.map((cat) => {
    const percentage = totalActiveSpend > 0 ? (cat.total / totalActiveSpend) * 100 : 0;
    const strokeLength = (percentage / 100) * circumference;
    const strokeOffset = circumference - strokeLength + (accumulatedPercent / 100) * circumference;
    accumulatedPercent += percentage;
    return {
      ...cat,
      percentage,
      strokeLength,
      strokeOffset
    };
  });

  // Handle Add Expense Submit
  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    addExpense({
      amount: parseFloat(amount),
      description,
      category: categoryName
    });

    // Reset Form
    setDescription('');
    setAmount('');
    if (categories.length > 0) {
      setCategoryName(categories[0].name);
    }
    setAddModalOpen(false);
  };

  // Handle Add Category Submit
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    addCategory({
      name: newCatName,
      color: newCatColor,
      limit: parseInt(newCatLimit)
    });

    setNewCatName('');
    setNewCatLimit(200);
  };

  return (
    <div className="space-y-8 animate-slide-up relative">
      
      {/* Editorial Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-text-muted/10 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark">Budgeting Journal</h1>
          <p className="font-sans text-brand-text-muted text-sm">
            Keep track of your spending patterns and cultivate a balanced relationship with money.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="bg-brand-bg-beige p-1 rounded-brand flex gap-1 font-sans text-xs">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-brand font-medium transition-all duration-300 ${
              activeSubTab === 'list' 
                ? 'bg-white text-brand-text-dark shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text-dark'
            }`}
          >
            Spending Logs
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-brand font-medium transition-all duration-300 ${
              activeSubTab === 'categories' 
                ? 'bg-white text-brand-text-dark shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text-dark'
            }`}
          >
            Category Limits
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spent */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-full">
            <TrendingDown size={20} />
          </div>
          <div className="space-y-1">
            <span className="font-sans text-xxs uppercase tracking-wider text-brand-text-muted">Spent This Month</span>
            <p className="font-serif text-2xl font-bold text-brand-text-dark">₹{totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Limit */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full">
            <PiggyBank size={20} />
          </div>
          <div className="space-y-1">
            <span className="font-sans text-xxs uppercase tracking-wider text-brand-text-muted">Total Monthly Allowance</span>
            <p className="font-serif text-2xl font-bold text-brand-text-dark">₹{profile.monthlyBudget.toFixed(2)}</p>
          </div>
        </div>

        {/* Remaining */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-brand-olive/10 text-brand-olive rounded-full">
            <DollarSign size={20} />
          </div>
          <div className="space-y-1">
            <span className="font-sans text-xxs uppercase tracking-wider text-brand-text-muted">Remaining Balance</span>
            <p className={`font-serif text-2xl font-bold ${budgetRemaining < 0 ? 'text-brand-terracotta' : 'text-brand-olive'}`}>
              ₹{budgetRemaining.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {activeSubTab === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Donut Chart (Placeholder Area and details) */}
          <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Category Distribution</h3>
              <p className="font-sans text-xs text-brand-text-muted">Visualizing where your monthly allowance flows.</p>
            </div>

            {/* SVG Interactive Donut Chart */}
            <div className="relative flex justify-center items-center py-4">
              {totalActiveSpend > 0 ? (
                <>
                  <svg width="180" height="180" viewBox="0 0 140 140" className="transform -rotate-90">
                    <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#FAF7F2" strokeWidth="12" />
                    {donutSegments.map((segment, idx) => (
                      <circle
                        key={idx}
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke={segment.color}
                        strokeWidth="12"
                        strokeDasharray={`${segment.strokeLength} ${circumference}`}
                        strokeDashoffset={segment.strokeOffset}
                        className="transition-all duration-500 ease-in-out hover:stroke-[14px] cursor-pointer"
                        style={{ transformOrigin: '70px 70px' }}
                      />
                    ))}
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                    <span className="text-xxs text-brand-text-muted uppercase tracking-wider">Total</span>
                    <span className="font-serif text-lg font-bold">₹{totalActiveSpend.toFixed(0)}</span>
                  </div>
                </>
              ) : (
                <div className="h-44 flex flex-col justify-center items-center border border-dashed border-brand-bg-beige rounded-brand w-full bg-brand-bg-warm/30">
                  <DollarSign size={32} className="text-brand-text-muted opacity-40 mb-2" />
                  <p className="text-xxs text-brand-text-muted font-sans text-center">No transactions registered yet.</p>
                </div>
              )}
            </div>

            {/* Legends List */}
            <div className="space-y-2 pt-4 border-t border-brand-text-muted/10">
              {categoryTotals.map(cat => {
                const percent = totalActiveSpend > 0 ? ((cat.total / totalActiveSpend) * 100).toFixed(0) : 0;
                return (
                  <div key={cat.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                      <span className="font-sans text-brand-text-dark font-medium">{cat.name}</span>
                    </div>
                    <span className="font-sans text-brand-text-muted">
                      ₹{cat.total.toFixed(2)} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Journal Entries</h3>
              <span className="text-xxs text-brand-text-muted font-sans">{expenses.length} transaction entries</span>
            </div>

            {expenses.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {expenses.map((expense) => {
                  const cat = categories.find(c => c.name.toLowerCase() === expense.category.toLowerCase()) || { color: '#8B7D74' };
                  return (
                    <div 
                      key={expense.id} 
                      className="bg-white p-4 rounded-brand border border-brand-bg-beige shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Category Color Bar */}
                        <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                        
                        <div className="min-w-0 space-y-1">
                          <p className="font-sans font-semibold text-brand-text-dark truncate text-sm">
                            {expense.description}
                          </p>
                          <div className="flex items-center gap-2 text-xxs text-brand-text-muted font-sans flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-brand-bg-warm font-medium" style={{ color: cat.color }}>
                              {expense.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {expense.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-serif font-bold text-base text-brand-text-dark">
                          -₹{expense.amount.toFixed(2)}
                        </span>
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-1.5 text-brand-text-muted hover:text-brand-terracotta hover:bg-brand-bg-warm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex flex-col justify-center items-center border border-dashed border-brand-bg-beige rounded-brand bg-white">
                <p className="text-sm text-brand-text-muted font-sans">No spending logs recorded yet.</p>
                <p className="text-xxs text-brand-text-muted font-sans mt-1">Tap the plus button to record your first expense.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* CATEGORY MANAGEMENT SECTION */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Category Form */}
          <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige space-y-4 hover:shadow-md transition-shadow duration-300">
            <h3 className="font-serif text-lg font-bold text-brand-text-dark">Add New Category</h3>
            <p className="font-sans text-xs text-brand-text-muted mb-4">Define a new category with a customized spending limit.</p>
            
            <form onSubmit={handleAddCategorySubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="block text-brand-text-muted font-semibold">Category Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Wellness Books"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-brand-text-muted font-semibold">Category Theme Color</label>
                <div className="flex gap-2.5 items-center flex-wrap py-2">
                  {['#C85A32', '#D4A373', '#606C38', '#8C4F2B', '#8B7D74', '#70A0AF', '#A892EE'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ${
                        newCatColor === color ? 'border-brand-text-dark scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                  <input 
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-6 h-6 rounded-full border-0 p-0 overflow-hidden cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-brand-text-muted font-semibold">Monthly Allowance Limit (₹)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 200"
                  value={newCatLimit}
                  onChange={(e) => setNewCatLimit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-brand-terracotta text-brand-bg-warm py-2.5 rounded-brand font-semibold hover:bg-brand-cinnamon transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={14} />
                Create Category
              </button>
            </form>
          </div>

          {/* Categories Grid List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-text-dark px-2">Allowance Limits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const total = expenses
                  .filter(exp => exp.category.toLowerCase() === cat.name.toLowerCase())
                  .reduce((sum, curr) => sum + curr.amount, 0);
                const percent = Math.min(Math.round((total / cat.limit) * 100), 100);
                
                return (
                  <div 
                    key={cat.id} 
                    className="bg-white p-5 rounded-brand border border-brand-bg-beige shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group relative"
                  >
                    {/* Delete Icon */}
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="absolute top-4 right-4 text-brand-text-muted hover:text-brand-terracotta p-1 hover:bg-brand-bg-warm rounded-full transition-colors opacity-0 group-hover:opacity-100 duration-300"
                      title="Delete category"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                        <h4 className="font-serif font-bold text-base text-brand-text-dark">{cat.name}</h4>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-sans text-xxs text-brand-text-muted">
                          <span>Spent: ₹{total.toFixed(2)}</span>
                          <span>Limit: ₹{cat.limit}</span>
                        </div>
                        <div className="w-full bg-brand-bg-warm h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              backgroundColor: cat.color,
                              width: `${percent}%` 
                            }}
                          ></div>
                        </div>
                        <span className="block text-right font-sans text-xxs font-semibold text-brand-text-muted">
                          {percent}% consumed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-brand-terracotta text-brand-bg-warm p-4 rounded-full shadow-lg hover:bg-brand-cinnamon active:scale-95 hover:-translate-y-0.5 transition-all duration-300 group z-30"
        title="Record Expense"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* ADD EXPENSE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-brand-text-dark/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-brand-bg-warm p-6 rounded-brand-lg shadow-2xl max-w-sm w-full relative animate-slide-up space-y-4">
            
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-brand-text-muted hover:text-brand-text-dark hover:bg-brand-bg-beige rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <header className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-brand-text-dark">Record Spending</h3>
              <p className="font-sans text-xxs text-brand-text-muted">Log your purchase with clean journal entries.</p>
            </header>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="block text-brand-text-muted font-semibold">Purchase Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sourdough bread & tea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-brand-text-muted font-semibold">Cost (₹)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    placeholder="12.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-brand-text-muted font-semibold">Category</label>
                  {categories.length > 0 ? (
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-brand-terracotta block pt-2">No categories available!</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={categories.length === 0}
                className="w-full bg-brand-terracotta text-brand-bg-warm py-3 rounded-brand font-semibold hover:bg-brand-cinnamon transition-all duration-300 shadow-sm flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                Record Transaction
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
