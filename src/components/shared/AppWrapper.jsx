// components/AppWrapper.jsx
import { useEffect } from 'react';
import useAuthStore from '../../stores/shared/useAuthStore';

const AppWrapper = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  
  // Initialize auth once when app starts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return <>{children}</>;
};

export default AppWrapper;