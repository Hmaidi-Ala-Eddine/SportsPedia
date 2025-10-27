import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';
import brand11 from "/assets/img/brand/11.png"
import brand22 from "/assets/img/brand/22.png"
import brand55 from "/assets/img/brand/55.png"
import brand66 from "/assets/img/brand/66.png"

const PartnerV1 = () => {

    const sliderSettings = {
        // Optional parameters
        loop: true,
        slidesPerView: 2,
        spaceBetween: 15,
        autoplay: true,
        breakpoints: {
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },
    }

    return (
        <>
            <div className="partner-style-one-area default-padding bg-dark text-light" style={{ backgroundImage: 'url(/assets/img/shape/25.png)' }}>
                <div className="container">
                    <div className="row align-center">
                        <div className="col-xl-4">
                            <h2 className="title">Thrusted brands work with us</h2>
                        </div>
                        <div className="col-xl-8 pl-60 pl-md-15 pl-xs-15 brand-one-contents">
                            <div className="brand-style-one-items">
                                <Swiper
                                    {...sliderSettings}
                                    className="brand-style-one-carousel swiper"
                                    modules={[Keyboard, Autoplay, Pagination, Navigation]}
                                >
                                    <div className="swiper-wrapper">

                                        {/* Single Item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="brand-one">
                                                <img src={brand11} alt="Image Not Found" />
                                            </div>
                                        </SwiperSlide>
                                        {/* Single Item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="brand-one">
                                                <img src={brand22} alt="Image Not Found" />
                                            </div>
                                        </SwiperSlide>
                                        {/* Single Item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="brand-one">
                                                <img src={brand55} alt="Image Not Found" />
                                            </div>
                                        </SwiperSlide>
                                        {/* Single Item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="brand-one">
                                                <img src={brand66} alt="Image Not Found" />
                                            </div>
                                        </SwiperSlide>

                                    </div>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerV1;