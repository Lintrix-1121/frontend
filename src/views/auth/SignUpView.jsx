import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/shared/useAuthStore';

const SignupView = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const { login, register } = useAuthStore(); //register from auth store
  
  const emailInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = () => {
    const { userName, email, password, confirmPassword } = formData;

    if (!userName.trim()) {
      setError('Username is required');
      return false;
    }

    if (userName.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // Ensure role is included in registration data
      const registrationData = {
        ...registerData,
        role: registerData.role || 'user'
      };
      
      console.log('Registration data:', registrationData); // Debug log
      
      // Use the register function from auth store
      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess(true);
        
        // Auto login after successful registration
        setTimeout(async () => {
          try {
            const loginResult = await login(formData.email, formData.password);
            
            if (loginResult.success) {
              // Redirect based on role
              if (loginResult.role === 'admin' || formData.role === 'admin') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/products', { replace: true });
              }
            } else {
              // If auto-login fails, redirect to login page
              navigate('/login', { 
                state: { 
                  message: 'Registration successful! Please login.',
                  email: formData.email 
                } 
              });
            }
          } catch (loginError) {
            console.error('Auto-login failed:', loginError);
            navigate('/login', { 
              state: { 
                message: 'Registration successful! Please login.',
                email: formData.email 
              } 
            });
          }
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.message || 
        'Registration service is currently unavailable. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { userName, email, password, confirmPassword, role } = formData;

  if (success) {
    return (
      <div className="login d-flex min-vh-100 justify-content-center align-items-center p-3 bg-dark">
        <div 
          className="glass d-flex flex-column align-items-center p-4 p-md-5 mx-auto" 
          style={{ maxWidth: "500px", width: "100%", backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}
        >
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-success mb-4" />
            <h2 className="text-light mb-3">Registration Successful!</h2>
            <p className="text-white-50 mb-4">
              Your {role === 'admin' ? 'admin' : 'customer'} account has been created successfully.
            </p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white-50 mt-3">Redirecting to {role === 'admin' ? 'admin dashboard' : 'products page'}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login d-flex min-vh-100 justify-content-center align-items-center p-3 bg-dark">
      <div 
        className="glass d-flex flex-column align-items-center p-4 p-md-5 mx-auto" 
        style={{ maxWidth: "500px", width: "100%", backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}
      >
        <h2 className="text-center text-light mb-4 w-100">Create Your Account</h2>
        <p className="text-center text-white-50 mb-4">Join our community and start shopping today</p>
        
        {/* Role Selection Section */}
        <div className="mb-4 w-100">
          {/* <p className="text-white-50 mb-2 text-center">Sign up as:</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              type="button"
              className={`btn ${role === 'user' ? 'btn-primary' : 'btn-outline-light'} rounded-pill`}
              onClick={() => handleRoleChange('user')}
            >
              <UserCircleIcon className="h-4 w-4 me-2" />
              Customer
            </button>
            <button
              type="button"
              className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline-light'} rounded-pill`}
              onClick={() => handleRoleChange('admin')}
            >
              <ShieldCheckIcon className="h-4 w-4 me-2" />
              Admin
            </button>
          </div> */}
          <p className="text-center text-white-50 mt-2 small">
            {role === 'admin' 
              ? 'Admin accounts have full access to management features.' 
              : 'Customer accounts can browse and purchase products.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-100" noValidate>
          {error && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="alert alert-danger alert-dismissible fade show mb-3"
            >
              <div className="d-flex align-items-center">
                <svg className="bi shrink-0 me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="userName" className="form-label text-white-50">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <UserIcon className="h-4 w-4 text-white-50" />
              </span>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                value={userName}
                onChange={handleChange}
                className="form-control bg-transparent text-white border-start-0"
                placeholder="your name"
                aria-label="Username"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white-50">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <EnvelopeIcon className="h-4 w-4 text-white-50" />
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
                className="form-control bg-transparent text-white border-start-0"
                placeholder="yourname@example.com"
                aria-label="Email address"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white-50">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <LockClosedIcon className="h-4 w-4 text-white-50" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={handleChange}
                className="form-control bg-transparent text-white border-start-0 border-end-0"
                placeholder="••••••••"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-outline-light border-start-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-white-50" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-white-50" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && passwordStrength > 0 && (
              <div className="mt-2">
                <div className="progress" style={{ height: "4px" }}>
                  <div 
                    className={`progress-bar ${
                      passwordStrength === 1 ? 'bg-danger' :
                      passwordStrength === 2 ? 'bg-warning' :
                      passwordStrength === 3 ? 'bg-info' : 'bg-success'
                    }`}
                    style={{ width: `${passwordStrength * 25}%` }}
                    role="progressbar"
                    aria-valuenow={passwordStrength}
                    aria-valuemin="0"
                    aria-valuemax="4"
                  />
                </div>
                <small className="text-white-50">
                  {passwordStrength === 1 && 'Very weak'}
                  {passwordStrength === 2 && 'Weak'}
                  {passwordStrength === 3 && 'Good'}
                  {passwordStrength === 4 && 'Strong'}
                </small>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label text-white-50">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <LockClosedIcon className="h-4 w-4 text-white-50" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleChange}
                className="form-control bg-transparent text-white border-start-0 border-end-0"
                placeholder="••••••••"
                aria-label="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="btn btn-outline-light border-start-0"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-white-50" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-white-50" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="form-check mb-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="form-check-input"
            />
            <label htmlFor="terms" className="form-check-label text-white-50 ms-2">
              I agree to the{' '}
              <a href="#" className="text-white text-decoration-none">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-white text-decoration-none">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-100 py-2 mb-3"
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              `Create ${role === 'admin' ? 'Admin' : 'Customer'} Account`
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-3 border-top border-white-25">
            <p className="text-white-50 mb-2">
              Already have an account?{' '}
              <Link to="/login" className="text-white text-decoration-none">
                Sign in
              </Link>
            </p>
            <p className="mb-0">
              <Link to="/" className="text-white-50 text-decoration-none">
                ← Back to store
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupView;


