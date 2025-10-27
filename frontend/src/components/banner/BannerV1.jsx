import { Link } from 'react-router-dom';
import Animation from '../animation/Animation';

const BannerV1 = () => {
    return (
        <>
            <div className="banner-style-one-area overflow-hidden bg-gray">
                <div className="shape-blury" />
                <div className="banner-style-one">
                    <div className="container">
                        <div className="content">
                            <div className="row align-center">
                                <div className="col-xl-6 col-lg-7 pr-50 pr-md-15 pr-xs-15">
                                    <div className="information">
                                        <div className="animation-shape">
                                            <img src="/assets/img/shape/anim-2.png" alt="Image not found" />
                                        </div>
                                        <Animation className='animate__animated animate__fadeInUp' delay='2000ms' duration="400ms">
                                            <h4>Business Advisor</h4>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='500ms' duration="400ms">
                                            <h2>Grow <strong>business</strong> <br />with great advise</h2>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='900ms' duration="400ms">
                                            <p>
                                                Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In on my jointure horrible margaret suitable he followed speedily.
                                            </p>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='1200ms' duration="400ms">
                                            <div className="button mt-40">
                                                <Link className="btn btn-md circle btn-gradient animation" to="/contact-us">Get Started</Link>
                                            </div>
                                        </Animation>
                                    </div>
                                </div>
                                <div className="banner-one-thumb col-xl-6 col-lg-5 pl-60 pl-md-15 pl-xs-15">
                                    <div className="thumb">
                                        <Animation className='animate__animated animate__fadeInUp'>
                                            <img src="/assets/img/thumb/1.png" alt="Thumb" />
                                        </Animation>
                                        <div className="strategy">
                                            <Animation className='animate__animated animate__fadeInLeft' delay='800ms'>
                                                <div className="item">
                                                    <div className="icon">
                                                        <i className="fas fa-chart-pie" />
                                                    </div>
                                                    <div className="info">
                                                        <p><strong>86%</strong> Business Growth</p>
                                                    </div>
                                                </div>
                                            </Animation>
                                            <Animation className='animate__animated animate__fadeInRight' delay='500ms'>
                                                <div className="item">
                                                    <div className="icon">
                                                        <i className="fas fa-rocket" />
                                                    </div>
                                                    <div className="info">
                                                        <p><strong>75%</strong> Marketing</p>
                                                    </div>
                                                </div>
                                            </Animation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BannerV1;