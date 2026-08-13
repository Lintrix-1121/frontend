import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/shared/useAuthStore";
import { Offcanvas } from "bootstrap";
import { icon } from "leaflet";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const offcanvasRef = useRef(null);
  const [offcanvasInstance, setOffcanvasInstance] = useState(null);

  const navigation = [
    { name: "Dashboard", path: "/admin", icon: "bi-house" },
    { name: "Products", path: "/admin/products", icon: "bi-box" },
    { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
    { name: "Services", path: "/admin/services", icon: "bi-tools" },
    { name: "Customers", path: "/admin/customers", icon: "bi-people" },
    { name: "Orders", path: "/admin/orders", icon: "bi-cart" },
    { name: "Projects", path: "/admin/projects", icon: "bi-cpu" },
    { name: "Blog", path: "/admin/blog", icon: "bi-file-post" },
    { name: "Careers", path: "/admin/careers", icon: "bi-person-workspace" },
    { name: "employees", path: "/admin/employees", icon: "bi-person-badge"},
    { name: "Analytics", path: "/admin/analytics", icon: "bi-bar-chart" },
    { name: "Reports", path: "/admin/reports", icon: "bi-pie-chart" },
    { name: "Settings", path: "/admin/settings", icon: "bi-gear" },
  ];

  // Initialize offcanvas instance
  useEffect(() => {
    if (offcanvasRef.current) {
      const instance = new Offcanvas(offcanvasRef.current, {
        backdrop: true,
        keyboard: true,
      });
      setOffcanvasInstance(instance);
    }
    return () => {
      if (offcanvasInstance) {
        offcanvasInstance.dispose();
      }
    };
  }, []);

  const closeOffcanvas = () => {
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };

  const openOffcanvas = () => {
    if (offcanvasInstance) {
      offcanvasInstance.show();
    }
  };

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
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* DESKTOP SIDEBAR – sticky full height */}
        <aside
          className="col-lg-2 d-none d-lg-flex flex-column bg-white border-end p-3"
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            overflowY: "auto",
          }}
        >
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

        {/* MAIN AREA – flex column, full height */}
        <div
          className="col-lg-10 d-flex flex-column"
          style={{ height: "100vh" }}
        >
          {/* TOP BAR – sticky */}
          <nav
            className="navbar navbar-light bg-white border-bottom px-3"
            style={{
              flexShrink: 0,
              position: "sticky",
              top: 0,
              zIndex: 1020,
            }}
          >
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={openOffcanvas}
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

          {/* PAGE CONTENT – scrollable */}
          <main className="p-4" style={{ flex: 1, overflowY: "auto" }}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* MOBILE SIDEBAR (Offcanvas) – controlled via ref */}
      <div
        className="offcanvas offcanvas-start"
        ref={offcanvasRef}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Admin Panel</h5>
          <button
            className="btn-close"
            onClick={closeOffcanvas}
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          <nav className="nav flex-column gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link text-dark"
                onClick={() => {
                  closeOffcanvas();
                  // Link navigation proceeds automatically
                }}
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


// import { useState, useRef, useEffect } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import useAuthStore from "../stores/shared/useAuthStore";
// import { Offcanvas } from "bootstrap"; 

// export default function AdminLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Ref to the offcanvas DOM element
//   const offcanvasRef = useRef(null);
//   // Store the offcanvas instance
//   const [offcanvasInstance, setOffcanvasInstance] = useState(null);

//   // Navigation items
//   const navigation = [
//     { name: "Dashboard", path: "/admin", icon: "bi-house" },
//     { name: "Products", path: "/admin/products", icon: "bi-box" },
//     { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
//     { name: "Services", path: "/admin/services", icon: "bi-tools" },
//     { name: "Customers", path: "/admin/customers", icon: "bi-people" },
//     { name: "Orders", path: "/admin/orders", icon: "bi-cart" },
//     { name: "Projects", path: "/admin/projects", icon: "bi-cpu" },
//     { name: "Blog", path: "/admin/blog", icon: "bi-file-post" },
//     { name: "Careers", path: "/admin/careers", icon: "bi-person-workspace" },
//     { name: "Analytics", path: "/admin/analytics", icon: "bi-bar-chart" },
//     { name: "Reports", path: "/admin/reports", icon: "bi-pie-chart" },
//     { name: "Settings", path: "/admin/settings", icon: "bi-gear" },
//   ];

//   // Initialize Bootstrap offcanvas instance when component mounts
//   useEffect(() => {
//     if (offcanvasRef.current) {
//       const instance = new Offcanvas(offcanvasRef.current, {
//         backdrop: true,
//         keyboard: true,
//       });
//       setOffcanvasInstance(instance);
//     }

//     // Cleanup on unmount
//     return () => {
//       if (offcanvasInstance) {
//         offcanvasInstance.dispose();
//       }
//     };
//   }, []);

//   // Close offcanvas programmatically
//   const closeOffcanvas = () => {
//     if (offcanvasInstance) {
//       offcanvasInstance.hide();
//     }
//   };

//   // Open offcanvas programmatically
//   const openOffcanvas = () => {
//     if (offcanvasInstance) {
//       offcanvasInstance.show();
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* SIDEBAR (Desktop) */}
//         <aside className="col-lg-2 d-none d-lg-flex flex-column bg-white border-end min-vh-100 p-3">
//           <h5 className="fw-bold mb-4">Admin Panel</h5>

//           <nav className="nav flex-column gap-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`nav-link d-flex align-items-center gap-2 ${
//                   location.pathname.startsWith(item.path)
//                     ? "active fw-semibold text-primary"
//                     : "text-dark"
//                 }`}
//               >
//                 <i className={`bi ${item.icon}`}></i>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>

//           <div className="mt-auto pt-3 border-top">
//             <div className="small fw-semibold">{user?.userName || "Admin"}</div>
//             <div className="small text-muted">{user?.email}</div>
//             <button
//               className="btn btn-sm btn-outline-danger mt-2 w-100"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </aside>

//         {/* MAIN AREA */}
//         <div className="col-lg-10 px-0">
//           {/* TOP BAR */}
//           <nav className="navbar navbar-light bg-white border-bottom px-3">
//             {/* Mobile hamburger uses openOffcanvas() */}
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               onClick={openOffcanvas}
//             >
//               <i className="bi bi-list"></i>
//             </button>

//             <form className="d-flex ms-3 grow" onSubmit={handleSearch}>
//               <input
//                 className="form-control"
//                 placeholder="Search…"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </form>

//             <button className="btn btn-light ms-3">
//               <i className="bi bi-bell"></i>
//             </button>
//           </nav>

//           {/* PAGE CONTENT */}
//           <main className="p-4">
//             <Outlet />
//           </main>
//         </div>
//       </div>

//       {/* MOBILE SIDEBAR (Offcanvas) – controlled via ref and Bootstrap API */}
//       <div
//         className="offcanvas offcanvas-start"
//         ref={offcanvasRef}
//         tabIndex="-1"
//       >
//         <div className="offcanvas-header">
//           <h5 className="offcanvas-title">Admin Panel</h5>
//           <button
//             className="btn-close"
//             onClick={closeOffcanvas}
//             aria-label="Close"
//           ></button>
//         </div>

//         <div className="offcanvas-body">
//           <nav className="nav flex-column gap-2">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="nav-link text-dark"
//                 onClick={() => {
//                   // Close the offcanvas, then let the Link navigate naturally
//                   closeOffcanvas();
//                 }}
//               >
//                 <i className={`bi ${item.icon} me-2`}></i>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>

//           <hr />

//           <button
//             className="btn btn-outline-danger w-100"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }