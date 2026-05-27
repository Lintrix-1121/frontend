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
  const { login, register } = useAuthStore(); // Use register from auth store
  
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
          <p className="text-white-50 mb-2 text-center">Sign up as:</p>
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
          </div>
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
                placeholder="johndoe"
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
                placeholder="you@example.com"
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

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   UserIcon, 
//   EnvelopeIcon, 
//   LockClosedIcon, 
//   EyeIcon, 
//   EyeSlashIcon,
//   CheckCircleIcon 
// } from '@heroicons/react/24/outline';
// import AuthService from '../../services/AuthService';

// const SignupView = () => {
//   const [formData, setFormData] = useState({
//     userName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [success, setSuccess] = useState(false);
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError(''); // Clear error on change
//   };

//   const validateForm = () => {
//     const { userName, email, password, confirmPassword } = formData;

//     if (!userName.trim()) {
//       setError('Username is required');
//       return false;
//     }

//     if (!email.trim()) {
//       setError('Email is required');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return false;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const { confirmPassword, ...registerData } = formData;
      
//       const response = await AuthService.register(registerData);
      
//       if (response.success) {
//         setSuccess(true);
        
//         // Auto login after successful registration
//         setTimeout(async () => {
//           try {
//             await AuthService.login(email, password);
//             navigate('/');
//           } catch (loginError) {
//             // If auto-login fails, redirect to login page
//             navigate('/login', { 
//               state: { 
//                 message: 'Registration successful! Please login.',
//                 email: formData.email 
//               } 
//             });
//           }
//         }, 2000);
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || 
//         err.message || 
//         'Registration failed. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const { userName, email, password, confirmPassword } = formData;

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="flex justify-center">
//             {/* <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
//               <CheckCircleIcon className="h-10 w-10 text-green-600" />
//             </div> */}
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//             Registration Successful!
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Your account has been created successfully. Redirecting to login...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           {/* <div className="h-12 w-12 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
//             <UserIcon className="h-6 w-6 text-white" />
//           </div> */}
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           Create Your Account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Join our community and start shopping today
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Username
//               </label>
//               <div className="relative">
//                 {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <UserIcon className="h-5 w-5 text-gray-400" />
//                 </div> */}
//                 <input
//                   id="userName"
//                   name="userName"
//                   type="text"
//                   autoComplete="username"
//                   required
//                   value={userName}
//                   onChange={handleChange}
//                   className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
//                   placeholder="johndoe"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                 </div> */}
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={handleChange}
//                   className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div> */}
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   required
//                   value={password}
//                   onChange={handleChange}
//                   className="pl-10 pr-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               <p className="mt-1 text-xs text-gray-500">
//                 Must be at least 6 characters long
//               </p>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div> */}
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   required
//                   value={confirmPassword}
//                   onChange={handleChange}
//                   className="pl-10 pr-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                 I agree to the{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
//                   Terms of Service
//                 </a>{' '}
//                 and{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating Account...
//                   </>
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>
//             </div>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
//                 >
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
//                     <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
//                     <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
//                     <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
//                   </svg>
//                   <span className="ml-2">Google</span>
//                 </button>

//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
//                 >
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                   </svg>
//                   <span className="ml-2">GitHub</span>
//                 </button>
//               </div>
//             </div>

//             <div className="text-center pt-4 border-t border-gray-200">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
//                   Sign in
//                 </Link>
//               </p>
//               <p className="mt-2">
//                 <Link to="/" className="text-sm text-blue-600 hover:text-blue-500 transition duration-200">
//                   ← Back to store
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupView;