import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Sparkles, 
  Edit3, 
  Bell,
  Heart,
  Save
} from 'lucide-react';

export default function Planner() {
  const { 
    planner, 
    toggleTask, 
    addTask, 
    deleteTask, 
    updateNotes, 
    toggleHabitDay 
  } = useContext(AppContext);

  const [newTaskText, setNewTaskText] = useState('');
  const [noteContent, setNoteContent] = useState(planner.notes);
  const [saveStatus, setSaveStatus] = useState('Saved');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    addTask(newTaskText);
    setNewTaskText('');
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteContent(val);
    setSaveStatus('Saving...');
    
    // Simulate auto-save delay
    const timeout = setTimeout(() => {
      updateNotes(val);
      setSaveStatus('Saved');
    }, 800);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Editorial Header */}
      <header className="border-b border-brand-text-muted/10 pb-6 space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark">Daily Notebook</h1>
        <p className="font-sans text-brand-text-muted text-sm">
          Plan your week, set intentional goals, and track daily habits that nurture your mind and body.
        </p>
      </header>

      {/* THREE MAIN MODULES ROW (Notebook grids) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-brand-bg-warm pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Today's Priorities</h3>
              <span className="text-xxs text-brand-text-muted font-sans">Checklist</span>
            </div>

            {/* Tasks list */}
            {planner.tasks.length > 0 ? (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {planner.tasks.map((task) => (
                  <li 
                    key={task.id} 
                    className="flex items-start justify-between gap-3 group text-xs py-1"
                  >
                    <div 
                      onClick={() => toggleTask(task.id)}
                      className="flex items-start gap-2.5 cursor-pointer select-none min-w-0"
                    >
                      <span className="mt-0.5 shrink-0 text-brand-olive hover:scale-105 transition-transform">
                        {task.completed ? (
                          <CheckSquare size={16} className="fill-brand-olive/15 text-brand-olive" />
                        ) : (
                          <Square size={16} className="text-brand-text-muted" />
                        )}
                      </span>
                      <span className={`font-sans leading-tight ${
                        task.completed ? 'line-through text-brand-text-muted opacity-60' : 'text-brand-text-dark font-medium'
                      }`}>
                        {task.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-brand-text-muted hover:text-brand-terracotta opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-brand-bg-warm shrink-0 duration-200"
                      title="Delete task"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <p className="font-sans text-xs text-brand-text-muted">No priorities set for today.</p>
              </div>
            )}
          </div>

          {/* Add Task Input */}
          <form onSubmit={handleAddTaskSubmit} className="pt-4 border-t border-brand-text-muted/10 mt-4 flex gap-2 font-sans text-xs">
            <input 
              type="text"
              placeholder="Add a priority..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 px-3 py-2 border border-brand-bg-beige rounded-brand bg-brand-bg-warm/30 focus:bg-white focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-brand-olive text-brand-bg-warm px-3.5 py-2 rounded-brand hover:bg-brand-sage transition-all shadow-sm"
              title="Add priority"
            >
              <Plus size={14} />
            </button>
          </form>
        </div>

        {/* Weekly Grid */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-brand-bg-warm pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Weekly Anchor</h3>
              <span className="text-xxs text-brand-text-muted font-sans">Notes</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1 text-xs">
              {Object.keys(planner.weekly).map((day) => (
                <div key={day} className="flex gap-3 py-1.5 px-2 bg-brand-bg-warm/30 rounded-brand-sm border border-brand-bg-beige/40">
                  <span className="font-serif font-bold text-brand-terracotta shrink-0 w-8">{day}</span>
                  <span className="font-sans text-brand-text-dark">{planner.weekly[day]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Goals & Quick Note pad */}
        <div className="space-y-6">
          {/* Monthly Goals */}
          <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-baseline border-b border-brand-bg-warm pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Monthly Aspirations</h3>
              <span className="text-xxs text-brand-text-muted font-sans">Goals</span>
            </div>

            <ul className="space-y-3 font-sans text-xs">
              {planner.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                  <span className="text-brand-text-dark leading-relaxed font-medium">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Notes Journal Pad */}
          <div className="bg-[#FFFDF4] p-6 rounded-brand shadow-sm border border-[#F5EAD4] flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-baseline border-b border-brand-gold/20 pb-2 mb-3">
              <h3 className="font-serif text-sm font-bold text-brand-cinnamon flex items-center gap-1.5">
                <Edit3 size={12} />
                Notebook Pad
              </h3>
              <span className="text-xxs text-brand-text-muted font-sans flex items-center gap-1">
                <Save size={10} />
                {saveStatus}
              </span>
            </div>

            <textarea
              value={noteContent}
              onChange={handleNoteChange}
              rows="4"
              className="w-full bg-transparent border-0 font-sans text-xs text-brand-text-dark resize-none focus:outline-none focus:ring-0 leading-relaxed italic placeholder-brand-text-muted/50"
              placeholder="Jot down notes, comforting quotes, or sudden recipe inspirations..."
            />
          </div>
        </div>

      </div>

      {/* HABIT TRACKER GRID */}
      <section className="bg-white p-6 md:p-8 rounded-brand shadow-sm border border-brand-bg-beige hover:shadow-md transition-shadow duration-300">
        <header className="border-b border-brand-bg-warm pb-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-brand-text-dark">Mindful Habits</h3>
            <p className="font-sans text-xxs text-brand-text-muted">A quiet check-in. Don't worry about perfection; celebrate consistency.</p>
          </div>
          
          <div className="flex items-center gap-2 font-sans text-xxs text-brand-text-muted">
            <Heart size={12} className="text-brand-terracotta fill-brand-terracotta" />
            <span>Active Habits: <strong>{planner.habits.length}</strong></span>
          </div>
        </header>

        {/* Habit Grid representation */}
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs">
            <thead>
              <tr className="border-b border-brand-bg-warm text-brand-text-muted font-semibold">
                <th className="text-left py-3 px-4 font-serif font-bold text-sm text-brand-text-dark">Habit</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="text-center py-3 px-2 font-medium w-16">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planner.habits.map((habit) => (
                <tr key={habit.id} className="border-b border-brand-bg-warm/50 hover:bg-brand-bg-warm/10 transition-colors">
                  <td className="py-4 px-4 font-medium text-brand-text-dark">{habit.name}</td>
                  {daysOfWeek.map((day) => {
                    const completed = habit.history[day];
                    return (
                      <td key={day} className="text-center py-4 px-2">
                        <button
                          onClick={() => toggleHabitDay(habit.id, day)}
                          className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center mx-auto hover:scale-105 active:scale-95 ${
                            completed
                              ? 'bg-brand-olive text-brand-bg-warm shadow-xs'
                              : 'bg-brand-bg-warm hover:bg-brand-bg-beige border border-brand-bg-beige text-transparent'
                          }`}
                          title={`Toggle ${habit.name} for ${day}`}
                        >
                          <span className="text-[10px]">✓</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
