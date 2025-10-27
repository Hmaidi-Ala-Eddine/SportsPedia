import thumb2 from "/assets/img/thumb/2.jpg"
import shape7 from "/assets/img/shape/7.png"
import { Link } from 'react-router-dom';
import Animation from '../animation/Animation';

const BannerV3 = () => {
    return (
        <>
            <div className="banner-style-three-area bg-cover" style={{ backgroundImage: 'url(/assets/img/shape/5.png)' }}>
                <div className="banner-shape-right-top" />
                {/* Single Item */}
                <div className="banner-style-three">
                    <div className="container">
                        <div className="content">
                            <div className="row align-center">
                                <div className="col-xl-6 col-lg-7 pr-50 pr-md-15 pr-xs-15">
                                    <div className="information">
                                        <Animation className='animate__animated animate__fadeInUp' delay='300ms' duration="400ms">
                                            <h4>Business Advisor</h4>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='500ms' duration="400ms">
                                            <h2>
                                                Grow business <br />with great <span className="relative">advice</span>
                                            </h2>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='900ms' duration="400ms">
                                            <p>
                                                Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In on my
                                                jointure horrible margaret suitable he followed speedily.
                                            </p>
                                        </Animation>
                                        <Animation className='animate__animated animate__fadeInUp' delay='1200ms' duration="400ms">
                                            <div className="button mt-40">
                                                <Link className="btn btn-md circle btn-theme animation" to="/contact-us">Get
                                                    Started</Link>
                                            </div>
                                        </Animation>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-5 pl-60 pl-md-15 pl-xs-15">
                                    <div className="thumb">
                                        <img src={thumb2} alt="Thumb" />
                                        <Animation className='animate__animated animate__fadeInRight'>
                                            <div className="grow-graph">
                                                <img src={shape7} alt="Image Not Found" />
                                                <Animation className='animate__animated animate__fadeInUp' delay='300ms'>
                                                    <h5>Profit $23,600</h5>
                                                </Animation>
                                            </div>
                                        </Animation>
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

export default BannerV3;