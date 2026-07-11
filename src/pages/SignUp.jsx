import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Check, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Compass, 
  Heart,
  Calendar,
  DollarSign,
  Coffee
} from 'lucide-react';

export default function SignUp({ setCurrentTab }) {
  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  // Field dirty/touched states (for inline real-time validation)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false
  });

  // Error states
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Mark a field as touched
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Run validation checks on input changes
  useEffect(() => {
    const errs = {};

    // Name check
    if (!fullName) {
      errs.fullName = 'Full Name is required';
    } else if (fullName.length < 2) {
      errs.fullName = 'Name should be at least 2 characters';
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    // Password check
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // Confirm password check
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // Terms check
    if (!termsChecked) {
      errs.terms = 'You must agree to the Terms & Conditions';
    }

    setErrors(errs);
  }, [fullName, email, password, confirmPassword, termsChecked]);

  // Password strength check
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);

    if (hasNumbers || hasSpecial) score += 1;
    if (hasMixed && score >= 2) score += 1;

    let label = 'Weak';
    let color = 'bg-brand-terracotta'; // Red/Orange
    if (score === 2) {
      label = 'Medium';
      color = 'bg-brand-gold';
    } else if (score >= 3) {
      label = 'Strong';
      color = 'bg-brand-olive';
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Touch all fields to show any existing errors
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true
    });

    if (Object.keys(errors).length === 0) {
      console.log('API call ready to dispatch: ', { fullName, email, password });
      // In a real application, we would call the auth endpoint here.
      // For this demo, let's navigate to the signin page or dashboard
      setCurrentTab('signin');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-warm text-brand-text-dark font-sans flex flex-col lg:flex-row selection:bg-brand-gold/30">
      
      {/* LEFT PANEL: PUBLIC SIGN UP FORM (slides/fades in) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 animate-slide-right">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-text-dark font-medium transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Home
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <Compass size={20} className="text-brand-terracotta" />
            <span className="font-serif font-bold text-base text-brand-text-dark">SoloSphere</span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-brand-text-dark">Begin Your Space</h2>
            <p className="font-sans text-xs text-brand-text-muted">Create a personal account to start planning and cooking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs text-left">
            
            {/* Full Name */}
            <div className="space-y-1 relative">
              <label className="block text-brand-text-muted font-semibold">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <User size={14} />
                </span>
                <input 
                  type="text"
                  placeholder="Anshika"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-brand border bg-white focus:outline-none transition-all ${
                    touched.fullName && errors.fullName 
                      ? 'border-brand-terracotta/40 focus:ring-1 focus:ring-brand-terracotta' 
                      : 'border-brand-bg-beige focus:ring-1 focus:ring-brand-olive'
                  }`}
                />
              </div>
              {/* Fade-in error block */}
              {touched.fullName && errors.fullName && (
                <span className="block text-[10px] text-brand-terracotta transition-opacity duration-300">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1 relative">
              <label className="block text-brand-text-muted font-semibold">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <Mail size={14} />
                </span>
                <input 
                  type="email"
                  placeholder="anshika@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-brand border bg-white focus:outline-none transition-all ${
                    touched.email && errors.email 
                      ? 'border-brand-terracotta/40 focus:ring-1 focus:ring-brand-terracotta' 
                      : 'border-brand-bg-beige focus:ring-1 focus:ring-brand-olive'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <span className="block text-[10px] text-brand-terracotta">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1 relative">
              <label className="block text-brand-text-muted font-semibold">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <Lock size={14} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-brand border bg-white focus:outline-none transition-all ${
                    touched.password && errors.password 
                      ? 'border-brand-terracotta/40 focus:ring-1 focus:ring-brand-terracotta' 
                      : 'border-brand-bg-beige focus:ring-1 focus:ring-brand-olive'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-muted hover:text-brand-text-dark"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              
              {/* Password strength meter */}
              {password && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex justify-between items-center text-[10px] text-brand-text-muted">
                    <span>Strength: <strong>{passwordStrength.label}</strong></span>
                  </div>
                  <div className="w-full bg-brand-bg-beige h-1 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.score >= 1 ? '33.3%' : '0%' }}></div>
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.score >= 2 ? '33.3%' : '0%' }}></div>
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.score >= 3 ? '33.4%' : '0%' }}></div>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <span className="block text-[10px] text-brand-terracotta">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 relative">
              <label className="block text-brand-text-muted font-semibold">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <Lock size={14} />
                </span>
                <input 
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-brand border bg-white focus:outline-none transition-all ${
                    touched.confirmPassword && errors.confirmPassword 
                      ? 'border-brand-terracotta/40 focus:ring-1 focus:ring-brand-terracotta' 
                      : 'border-brand-bg-beige focus:ring-1 focus:ring-brand-olive'
                  }`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="block text-[10px] text-brand-terracotta">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-1">
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input 
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  onBlur={() => handleBlur('terms')}
                  className="rounded border-brand-bg-beige text-brand-terracotta focus:ring-0 cursor-pointer"
                />
                <span className="text-[10px] text-brand-text-muted leading-tight">
                  I agree to the <a href="#terms" className="underline hover:text-brand-text-dark">Terms of Service</a> and <a href="#privacy" className="underline hover:text-brand-text-dark">Privacy Policy</a>
                </span>
              </label>
              {touched.terms && errors.terms && (
                <span className="block text-[10px] text-brand-terracotta">
                  {errors.terms}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-brand-terracotta text-brand-bg-warm py-3 rounded-brand font-semibold hover:bg-brand-cinnamon shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              Create My Account
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xxs text-brand-text-muted">
          Already have a space?{' '}
          <button 
            onClick={() => setCurrentTab('signin')}
            className="underline hover:text-brand-text-dark font-semibold font-sans text-brand-terracotta"
          >
            Sign In here
          </button>
        </div>

      </div>

      {/* RIGHT PANEL: COZY ILLUSTRATIVE EDITORIAL COVER (Connected style but distinct visual) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-bg-beige border-l border-brand-text-muted/10 flex-col justify-center items-center p-12 relative overflow-hidden select-none animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-olive/5 to-transparent pointer-events-none"></div>
        
        {/* Soft Cozy Editorial Plate */}
        <div className="max-w-md w-full aspect-[4/5] bg-white rounded-brand-lg p-10 relative flex flex-col justify-between shadow-sm border border-brand-bg-warm/50">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brand-bg-warm pb-3">
              <span className="font-serif italic text-xs text-brand-cinnamon">The Concept</span>
              <Calendar size={18} className="text-brand-olive" />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-brand-text-dark leading-snug">
              "Your home, your rhythms."
            </h3>
            
            <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
              Living alone is a beautiful opportunity to build your own daily notebook, test recipes sized for one, and discover peace in the quiet moments of the day.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-brand-text-muted/10 font-sans text-xxs text-brand-text-muted">
            <div className="flex gap-2 items-center">
              <Check size={14} className="text-brand-olive shrink-0" />
              <span>Personalized ingredient prompt matching</span>
            </div>
            <div className="flex gap-2 items-center">
              <Check size={14} className="text-brand-olive shrink-0" />
              <span>Mindful, stress-free expense thresholds</span>
            </div>
            <div className="flex gap-2 items-center">
              <Check size={14} className="text-brand-olive shrink-0" />
              <span>Digital journal layout with persistent saves</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
