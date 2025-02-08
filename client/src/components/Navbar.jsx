import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // If there's a token in localStorage, consider the user 'logged in'
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // If you want to hide the dropdown after logging out:
    setShowUserMenu(false);
    navigate("/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header>
      <div id="theme-menu-one" className="main-header-area pl-100 pr-100 pt-20 pb-15">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* -- Logo Section -- */}
            <div className="col-xl-2 col-lg-2 col-5">
              <div className="logo">
                <Link to="/">
                  <img src="assets/img/logo/main logoo.svg" alt="Logo" />
                </Link>
              </div>
            </div>

            {/* -- Nav Links (Desktop) -- */}
            <div className="col-xl-7 col-lg-8 d-none d-lg-block">
              <nav className="main-menu navbar navbar-expand-lg justify-content-center">
                <div className="nav-container">
                  {/* Toggler visible only in smaller viewports */}
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={menuOpen ? "true" : "false"}
                    aria-label="Toggle navigation"
                  >
                    <i className="far fa-bars"></i>
                  </button>

                  <div
                    className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
                    id="navbarSupportedContent"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/courses">Courses</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/about">About Us</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/faq">FAQ</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/blog">Blog</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>

            {/* -- Right Section (Login / MyCourses, UserIcon, Mobile Toggler) -- */}
            <div className="col-xl-3 col-lg-2 col-7">
              <div className="right-nav d-flex align-items-center justify-content-end">
                <div className="right-btn mr-25 mr-xs-15">
                  <ul className="d-flex align-items-center">
                    {/* MyCourses or Login */}
                    <li>
                      {isLoggedIn ? (
                        <Link to="/my-courses" className="theme_btn free_btn">
                          My Courses
                        </Link>
                      ) : (
                        <Link to="/login" className="theme_btn free_btn">
                          Login
                        </Link>
                      )}
                    </li>
                    
                    {/* User Icon - toggles user menu */}
                    <li className="sign-in ml-20" style={{ position: "relative" }}>
                      <script src="https://cdn.lordicon.com/lordicon.js"></script>
                      
                      {/* Clickable icon */}
                      <div onClick={toggleUserMenu} style={{ cursor: "pointer" }}>
                        <lord-icon
                          src="https://cdn.lordicon.com/fmasbomy.json"
                          trigger="click"
                          state="hover-looking-around"
                          colors="primary:#121331,secondary:#c6c6c4,tertiary:#b16901"
                          style={{ width: "45px", height: "45px" }}
                        />
                      </div>
                      
                      {/* Dropdown Menu (only if logged in) */}
                      {isLoggedIn && showUserMenu && (
                        <div
                          className="user-dropdown-menu"
                          style={{
                            position: "absolute",
                            top: "50px",
                            right: 0,
                            background: "#fff",
                            color: "#000",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "0.5rem 1rem",
                            zIndex: 9999,
                          }}
                        >
                          <button
                            onClick={handleLogout}
                            style={{
                              border: "none",
                              background: "none",
                              padding: "0",
                              margin: "0",
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </li>
                  </ul>
                </div>

                {/* Hamburger visible on small screens */}
                <div className="hamburger-menu d-md-inline-block d-lg-none text-right">
                  <button onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="far fa-bars"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Optionally separate nav for mobile */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
