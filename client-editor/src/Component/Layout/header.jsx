import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-.png';

function Header() {
    const handleGitHubClick = () => {
        window.open("https://github.com/Sakshi07Nayan/RichtextEditor");
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
                        <Link to="/#" className="text-dark nav-link ms-3">
                            Contact
                        </Link>
                    </nav>
                </div>

                {/* Right Side - GitHub Button */}
                <button
                    onClick={handleGitHubClick}
                    className="btn btn-dark d-flex align-items-center"
                >
                    <i className="fab fa-github me-2"></i> GitHub
                </button>
            </div>
        </header>
    );
}

export default Header;
