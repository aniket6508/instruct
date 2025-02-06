import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // If there's a token in localStorage, consider the user 'logged in'
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Optional: If you'd like to log out somewhere in the navbar:
  // const navigate = useNavigate();
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsLoggedIn(false);
  //   navigate("/login");
  // };

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
                    // Standard ARIA attributes (good practice)
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

            {/* -- Right Section (Login / MyCourses, Icon, Mobile Toggler) -- */}
            <div className="col-xl-3 col-lg-2 col-7">
              <div className="right-nav d-flex align-items-center justify-content-end">
                <div className="right-btn mr-25 mr-xs-15">
                  <ul className="d-flex align-items-center">
                    <li>
                      {/* If logged in, show MyCourses; else Login */}
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
                    <li className="sign-in ml-20">
                      <script src="https://cdn.lordicon.com/lordicon.js"></script>
                      <lord-icon
                        src="https://cdn.lordicon.com/fmasbomy.json"
                        trigger="click"
                        state="hover-looking-around"
                        colors="primary:#121331,secondary:#c6c6c4,tertiary:#b16901"
                        style={{ width: "45px", height: "45px" }}
                      ></lord-icon>
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

            {/* Nav for mobile view, if you prefer separate or the same one */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
