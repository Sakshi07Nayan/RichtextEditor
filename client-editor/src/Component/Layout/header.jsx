import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/actions/authAction';
import logo from '../../assets/logo-.png';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        // Clear any stored tokens
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleGitHubClick = () => {
        window.open("https://github.com/Sakshi07Nayan/RichtextEditor");
    };

    const handleScrollToFooter = () => {
        const footerElement = document.getElementById('footer-contact');
        if (footerElement) {
            footerElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="bg-light p-3 shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Left Side - Logo and Navigation Links */}
                <div className="d-flex align-items-center">
                    <img src={logo} alt="Logo" className="me-3" style={{ width: '200px' }} />

                    <nav className="d-none d-md-flex">
                        <Link to="/" className="text-dark nav-link ms-3">
                            Home
                        </Link>
                        {isAuthenticated ? (

                            <Link to="/newsfeed" className="text-dark nav-link ms-3">
                                News Feed
                            </Link>
                        ) : (
                            <span onClick={handleScrollToFooter} className="text-dark nav-link ms-3" style={{ cursor: 'pointer' }}>Contact</span>
                        )}
                    </nav>
                </div>

                {/* Right Side - Conditional rendering based on auth state */}
                <div className="d-flex align-items-center">
                    {isAuthenticated ? (
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center me-3">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px', marginRight: '10px' }}>
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-dark">{user?.name || 'User'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGitHubClick}
                            className="btn btn-dark d-flex align-items-center"
                        >
                            <i className="fab fa-github me-2"></i> GitHub
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;