import FooterNewsLetter from '../form/FooterNewsLetter';
import { Link } from 'react-router-dom';

const FooterV1 = () => {
    return (
        <>
            <footer className="bg-dark overflow-hidden text-light">
                <div className="container">
                    <div className="f-items default-padding">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 footer-item pr-30 pr-md-15 pr-xs-15">
                                <div className="f-item address">
                                    <ul className="contact-address">
                                        <li>
                                            <p>Want to connect?</p>
                                            <h4><a href="mailto:info@validthemes.com">info@validthemes.com</a></h4>
                                        </li>
                                        <li>
                                            <p>Call us anytime</p>
                                            <h4><a href="tel:+4733378901">tel:+4733378901</a></h4>
                                        </li>
                                        <li>
                                            <p>Our Location</p>
                                            <h4>175 10h Street, Office 375 Berlin, Devolina 21562</h4>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 footer-item">
                                <div className="f-item link">
                                    <h4 className="widget-title">Quick Links</h4>
                                    <ul>
                                        <li>
                                            <Link to="/about-us">Company Profile</Link>
                                        </li>
                                        <li>
                                            <Link to="/contact-us">Help Center</Link>
                                        </li>
                                        <li>
                                            <Link to="/about-us">Career</Link>
                                        </li>
                                        <li>
                                            <Link to="/pricing">Plans &; Pricing</Link>
                                        </li>
                                        <li>
                                            <Link to="/blog-single-with-sidebar/1">News &; Blog</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 footer-item">
                                <div className="f-item link">
                                    <h4 className="widget-title">Our Services</h4>
                                    <ul>
                                        <li>
                                            <Link to="/services-details/1">Manage investment</Link>
                                        </li>
                                        <li>
                                            <Link to="/services-details/1">Email Marketing</Link>
                                        </li>
                                        <li>
                                            <Link to="/services-details/1">Growth Hacking</Link>
                                        </li>
                                        <li>
                                            <Link to="/services-details/1">Lead Generation</Link>
                                        </li>
                                        <li>
                                            <Link to="/services-details/1">Offline SEO</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 footer-item">
                                <div className="f-item newsletter">
                                    <p>
                                        Join our subscribers list to get the latest <br /> news and special offers.
                                    </p>
                                    <FooterNewsLetter />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="row">
                            <div className="col-lg-6">
                                <p>&copy; Copyright {(new Date().getFullYear())}. All Rights Reserved by <a href="https://themeforest.net/user/validthemes" target='_blank'>validthemes</a></p>
                            </div>
                            <div className="col-lg-6 text-end">
                                <ul className="link-list">
                                    <li>
                                        <Link to="#" >Terms</Link>
                                    </li>
                                    <li>
                                        <Link to="#" >Privacy</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact-us">Support</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV1;