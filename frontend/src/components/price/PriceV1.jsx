import { Link } from 'react-router-dom';
import Animation from '../animation/Animation';

const PriceV1 = () => {
    return (
        <>
            <div className="pricing-style-one-area default-padding bg-cover bg-gray" style={{ backgroundImage: 'url(/assets/img/shape/3.jpg)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Pricing Plan</h4>
                                <h2 className="title">Our Pricing packages</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <Animation className='animate__animated animate__fadeInUp'>
                                <div className="pricing-style-one">
                                    <div className="pricing-header">
                                        <h4>Basic Plan</h4>
                                        <p>
                                            The most basic Plan
                                        </p>
                                        <h2>$32</h2>
                                        <span>Per Month Package</span>
                                    </div>
                                    <ul>
                                        <li><i className="fas fa-check" /> 100 Days Sitting</li>
                                        <li><i className="fas fa-check" /> Market Report Analysis</li>
                                        <li><i className="fas fa-times" /> Exclusive Manuals</li>
                                        <li><i className="fas fa-times" /> Creative Leadership team</li>
                                    </ul>
                                    <Link className="btn btn-gradient btn-md animation" to="/contact-us">Purchase Plan</Link>
                                </div>
                            </Animation>
                        </div>
                        <div className="col-lg-8">
                            <Animation className='animate__animated animate__fadeInUp' delay='300ms'>
                                <div className="pricing-two-box">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="pricing-style-one">
                                                <div className="badge">Best Deal</div>
                                                <div className="pricing-header">
                                                    <h4>Standard Plan</h4>
                                                    <p>
                                                        Exclusive For small Business
                                                    </p>
                                                    <h2>$58</h2>
                                                    <span>Per Month Package</span>
                                                </div>
                                                <ul>
                                                    <li><i className="fas fa-check" /> 100 Days Sitting</li>
                                                    <li><i className="fas fa-check" /> Market Report Analysis</li>
                                                    <li><i className="fas fa-check" /> Exclusive Manuals</li>
                                                    <li><i className="fas fa-times" /> Creative Leadership team</li>
                                                </ul>
                                                <Link className="btn btn-dark btn-md animation" to="/contact-us">Purchase Plan</Link>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="pricing-style-one">
                                                <div className="pricing-header">
                                                    <h4>Advanced Plan</h4>
                                                    <p>
                                                        The most Profitable Plan
                                                    </p>
                                                    <h2>$99</h2>
                                                    <span>Per Month Package</span>
                                                </div>
                                                <ul>
                                                    <li><i className="fas fa-check" /> 100 Days Sitting</li>
                                                    <li><i className="fas fa-check" /> Market Report Analysis</li>
                                                    <li><i className="fas fa-check" /> Exclusive Manuals</li>
                                                    <li><i className="fas fa-check" /> Creative Leadership team</li>
                                                </ul>
                                                <Link className="btn btn-dark btn-md animation" to="/contact-us">Purchase Plan</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Animation>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PriceV1;