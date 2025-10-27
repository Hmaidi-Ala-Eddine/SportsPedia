import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';
import illustration5 from "/assets/img/illustration/5.png"
import shape16 from "/assets/img/shape/16.png"
import shape17 from "/assets/img/shape/17.png"

const TestimonialV1 = ({ sectionClass }) => {

    const sliderSettings = {
        // Optional parameters
        direction: "horizontal",
        loop: true,
        autoplay: true,
        pagination: {
            el: ".swiper-pagination",
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
            <div className={`testimonial-style-one-area ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="testimonial-style-one-items bg-gray-secondary">
                        <div className="row align-center">
                            <div className="col-xl-5 pr-80 pr-md-15 pr-xs-15">
                                <div className="testimonial-style-one-thumb">
                                    <img src={illustration5} alt="Image Not Found" />
                                    <div className="shape">
                                        <img src={shape16} alt="Image Not Found" />
                                        <img src={shape17} alt="Image Not Found" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-7">
                                <Swiper
                                    {...sliderSettings}
                                    className="testimonial-style-one-carousel"
                                    modules={[Keyboard, Autoplay, Pagination, Navigation]}
                                >
                                    <div className="swiper-wrapper">
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-one">
                                                <div className="item">
                                                    <div className="content">
                                                        <div className="top">
                                                            <h2>The best service ever</h2>
                                                        </div>
                                                        <p>
                                                            “Targetingconsultation discover apartments. ndulgence off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now always remembering”
                                                        </p>
                                                    </div>
                                                    <div className="provider">
                                                        <div className="info">
                                                            <h4>Matthew J. Wyman</h4>
                                                            <span>Senior Consultant</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-one">
                                                <div className="item">
                                                    <div className="content">
                                                        <div className="top">
                                                            <h2>Awesome opportunities</h2>
                                                        </div>
                                                        <p>
                                                            “Consultation discover apartments. ndulgence off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now always remembering to the point”
                                                        </p>
                                                    </div>
                                                    <div className="provider">
                                                        <div className="info">
                                                            <h4>Anthom Bu Spar</h4>
                                                            <span>Marketing Manager</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </div>

                                    <div className="swiper-nav-left">
                                        <div className="swiper-button-prev" />
                                        <div className="swiper-button-next" />
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

export default TestimonialV1;