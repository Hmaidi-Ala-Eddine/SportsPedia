import illustration1 from "/assets/img/illustration/1.png"
import illustration2 from "/assets/img/illustration/2.png"
import illustration4 from "/assets/img/illustration/4.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

const BannerV5 = () => {

    const sliderSettings = {
        // Optional parameters
        direction: "horizontal",
        loop: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        speed: 10,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },

        // pagination
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },

        // Navigation arrows
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }

    }

    return (
        <>
            <div className="banner-area banner-style-five-area content-right navigation-custom-large zoom-effect overflow-hidden text-light">
                <Swiper {...sliderSettings}
                    className="banner-style-three-carousel"
                    modules={[Keyboard, Autoplay, Pagination, Navigation, EffectFade]}
                >
                    <div className="swiper-wrapper">
                        {/* Single Item */}
                        <SwiperSlide className="swiper-slide banner-style-five">
                            <div className="banner-thumb bg-cover shadow dark-hard" style={{ background: 'url(/assets/img/banner/14.jpg)' }} />
                            <div className="container">
                                <div className="row align-center">
                                    <div className="col-xl-7 col-lg-9 col-md-10">
                                        <div className="content">
                                            <h2>Wordlwide logistic services</h2>
                                            <p>
                                                Dissuade ecstatic and properly saw entirely sir why laughter endeavor. Maximum
                                                point on my jointure horrible margaret.
                                            </p>
                                            <div className="button">
                                                <Link className="btn btn-theme btn-md animation" to="/contact-us">Contact Us <i className="fas fa-long-arrow-right" /></Link>
                                            </div>
                                            <div className="shape-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fixed-item">
                                <img src={illustration1} alt="Image not found" />
                            </div>
                            <div className="logitic-goods">
                                <img src={illustration4} alt="Image not found" />
                            </div>
                            <div className="banner-fixed-bg" style={{ background: 'url(/assets/img/shape/10.png)' }} />
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide className="swiper-slide banner-style-five">
                            <div className="banner-thumb bg-cover shadow dark-hard" style={{ background: 'url(/assets/img/banner/15.jpg)' }} />
                            <div className="container">
                                <div className="row align-center">
                                    <div className="col-xl-7 col-lg-9 col-md-10">
                                        <div className="content">
                                            <h2>Full sustainable cargo solutions!</h2>
                                            <p>
                                                Dissuade ecstatic and properly saw entirely sir why laughter endeavor. Maximum
                                                point on my jointure horrible margaret.
                                            </p>
                                            <div className="button">
                                                <Link className="btn btn-theme btn-md animation" to="/contact-us">Contact Us <i className="fas fa-long-arrow-right" /></Link>
                                            </div>
                                            <div className="shape-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fixed-item">
                                <img src={illustration2} alt="Image not found" />
                            </div>
                            <div className="logitic-goods">
                                <img src={illustration4} alt="Image not found" />
                            </div>
                            <div className="banner-fixed-bg" style={{ background: 'url(/assets/img/shape/10.png)' }} />
                        </SwiperSlide>
                        {/* End Single Item */}
                    </div>
                    {/* Pagination */}
                    <div className="swiper-pagination" />
                </Swiper>
            </div>
        </>
    );
};

export default BannerV5;