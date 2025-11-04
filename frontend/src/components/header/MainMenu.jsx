import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from '../../services/authService';

const MainMenu = ({ toggleSubMenu, navbarPlacement }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);
            
            if (authenticated) {
                try {
                    const profile = await authService.getProfile();
                    setIsAdmin(profile.is_admin || false);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setIsAdmin(false);
                }
            }
        };
        
        checkAuth();
    }, []);

    return (
        <>
            <ul className={`nav navbar-nav ${navbarPlacement}`} data-in="fadeInDown" data-out="fadeOutUp">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/search">AI Search</Link>
                </li>
                <li>
                    <Link to="/performance">Performance</Link>
                </li>
                {isAdmin && (
                    <li>
                        <Link to="/admin">Admin</Link>
                    </li>
                )}
                {isAuthenticated ? (
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
            </ul>
        </>
    );
};

export default MainMenu;