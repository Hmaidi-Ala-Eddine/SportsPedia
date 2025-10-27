import HeaderNewsLetter from '../form/HeaderNewsLetter';
import SocialShare from '../utilities/SocialShare';
import logo2Light from "/assets/img/logo-2-light.png";
import { Link } from 'react-router-dom';

const SidebarInfo = ({ openInfoBar, closeInfoBar, isInfoOpen }) => {
    return (
        <>
            <div className="attr-right">
                <div className="attr-nav">
                    <ul>
                        <li className="tracing">
                            <Link to="#" onClick={openInfoBar}>
                                <div className="icon">
                                    <i className="fas fa-truck" />
                                </div>
                                <div className="info">
                                    <h5>Track your order</h5>
                                </div>
                            </Link>
                        </li>
                        <li className="side-menu">
                            <Link to="#" onClick={openInfoBar}>
                                <span className="bar-1" />
                                <span className="bar-2" />
                                <span className="bar-3" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={`side ${isInfoOpen ? "on" : ""}`}>
                <Link to="#" className="close-side" onClick={closeInfoBar}>
                    <i className="fas fa-times" />
                </Link>
                <div className="widget">
                    <div className="logo">
                        <img src={logo2Light} alt="Logo" />
                    </div>
                    <p>
                        Arrived compass prepare an on as. Reasonable particular on my it in sympathize. Size now easy eat hand how. Unwilling he departure elsewhere dejection at. Heart large seems may purse means few blind.
                    </p>
                </div>
                <div className="widget address">
                    <div>
                        <ul>
                            <li>
                                <div className="content">
                                    <p>Address</p>
                                    <strong>California, TX 70240</strong>
                                </div>
                            </li>
                            <li>
                                <div className="content">
                                    <p>Email</p>
                                    <strong>support@validtheme.com</strong>
                                </div>
                            </li>
                            <li>
                                <div className="content">
                                    <p>Contact</p>
                                    <strong>+44-20-7328-4499</strong>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="widget newsletter">
                    <h4 className="title">Get Subscribed!</h4>
                    <HeaderNewsLetter />
                </div>
                <div className="widget social">
                    <ul className="link">
                        <SocialShare />
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SidebarInfo;