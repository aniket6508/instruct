import React from 'react'

function Navbar() {
    return (
        <div>
            <header>
                <div id="theme-menu-one" className="main-header-area pl-100 pr-100 pt-20 pb-15">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-xl-2 col-lg-2 col-5">
                                <div className="logo"><a href="index.html"><img src="assets/img/logo/main logoo.svg" alt="" /></a></div>
                            </div>
                            <div className="col-xl-7 col-lg-8 d-none d-lg-block">
                                <nav className="main-menu navbar navbar-expand-lg justify-content-center">
                                    <div className="nav-container">
                                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                            <ul className="navbar-nav">

                                                <li className="nav-item dropdown">
                                                    <a className="nav-link dropdown-toggle" href="/" role="button" aria-expanded="false">
                                                        Home
                                                    </a>
                                                </li>
                                                <li className="nav-item dropdown">
                                                    <a className="nav-link" href="courses" id="courseBtn" role="button" data-bs-toggle="dropdown" aria-expanded="false">Courses</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link dropdown-toggle" href="about" role="button" aria-expanded="false">
                                                        About us
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="contact" id="navbarDropdown5" role="button" aria-expanded="false">Contact</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                            <div className="col-xl-3 col-lg-2 col-7">
                                <div className="right-nav d-flex align-items-center justify-content-end">
                                    <div className="right-btn mr-25 mr-xs-15">
                                        <ul className="d-flex align-items-center">
                                            <li><a href="login" className="theme_btn free_btn"> Login </a></li>
                                            {/* <!-- <li><a className="sign-in ml-20" href="login.html"><img src="assets/img/icon/user.svg" alt=""></a></li> --> */}
                                            <li className="sign-in ml-20" dangerouslySetInnerHTML={{ __html: `
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/fmasbomy.json"
                                                    trigger="click"
                                                    state="hover-looking-around"
                                                    colors="primary:#121331,secondary:#c6c6c4,tertiary:#b16901"
                                                    style="width:45px;height:45px">
                                                </lord-icon>
                                            ` }}></li>
                                        </ul>
                                    </div>
                                    <div className="hamburger-menu d-md-inline-block d-lg-none text-right">
                                        <a href="javascript:void(0);">
                                            <i className="far fa-bars"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </div>
    )
}

export default Navbar