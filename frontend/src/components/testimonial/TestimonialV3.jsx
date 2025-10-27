import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';
import team1 from "/assets/img/team/v1.jpg"
import team3 from "/assets/img/team/v3.jpg"
import quote from "/assets/img/quote.png"

const TestimonialV3 = () => {

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
        },
    }

    return (
        <>
            <div className="testimonial-style-three-area bg-gray default-padding">
                <div className="container">
                    <div className="row align-center">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="testimonial-style-three-items">
                                <Swiper {...sliderSettings}
                                    className="testimonial-style-three-carousel swiper"
                                    modules={[Keyboard, Autoplay, Pagination, Navigation]}
                                >
                                    <div className="swiper-wrapper">
                                        {/* Single item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-three">
                                                <div className="thumb">
                                                    <img src={team3} alt="Image Not Found" />
                                                    <div className="icon">
                                                        <img src={quote} alt="Image Not Found" />
                                                    </div>
                                                </div>
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
                                        {/* Single item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-three">
                                                <div className="thumb">
                                                    <img src={team1} alt="Image Not Found" />
                                                    <div className="icon">
                                                        <img src={quote} alt="Image Not Found" />
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="content">
                                                        <div className="top">
                                                            <h2>Awesome opportunities</h2>
                                                        </div>
                                                        <p>
                                                            “Consultation discover apartments. ndulgence off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now always remembering point
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
                                        {/* End Single item */}
                                    </div>
                                    {/* Navigation */}
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

export default TestimonialV3;