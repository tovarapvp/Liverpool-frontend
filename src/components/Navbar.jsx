import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🛍️</span>
                    <span className="brand-text">Liverpool</span>
                </Link>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Products
                    </Link>
                    <Link
                        to="/formulario"
                        className={`nav-link ${location.pathname === '/formulario' ? 'active' : ''}`}
                    >
                        Form
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
