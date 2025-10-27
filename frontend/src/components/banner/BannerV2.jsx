import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

const BannerV2 = () => {

    const sliderSettings = {
        // Optional parameters
        direction: "horizontal",
        loop: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        speed: 3000,
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
            <div className="banner-area banner-style-two content-right navigation-custom-large zoom-effect overflow-hidden text-light">
                <Swiper
                    {...sliderSettings}
                    className="banner-fade"
                    modules={[Keyboard, Autoplay, Pagination, EffectFade]}
                >
                    <div className="swiper-wrapper">

                        {/* Single Item */}
                        <SwiperSlide className="swiper-slide banner-style-two">
                            <div className="banner-thumb bg-cover shadow dark" style={{ background: 'url(/assets/img/banner/1.jpg)' }} />
                            <div className="container">
                                <div className="row align-center">
                                    <div className="col-xl-7 offset-xl-5 col-lg-10 offset-lg-1">
                                        <div className="content">
                                            <h4>Meet Consulting</h4>
                                            <h2><strong>Financial Analysis</strong> Developing Meeting.</h2>
                                            <div className="button">
                                                <Link className="btn circle btn-gradient btn-md radius animation" to="/contact-us">Get Consultant</Link>
                                            </div>
                                            <div className="shape-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="banner-angle-shape">
                                <div className="shape-item" style={{ background: 'url(/assets/img/shape/2.png)' }} />
                            </div>
                        </SwiperSlide>

                        {/* Single Item */}
                        <SwiperSlide className="swiper-slide banner-style-two">
                            <div className="banner-thumb bg-cover shadow dark" style={{ background: 'url(/assets/img/banner/4.jpg)' }} />
                            <div className="container">
                                <div className="row align-center">
                                    <div className="col-xl-7 offset-xl-5 col-lg-10 offset-lg-1">
                                        <div className="content">
                                            <h4>Coaching &; Consulting</h4>
                                            <h2><strong>Proper solution</strong> for business growth</h2>
                                            <div className="button">
                                                <Link className="btn circle btn-gradient btn-md radius animation" to="/contact-us">Get Consultant</Link>
                                            </div>
                                            <div className="shape-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="banner-angle-shape">
                                <div className="shape-item" style={{ background: 'url(/assets/img/shape/2.png)' }} />
                            </div>
                        </SwiperSlide>

                    </div>
                    <div className="swiper-pagination" />
                </Swiper>
            </div>
        </>
    );
};

export default BannerV2;