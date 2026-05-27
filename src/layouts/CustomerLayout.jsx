import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Cart } from 'react-bootstrap-icons';
import HorizontalNav from '../components/HorizontalNav';

const CustomerLayout = () => {
  return (
    <div className='bg-light min-vh-10'>
      <div className="container d-flex flex-column min-vh-100 bg-light">
      <header className="bg-white border-bottom">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: '#0d6efd',
                  borderRadius: 6,
                }}
              />
              <strong className="fs-5 text-dark">Ecommerce Store</strong>
            </Link>

            <div className="d-flex align-items-center gap-4">
              <Link to="/cart" className="text-dark text-decoration-none d-flex align-items-center gap-1">
                <Cart size={20} />
                <span>Cart</span>
              </Link>

              <Link to="/login" className="text-secondary text-decoration-none">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="grow py-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white mt-auto">
        <div className="container text-center py-4">
          <small className="text-muted">
            &copy; {new Date().getFullYear()} Ecommerce Store
          </small>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default CustomerLayout; 


