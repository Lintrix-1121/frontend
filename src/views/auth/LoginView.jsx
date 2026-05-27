// src/views/LoginView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/shared/useAuthStore';
import back from '../../assets/back.png';

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef(null);
  
  const { 
    isAuthenticated, 
    user,
    isLoading: authLoading, 
    login, 
    initializeAuth 
  } = useAuthStore();

  const isDevelopment = import.meta.env.DEV || 
                        import.meta.env.VITE_NODE_ENV === 'development' || 
                        !import.meta.env.PROD;

  // Combined authentication effect
  useEffect(() => {
    initializeAuth();
    
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/products', { replace: true });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [initializeAuth, isAuthenticated, user, navigate]);

  // Load remembered credentials
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(remembered);
    
    if (remembered) {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
      }
    }
  }, []);

  // Handle location state (registration messages, pre-filled email)
  useEffect(() => {
    if (location.state?.message) {
      console.log('Registration message:', location.state.message);
    }
    
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location]);

  // Auto-focus email input on first render
  useEffect(() => {
    if (emailInputRef.current && !formData.email) {
      emailInputRef.current.focus();
    }
  }, []);

  // Calculate password strength
  useEffect(() => {
    const { password } = formData;
    
    if (password.length === 0) {
      setPasswordStrength(0);
    } else if (password.length < 6) {
      setPasswordStrength(1);
    } else if (password.length < 8) {
      setPasswordStrength(2);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength(4);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength(3);
    } else {
      setPasswordStrength(2);
    }
  }, [formData.password]);

  const validateForm = () => {
    const { email, password } = formData;
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !authLoading && !isSubmitting) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please check your credentials.');
      } else {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberedRole', formData.role);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedRole');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const { email, password } = formData;

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center p-3"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 text-secondary">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center p-3"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 text-secondary">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 d-flex justify-content-center align-items-center p-3"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(40,167,69,0.05) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}
      />

      <div 
        className="mx-auto"
        style={{ 
          maxWidth: "500px", 
          width: "100%",
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '2.5rem'
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2" style={{ color: '#28a745' }}>Welcome Back!</h2>
          <p className="text-muted">Sign in to continue to your account</p>
        </div>

        {/* Role Selection Toggle */}
        {showRoleSelection && (
          <div className="mb-4">
            <p className="text-muted mb-2 text-center">Sign in as:</p>
            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                className="btn px-4"
                style={{
                  background: formData.role === 'user' ? '#28a745' : 'rgba(40,167,69,0.1)',
                  color: formData.role === 'user' ? 'white' : '#28a745',
                  border: '1px solid rgba(40,167,69,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleRoleChange('user')}
                onMouseEnter={(e) => {
                  if (formData.role !== 'user') {
                    e.target.style.background = 'rgba(40,167,69,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.role !== 'user') {
                    e.target.style.background = 'rgba(40,167,69,0.1)';
                  }
                }}
              >
                <UserIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                Customer
              </button>
              <button
                type="button"
                className="btn px-4"
                style={{
                  background: formData.role === 'admin' ? '#28a745' : 'rgba(40,167,69,0.1)',
                  color: formData.role === 'admin' ? 'white' : '#28a745',
                  border: '1px solid rgba(40,167,69,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleRoleChange('admin')}
                onMouseEnter={(e) => {
                  if (formData.role !== 'admin') {
                    e.target.style.background = 'rgba(40,167,69,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.role !== 'admin') {
                    e.target.style.background = 'rgba(40,167,69,0.1)';
                  }
                }}
              >
                <ShieldCheckIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                Admin
              </button>
            </div>
          </div>
        )}
        
        {/* Toggle link to show/hide role selection */}
        <button
          type="button"
          className="btn btn-link text-decoration-none mb-4 w-100"
          style={{ color: '#28a745' }}
          onClick={() => setShowRoleSelection(!showRoleSelection)}
        >
          {showRoleSelection ? 'Hide role selection' : 'Sign in as different role?'}
        </button>
        
        {/* Social Login Icons */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {['google', 'facebook', 'github'].map((provider) => (
            <button
              key={provider}
              type="button"
              className="btn d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                background: 'rgba(40,167,69,0.1)',
                border: '1px solid rgba(40,167,69,0.2)',
                color: '#28a745',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Login with ${provider}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#28a745';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(40,167,69,0.1)';
                e.currentTarget.style.color = '#28a745';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className={`bi bi-${provider}`} style={{ fontSize: '1.2rem' }}></i>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="w-100" noValidate>
          {/* Error Message */}
          {error && (
            <div 
              className="alert mb-3 d-flex align-items-center"
              style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.2)',
                color: '#dc3545'
              }}
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {location.state?.message && (
            <div 
              className="alert mb-3 d-flex align-items-center"
              style={{
                background: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                color: '#28a745'
              }}
              role="alert"
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              <span>{location.state.message}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-3">
            <div className="d-flex align-items-stretch">
              <span 
                className="d-flex align-items-center justify-content-center px-3"
                style={{
                  background: 'rgba(40,167,69,0.05)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  borderRight: 'none'
                }}
              >
                <EnvelopeIcon style={{ width: '18px', height: '18px', color: '#28a745' }} />
              </span>
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="form-control"
                placeholder="you@example.com"
                aria-label="Email address"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  color: '#495057',
                  borderRadius: 0
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(40,167,69,0.2)'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <div className="d-flex align-items-stretch">
              <span 
                className="d-flex align-items-center justify-content-center px-3"
                style={{
                  background: 'rgba(40,167,69,0.05)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  borderRight: 'none'
                }}
              >
                <LockClosedIcon style={{ width: '18px', height: '18px', color: '#28a745' }} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="form-control"
                placeholder="••••••••"
                aria-label="Password"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  borderRight: 'none',
                  color: '#495057',
                  borderRadius: 0
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(40,167,69,0.2)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  borderLeft: 'none',
                  color: '#28a745',
                  borderRadius: 0
                }}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ width: '18px', height: '18px' }} />
                ) : (
                  <EyeIcon style={{ width: '18px', height: '18px' }} />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && passwordStrength > 0 && (
              <div className="mt-2">
                <div className="progress" style={{ height: "4px", background: 'rgba(40,167,69,0.1)' }}>
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${passwordStrength * 25}%`,
                      background: passwordStrength === 1 ? '#dc3545' :
                                 passwordStrength === 2 ? '#ffc107' :
                                 passwordStrength === 3 ? '#17a2b8' : '#28a745',
                      transition: 'width 0.3s ease'
                    }}
                    role="progressbar"
                    aria-valuenow={passwordStrength}
                    aria-valuemin="0"
                    aria-valuemax="4"
                  />
                </div>
                <small className="text-muted">
                  {passwordStrength === 1 && 'Very weak'}
                  {passwordStrength === 2 && 'Weak'}
                  {passwordStrength === 3 && 'Good'}
                  {passwordStrength === 4 && 'Strong'}
                </small>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-check-input"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(40,167,69,0.2)',
                  borderRadius: 0,
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="remember-me" className="form-check-label text-muted">
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="btn btn-link text-decoration-none p-0"
              style={{ color: '#28a745' }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={authLoading || isSubmitting}
            className="btn w-100 py-2 mb-3 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              border: 'none',
              color: 'white',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(40,167,69,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-3 border-top" style={{ borderColor: 'rgba(40,167,69,0.2)' }}>
            <p className="mb-2 text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-decoration-none" style={{ color: '#28a745' }}>
                Sign up
              </Link>
            </p>
            <p className="mb-0">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i> Back to store
              </Link>
            </p>
          </div>
        </form>

        {/* Support Link */}
        <p className="text-center mt-4 mb-0 text-muted">
          Can't Login?{' '}
          <Link to="/support" className="text-decoration-none" style={{ color: '#28a745' }}>
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
