import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Compass, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ArrowRight,
  BookOpen,
  DollarSign,
  Coffee
} from 'lucide-react';

export default function SignIn({ setCurrentTab, onSignInSuccess }) {
  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Flow & Security UI simulation states
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0); // in minutes
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate network latency
    setTimeout(() => {
      setIsSubmitting(false);

      // Simple mock authentication simulation:
      // If password is 'error', trigger simulated credential error.
      // If attempt count >= 3, trigger lockout message.
      if (password === 'error' || !email || !password) {
        const nextAttempts = attemptCount + 1;
        setAttemptCount(nextAttempts);

        if (nextAttempts >= 3) {
          setLockoutTimer(5); // 5 minutes lockout
          setErrorMessage('Too many failed attempts. Your account has been temporarily locked. Try again in 5 minutes.');
        } else {
          // Security best practice: generic error message
          setErrorMessage('Invalid email address or password. Please try again.');
        }
      } else {
        // Success -> Route to 2FA Step modal/card
        setIs2FAStep(true);
      }
    }, 800);
  };

  const handle2FAVerify = (e) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      // Complete sign in
      onSignInSuccess();
    } else {
      setErrorMessage('Invalid verification code. Please check your SMS/email.');
    }
  };

  const handleQuickGuestEnter = () => {
    onSignInSuccess();
  };

  return (
    <div className="min-h-screen bg-brand-bg-warm text-brand-text-dark font-sans flex flex-col lg:flex-row selection:bg-brand-gold/30">
      
      {/* LEFT PANEL: PUBLIC SIGN IN FORM (slides/fades in) */}
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

        {/* Form Panel (Toggles to 2FA card) */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          {!is2FAStep ? (
            // SIGN IN STATE
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-bold text-brand-text-dark">Enter Your Space</h2>
                <p className="font-sans text-xs text-brand-text-muted">Welcome back. Settle into your daily routine.</p>
              </div>

              {/* Locked/Error state banner */}
              {errorMessage && (
                <div className={`p-4 rounded-brand border text-xs font-sans flex gap-2.5 items-start ${
                  lockoutTimer > 0 
                    ? 'bg-brand-terracotta/5 border-brand-terracotta/20 text-brand-terracotta' 
                    : 'bg-brand-gold/5 border-brand-gold/20 text-brand-text-dark'
                }`}>
                  {lockoutTimer > 0 ? <Clock size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4 font-sans text-xs text-left">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-brand-text-muted font-semibold">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                      <Mail size={14} />
                    </span>
                    <input 
                      type="email"
                      required
                      disabled={lockoutTimer > 0}
                      placeholder="anshika@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-olive disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-brand-text-muted font-semibold">Password</label>
                    <a href="#forgot" className="text-xxs text-brand-text-muted hover:text-brand-text-dark underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                      <Lock size={14} />
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={lockoutTimer > 0}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-olive disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={lockoutTimer > 0}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-muted hover:text-brand-text-dark disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-brand-bg-beige text-brand-terracotta focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[10px] text-brand-text-muted select-none">Remember this device</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || lockoutTimer > 0}
                  className="w-full mt-4 bg-brand-terracotta text-brand-bg-warm py-3 rounded-brand font-semibold hover:bg-brand-cinnamon shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Sign In'}
                </button>
              </form>

              {/* Guest access for developer preview */}
              <div className="pt-4 border-t border-brand-text-muted/10 flex flex-col items-center gap-2">
                <span className="text-[10px] text-brand-text-muted font-sans font-medium">Developer Quick Preview:</span>
                <button
                  onClick={handleQuickGuestEnter}
                  className="bg-brand-olive/10 text-brand-olive hover:bg-brand-olive/20 px-6 py-2 rounded-brand font-sans text-xxs font-semibold flex items-center gap-1 transition-colors"
                >
                  Quick Guest Enter
                  <ArrowRight size={12} />
                </button>
                <span className="text-[9px] text-brand-text-muted/60">(Or type 'error' as password to test credential failures & Lockout states)</span>
              </div>
            </div>
          ) : (
            // TWO-FACTOR AUTHENTICATION STATE
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-bold text-brand-text-dark">Safety Check</h2>
                <p className="font-sans text-xs text-brand-text-muted">Enter the 6-digit verification code sent to your registered device.</p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-brand border bg-brand-terracotta/5 border-brand-terracotta/20 text-brand-terracotta text-xs font-sans">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handle2FAVerify} className="space-y-4 font-sans text-xs text-left">
                <div className="space-y-1">
                  <label className="block text-brand-text-muted font-semibold">Verification Code</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                      <ShieldCheck size={14} />
                    </span>
                    <input 
                      type="text"
                      maxLength="6"
                      required
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-olive tracking-widest text-center text-sm font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-brand-olive text-brand-bg-warm py-3 rounded-brand font-semibold hover:bg-brand-sage shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                >
                  Verify & Enter
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setIs2FAStep(false);
                    setVerificationCode('');
                    setErrorMessage('');
                  }}
                  className="text-xxs text-brand-text-muted hover:text-brand-text-dark underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xxs text-brand-text-muted">
          New to SoloSphere?{' '}
          <button 
            onClick={() => setCurrentTab('signup')}
            className="underline hover:text-brand-text-dark font-semibold font-sans text-brand-terracotta"
          >
            Create an account here
          </button>
        </div>

      </div>

      {/* RIGHT PANEL: COZY COVER DIAL (connected but distinct) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-bg-beige border-l border-brand-text-muted/10 flex-col justify-center items-center p-12 relative overflow-hidden select-none animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent pointer-events-none"></div>
        
        {/* Soft Cozy Editorial Plate */}
        <div className="max-w-md w-full aspect-[4/5] bg-white rounded-brand-lg p-10 relative flex flex-col justify-between shadow-sm border border-brand-bg-warm/50">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brand-bg-warm pb-3">
              <span className="font-serif italic text-xs text-brand-cinnamon">Sourdough Bake</span>
              <BookOpen size={18} className="text-brand-gold" />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-brand-text-dark leading-snug">
              "Simple meals cooked with love."
            </h3>
            
            <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
              Log in to search recipes matching whatever leftovers are sitting in your fridge, checklist your morning steps, and log quiet expenditures.
            </p>
          </div>

          <div className="pt-6 border-t border-brand-text-muted/10 flex justify-between items-center font-sans text-xxs text-brand-text-muted">
            <div className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-brand-terracotta" />
              <span>Stress-free budget bounds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coffee size={14} className="text-brand-cinnamon" />
              <span>Reflective cafe logs</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
