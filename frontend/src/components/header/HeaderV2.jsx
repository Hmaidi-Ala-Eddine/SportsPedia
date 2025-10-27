import MainMenu from './MainMenu';
import logo from "/assets/img/logo.png";
import logoLight from "/assets/img/logo-light.png";
import useSubMenuToggle from '@/hooks/useSubMenuToggle';
import useStickyMenu from '@/hooks/useStickyMenu';
import useSidebarMenu from '@/hooks/useSidebarMenu';
import { Link } from 'react-router-dom';

const HeaderV2 = () => {

    const toggleSubMenu = useSubMenuToggle();
    const isMenuSticky = useStickyMenu();
    const { isOpen, openMenu, closeMenu } = useSidebarMenu();

    return (
        <>
            <header>
                <nav className={`navbar mobile-sidenav navbar-sticky navbar-default validnavs navbar-fixed white on menu-center ${isMenuSticky ? 'sticked' : 'no-background'} ${isOpen ? "navbar-responsive" : ""}`}>
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={openMenu}>
                                <i className="fa fa-bars" />
                            </button>
                            <Link className="navbar-brand" to="/">
                                <img src={logoLight} className="logo logo-display" alt="Logo" />
                                <img src={logo} className="logo logo-scrolled" alt="Logo" />
                            </Link>
                        </div>
                        <div className={`collapse navbar-collapse ${isOpen ? "show collapse-mobile" : "collapse-mobile"}`} id="navbar-menu">
                            <div className="collapse-header">
                                <img src={logo} alt="Logo" />
                                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                                    <i className="fa fa-times" />
                                </button>
                            </div>
                            <MainMenu navbarPlacement="navbar-center" toggleSubMenu={toggleSubMenu} />
                        </div>
                        <div className="attr-right">
                            <div className="attr-nav">
                                <ul>
                                    <li className="contact">
                                        <div className="call">
                                            <div className="icon">
                                                <i className="fas fa-comments-alt-dollar" />
                                            </div>
                                            <div className="info">
                                                <p>Have any Questions?</p>
                                                <h5><a href="mailto:info@crysta.com">info@bestup.com</a></h5>
                                            </div>
                                        </div>
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

export default HeaderV2;