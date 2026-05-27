import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/shared/useAuthStore";
import { icon, Path } from "leaflet";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Dashboard", path: "/admin", icon: "bi-house" },
    { name: "Products", path: "/admin/products", icon: "bi-box" },
    { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
    { name: "Services", path: "/admin/services", icon: "bi-tools" },
    { name: "Customers", path: "/admin/customers", icon: "bi-people" },
    { name: "Orders", path: "/admin/orders", icon: "bi-cart" },
    { name: "Projects", path: "/admin/projects", icon: "bi-cpu"},
    { name: "Blog", path: "/admin/blog", icon: "bi-file-post" },
    { name: "Careers", path: "/admin/careers", icon: "bi-person-workspace" },
    { name: "Analytics", path: "/admin/analytics", icon: "bi-bar-chart" },
    { name: "Reports", path: "/admin/reports", icon: "bi-pie-chart" },
    { name: "Settings", path: "/admin/settings", icon: "bi-gear" },
    
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR (Desktop) */}
        <aside className="col-lg-2 d-none d-lg-flex flex-column bg-white border-end min-vh-100 p-3">
          <h5 className="fw-bold mb-4">Admin Panel</h5>

          <nav className="nav flex-column gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link d-flex align-items-center gap-2 ${
                  location.pathname.startsWith(item.path)
                    ? "active fw-semibold text-primary"
                    : "text-dark"
                }`}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-3 border-top">
            <div className="small fw-semibold">{user?.userName || "Admin"}</div>
            <div className="small text-muted">{user?.email}</div>
            <button
              className="btn btn-sm btn-outline-danger mt-2 w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="col-lg-10 px-0">

          {/* TOP BAR */}
          <nav className="navbar navbar-light bg-white border-bottom px-3">
            <button
              className="btn btn-outline-secondary d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileSidebar"
            >
              <i className="bi bi-list"></i>
            </button>

            <form className="d-flex ms-3 grow" onSubmit={handleSearch}>
              <input
                className="form-control"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <button className="btn btn-light ms-3">
              <i className="bi bi-bell"></i>
            </button>
          </nav>

          {/* PAGE CONTENT */}
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="offcanvas offcanvas-start" id="mobileSidebar">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Admin Panel</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <nav className="nav flex-column gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link text-dark"
                data-bs-dismiss="offcanvas"
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.name}
              </Link>
            ))}
          </nav>

          <hr />

          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


