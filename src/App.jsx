import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import DashboardView from './views/admin/DashboardView';
import ProductsView from './views/admin/ProductView';
import ProductDetailView from './views/admin/ProductDetailView';
import ProductFormView from './views/admin/ProductForm';
import CategoriesView from './views/admin/CategoriesView';
import OrdersView from './views/admin/OrdersView';
import OrderDetailView from './views/admin/OrderDetailView';
import ProductListingView from './views/customer/ProductListingView';
import LoginView from './views/auth/LoginView';
import useAuthStore from './stores/shared/useAuthStore';
import CustomerView from './views/admin/CustomersView';
import CustomerDetailsView from './views/admin/CustomerDetailView';
import AnalyticsView from './views/admin/AnalyticsView';
import ReportsView from './views/admin/ReportsView';
import SettingsView from './views/admin/SettingsView';
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import SignupView from './views/auth/SignUpView';
import AppWrapper from './components/shared/AppWrapper';
import ProductFormContainer from './components/admin/ProductFormContainer';
import Cart from './components/shared/Cart';
import ContactPage from './views/customer/ContactPage';
import AboutPage from './views/customer/AboutPage';
import ServicesPage from './views/customer/ServicesPage';
import ServiceForm from './views/admin/ServiceForm';
import ServiceDetailView from './views/customer/ServiceDetailView';
import PartnersPage from './views/customer/Partners';
import Shop from './views/customer/Shop';
import Footer from './components/shared/Footer';
import ServicesView from './views/admin/ServiceView';
import Home from './components/customer/Home';
import EditProductView from './views/admin/EditProductView';
import BlogDashboard from './views/admin/BlogDashboard';
import BlogManagement from './views/admin/BlogManagement';
import BlogEntryForm from './views/admin/BlogForm';
import BlogList from './views/shared/BlogList';
import BlogDetail from './views/shared/BlogDetail';
import BlogView from './views/customer/BlogView';
import CareerDashboard from './views/admin/CareerDashboard';
import CareerEntryForm from './views/admin/CareerEntryForm';
import JobList from './components/career/JobList';
import CareersPage from './views/shared/CareersView';
import PartnersSection from './components/customer/PartnersSection';
import JobDetailsPage from './views/shared/JobDetails';
import ApplicationForm from './views/customer/ApplicationForm';
import AdminCareerDashboard from './views/admin/ApplicationDashboard';
import EditJobPage from './views/admin/CareerEditView';
import ApplicationDashboard from './views/admin/ApplicationDashboard';
import ProjectDashboard from './views/admin/ProjectDashboard';
import ProjectForm from './views/admin/ProjectForm';
import ProjectDetail from './views/customer/ProjectDetail';
import Projects from './views/customer/Projects';
import EmployeeList from './views/admin/EmployeeList';
import EmployeeForm from './views/admin/EmployeeForm';
import EmployeeDetail from './views/shared/EmployeeDetail';
import useEmployeeStore from './stores/shared/employeeStore';

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log(' ProtectedRoute Check:', {
    path: window.location.pathname,
    isAuthenticated,
    userRole: user?.role,
    requireAdmin,
    shouldRedirect: !isAuthenticated || (requireAdmin && user?.role !== 'admin')
  });
  
  
  if (!isAuthenticated) {
    console.log(' Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    console.log(' Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public route component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <AppWrapper>
        <Toaster position="top-right" />
        <TopBar />
        <Header />
        
        <Routes>
          {/* Public Routes (not logged in) */}
          <Route path="/" element={<Home />} />
          <Route path='/shop' element={<Shop />} />
         
          
          <Route 
            path="/login" 
            element={ 
              <PublicRoute>
                <LoginView />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupView />
              </PublicRoute>
            } 
          />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/services/:id' element={<ServiceDetailView />} />
          <Route path='cart' element={<Cart />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='about' element={<AboutPage />} />
          <Route path='partners' element={<PartnersSection/>} />
          <Route path='blog/all' element={<BlogView />} />
          <Route path="/blog/:slugOrId" element={<BlogDetail />} />
          <Route path='/careers/*' >
            <Route index element={<CareersPage />} />
            <Route path='jobs/:slugOrId' element={<JobDetailsPage />} />
            <Route path="apply/:idOrSlug" element={<ApplicationForm />} />
           
          </Route>
          <Route path='/projects/*'>
            <Route index element={<Projects /> } />
            <Route path='projects/:identifier' element={<ProjectDetail />} />
            {/* <Route path='projects/:category' element={<} */}
          </Route>

          
          {/* Customer Routes (logged in as customer) */}
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductListingView />} />
            <Route path=":category" element={<ProductListingView />} />
           
          </Route>
          
          {/* Admin Routes (logged in as admin) */}
         
          <Route 
            path="/admin/*" 
            element={ 
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardView />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="services">
              <Route index element={<ServicesView />} />
              <Route path="new" element={<ServiceForm />} />
              <Route path=':id/edit' element={<ServiceForm/> }/>
              {/* <Route path="/:id" element={<ServiceDetailView />} /> */}
            </Route>
           
            <Route path="products">
              <Route index element={<ProductsView />} />
              <Route path="new" element={<ProductFormContainer />} />
              <Route path=":id" element={<ProductDetailView />} />
              <Route path=":id/edit" element={<ProductFormContainer />} />
            </Route>
            <Route path="categories" element={<CategoriesView />} />
            <Route path="orders">
              <Route index element={<OrdersView />} />
              <Route path=":id" element={<OrderDetailView />} />
            </Route>
            <Route path="customers">
              <Route index element={<CustomerView />} />
              <Route path=":id" element={<CustomerDetailsView />} />
            </Route>
            <Route path='blog'>
              <Route index element={<BlogDashboard />} />
              <Route path="manage" element={<BlogManagement />} />
              <Route path='create' element={<BlogEntryForm />} />
            </Route>

            <Route path='careers'>
              <Route index element={<CareerDashboard />} />
              <Route path='new' element={<CareerEntryForm />} />
              <Route path="jobs/edit/:id" element={<EditJobPage />} />
              <Route path='applications' element={<ApplicationDashboard />} />
              
            </Route>

            <Route path='projects'>
              <Route index element={<ProjectDashboard />} />
              <Route path='new' element={<ProjectForm />} />
            </Route>
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          <Route path='/employees' element={<EmployeeList />} />
          <Route path='/employees/create' element={<EmployeeForm />} />
          <Route path='/employees/:id' element={<EmployeeDetail />} />
          <Route path='/employees/:id/edit' element={<EmployeeForm employee=
          {useEmployeeStore.getState().currentEmployee}/>} />
         

          {/* <Route path='employees'> 
          <Route index element={<EmployeeList />} />
          <Route path='create' element={<EmployeeForm />} />
          <Route path=':id' element={<EmployeeDetail />} />
          <Route path=':id/edit' element={<EmployeeForm employee=
          {useEmployeeStore.getState().currentEmployee} />} />
          </Route> */}
          
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AppWrapper>
    </Router>
  );
};

export default App;


