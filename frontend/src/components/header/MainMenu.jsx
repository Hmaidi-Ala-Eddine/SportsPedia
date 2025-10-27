import { Link } from 'react-router-dom';

const MainMenu = ({ toggleSubMenu, navbarPlacement }) => {
    return (
        <>
            <ul className={`nav navbar-nav ${navbarPlacement}`} data-in="fadeInDown" data-out="fadeOutUp">
                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle active" data-toggle="dropdown" onClick={toggleSubMenu}>Home</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/">Business Consultant</Link></li>
                        <li><Link to="/home-2">It Solutions</Link></li>
                        <li><Link to="/home-3">Creative Agency</Link></li>
                        <li><Link to="/home-4">Transport &; Logistics</Link></li>
                        <li><Link to="/home-5">Financial Advisor</Link></li>
                    </ul>
                </li>
                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" onClick={toggleSubMenu}>Pages</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/about-us-2">About Us Two</Link></li>
                        <li><Link to="/team">Team</Link></li>
                        <li><Link to="/team-2">Team Two</Link></li>
                        <li><Link to="/team-details/1">Team Details</Link></li>
                        <li><Link to="/pricing">Pricing</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/not-found">Error Page</Link></li>
                    </ul>
                </li>
                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" onClick={toggleSubMenu}>Projects</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/project">Project style one</Link></li>
                        <li><Link to="/project-2">Project style two</Link></li>
                        <li><Link to="/project-3">Project style three</Link></li>
                        <li><Link to="/project-details/1">Project Details</Link></li>
                    </ul>
                </li>
                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" onClick={toggleSubMenu}>Services</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/services">Services Version One</Link></li>
                        <li><Link to="/services-2">Services Version Two</Link></li>
                        <li><Link to="/services-3">Services Version Three</Link></li>
                        <li><Link to="/services-details/1">Services Details</Link></li>
                    </ul>
                </li>
                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" onClick={toggleSubMenu}>Blog</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/blog-standard">Blog Standard</Link></li>
                        <li><Link to="/blog-with-sidebar">Blog With Sidebar</Link></li>
                        <li><Link to="/blog-2-column">Blog Grid Two Column</Link></li>
                        <li><Link to="/blog-3-column">Blog Grid Three Column</Link></li>
                        <li><Link to="/blog-single/1">Blog Single</Link></li>
                        <li><Link to="/blog-single-with-sidebar/1">Blog Single With Sidebar</Link></li>
                    </ul>
                </li>
                <li><Link to="/contact-us">contact</Link></li>
            </ul>
        </>
    );
};

export default MainMenu;