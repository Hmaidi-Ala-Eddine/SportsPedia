import logo from "/assets/img/logo.png";
import MainMenu from './MainMenu';
import useStickyMenu from '@/hooks/useStickyMenu';
import useSubMenuToggle from '@/hooks/useSubMenuToggle';
import useSidebarMenu from '@/hooks/useSidebarMenu';
import { Link } from 'react-router-dom';

const HeaderV5 = () => {

    const isMenuSticky = useStickyMenu();
    const toggleSubMenu = useSubMenuToggle();
    const { isOpen, openMenu, closeMenu } = useSidebarMenu();

    return (
        <>
            <header>
                <nav className={`navbar mobile-sidenav navbar-common navbar-sticky navbar-default validnavs dark on menu-center no-full ${isMenuSticky ? 'sticked' : 'no-background'} ${isOpen ? "navbar-responsive" : ""}`}>
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={openMenu}>
                                <i className="fa fa-bars" />
                            </button>
                            <Link className="navbar-brand" to="/">
                                <img src={logo} className="logo" alt="Logo" />
                            </Link>
                        </div>
                        <div className={`collapse navbar-collapse ${isOpen ? "show collapse-mobile" : "collapse-mobile"}`} id="navbar-menu">
                            <img src={logo} alt="Logo" />
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                                <i className="fa fa-times" />
                            </button>
                            <MainMenu navbarPlacement="navbar-center" toggleSubMenu={toggleSubMenu} />
                        </div>
                        <div className="attr-right">
                            <div className="attr-nav">
                                <ul>
                                    <li className="button dark">
                                        <Link to="/contact-us">Get consultant</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`overlay-screen ${isOpen ? "opened" : ""}`} onClick={closeMenu} />
                </nav>
            </header>
        </>
    );
};

export default HeaderV5;