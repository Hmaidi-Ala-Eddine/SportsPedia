import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from '../../services/authService';

const MainMenu = ({ toggleSubMenu, navbarPlacement }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    return (
        <>
            <ul className={`nav navbar-nav ${navbarPlacement}`} data-in="fadeInDown" data-out="fadeOutUp">
                <li>
                    <Link to="/" className="active">Home</Link>
                </li>
                <li>
                    <Link to="/explore">Explore</Link>
                </li>
                <li>
                    <Link to="/about-us">About Us</Link>
                </li>
                <li>
                    <Link to="/contact-us">Contact</Link>
                </li>
            </ul>
        </>
    );
};

export default MainMenu;