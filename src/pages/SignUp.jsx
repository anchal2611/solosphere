import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Calendar
} from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

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

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      setSubmitError('');
      
      // Simulate client success and navigate to SignIn page
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/signin');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-warm text-brand-text-dark font-sans flex flex-col lg:flex-row selection:bg-brand-gold/30">
      
      {/* LEFT PANEL: PUBLIC SIGN UP FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 animate-slide-in-left">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-text-dark font-medium transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Home
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Compass size={20} className="text-brand-terracotta" />
            <span className="font-serif font-bold text-base text-brand-text-dark">SoloSphere</span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          <div className="space-y-1.5 opacity-0 animate-fade-in-up delay-75">
            <h2 className="font-serif text-2xl md:text-3.5xl font-bold text-brand-text-dark">Begin Your Space</h2>
            <p className="font-sans text-xs text-brand-text-muted">Create a personal account to start planning and cooking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs text-left">
            {submitError && <p role="alert" className="animate-fade-in rounded-brand bg-brand-terracotta/5 px-3 py-2 text-brand-terracotta">{submitError}</p>}
            
            {/* Full Name */}
            <div className="space-y-1.5 opacity-0 animate-fade-in-up delay-100">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-text-muted">Full Name</label>
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
                      ? 'border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5' 
                      : 'border-brand-bg-beige focus:border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5'
                  }`}
                />
              </div>
              {touched.fullName && errors.fullName && (
                <span className="block text-[10px] text-brand-terracotta transition-opacity duration-300">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 opacity-0 animate-fade-in-up delay-150">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-text-muted">Email Address</label>
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
                      ? 'border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5' 
                      : 'border-brand-bg-beige focus:border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5'
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
            <div className="space-y-1.5 opacity-0 animate-fade-in-up delay-200">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-text-muted">Password</label>
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
                      ? 'border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5' 
                      : 'border-brand-bg-beige focus:border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5'
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
            <div className="space-y-1.5 opacity-0 animate-fade-in-up delay-250">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-text-muted">Confirm Password</label>
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
                      ? 'border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5' 
                      : 'border-brand-bg-beige focus:border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5'
                  }`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="block text-[10px] text-brand-terracotta">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms & Conditions & Submit */}
            <div className="space-y-4 pt-1.5 opacity-0 animate-fade-in-up delay-300">
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
                    I agree to the <a href="#terms" className="underline-slide">Terms of Service</a> and <a href="#privacy" className="underline-slide">Privacy Policy</a>
                  </span>
                </label>
                {touched.terms && errors.terms && (
                  <span className="block text-[10px] text-brand-terracotta">
                    {errors.terms}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-terracotta text-brand-bg-warm py-3 rounded-brand font-semibold hover:bg-brand-cinnamon shadow-md hover:-translate-y-0.5 active:scale-95 hover:scale-[1.02] active:translate-y-0 transition-all duration-300"
              >
                {isSubmitting ? 'Creating account...' : 'Create My Account'}
              </button>
            </div>

          </form>
        </div>

        {/* Footer info & Signature credit */}
        <div className="mt-8 space-y-4 text-center">
          <div className="text-xxs text-brand-text-muted">
            Already have a space?{' '}
            <button 
              onClick={() => navigate('/signin')}
              className="font-semibold font-sans text-brand-terracotta underline-slide"
            >
              Sign In here
            </button>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-brand-text-muted/40 font-semibold font-sans">
            Made with care by Anshika & Anchal
          </p>
        </div>

      </div>

      {/* RIGHT PANEL: COZY ILLUSTRATIVE COVER (Connected layered cards composition) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-bg-beige border-l border-brand-text-muted/10 flex-col justify-center items-center p-12 relative overflow-hidden select-none animate-slide-in-right delay-300">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-olive/5 to-transparent pointer-events-none"></div>
        
        {/* Layered Cards Group */}
        <div className="max-w-md w-full relative group">
          
          {/* Background Card (Planner priorities checklist preview) */}
          <div className="absolute top-0 left-0 w-full h-full bg-white rounded-brand-lg border border-brand-bg-beige shadow-xs transform translate-x-6 translate-y-6 rotate-3 opacity-40 group-hover:opacity-60 group-hover:translate-x-8 group-hover:translate-y-8 group-hover:rotate-4 transition-all duration-500 ease-out flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-brand-bg-warm pb-3">
                <span className="font-serif italic text-xs text-brand-olive font-medium">Daily Notebook</span>
                <span className="text-[10px] text-brand-text-muted font-sans font-medium">Priorities</span>
              </div>
              <ul className="space-y-2.5 font-sans text-[10px] text-brand-text-muted text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-brand-olive shrink-0" />
                  <span>Water monstera and fiddle leaf fig</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-brand-olive shrink-0" />
                  <span>Prepare sourdough starter</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="w-3 h-3 rounded-full border border-brand-bg-beige shrink-0"></span>
                  <span>Tidy up the cozy reading nook</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-between items-center text-xxs font-sans text-brand-text-muted pt-4 border-t border-brand-bg-warm">
              <span>2 of 5 priorities done</span>
              <span className="text-brand-terracotta font-semibold">Planner</span>
            </div>
          </div>

          {/* Foreground Card (Quote details) */}
          <div className="w-full bg-white rounded-brand-lg p-10 relative flex flex-col justify-between shadow-sm border border-brand-bg-warm/50 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 ease-out z-10">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-brand-bg-warm pb-3">
                <span className="font-serif italic text-xs text-brand-cinnamon font-medium">The Concept</span>
                <Calendar size={18} className="text-brand-olive" />
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-brand-text-dark leading-snug">
                "Your home, your rhythms."
              </h3>
              
              <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
                Living alone is a beautiful opportunity to build your own daily notebook, test recipes sized for one, and discover peace in the quiet moments of the day.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-text-muted/10 font-sans text-xxs text-brand-text-muted mt-8">
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

    </div>
  );
}
