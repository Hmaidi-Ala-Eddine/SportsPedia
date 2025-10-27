import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';
import team1 from "/assets/img/team/v1.jpg"
import team2 from "/assets/img/team/v2.jpg"
import quote from "/assets/img/quote.png"

const TestimonialV2 = ({ sectionClass }) => {

    const sliderSettings = {
        // Optional parameters
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: true,
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            }
        },
    }

    return (
        <>
            <div className={`testimonial-style-two-area default-padding bg-cover ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="testimonial-two-info">
                                <div className="icon">
                                    <img src={quote} alt="Image Not Found" />
                                </div>
                                <h2>Over 50K clients and 5,000 projects across the globe.</h2>
                                <div className="review-card">
                                    <h6>Excellent 18,560+ Reviews</h6>
                                    <div className="d-flex">
                                        <div className="icon">
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                        </div>
                                        <span>4.8/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 pl-60 pl-md-15 pl-xs-15">
                            <Swiper {...sliderSettings}
                                className="testimonial-style-two-carousel swiper"
                                modules={[Keyboard, Autoplay, Pagination, Navigation]}
                            >
                                <div className="swiper-wrapper">
                                    {/* Single item */}
                                    <SwiperSlide className="swiper-slide">
                                        <div className="testimonial-style-two">
                                            <div className="item">
                                                <div className="text-info">
                                                    <p>
                                                        “Targeting consultation apartments. ndulgence creative under folly death wrote cause her way spite. Plan upon yet way get cold spot its week.
                                                    </p>
                                                </div>
                                                <div className="content">
                                                    <div className="thumb">
                                                        <img src={team1} alt="Image Not Found" />
                                                    </div>
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
                                        <div className="testimonial-style-two">
                                            <div className="item">
                                                <div className="text-info">
                                                    <p>
                                                        “Consultation discover apartments. ndulgence off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week.
                                                    </p>
                                                </div>
                                                <div className="content">
                                                    <div className="thumb">
                                                        <img src={team2} alt="Image Not Found" />
                                                    </div>
                                                    <div className="info">
                                                        <h4>Anthom Bu Spar</h4>
                                                        <span>Marketing Manager</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    {/* Single item */}
                                    <SwiperSlide className="swiper-slide">
                                        <div className="testimonial-style-two">
                                            <div className="item">
                                                <div className="text-info">
                                                    <p>
                                                        “Targeting consultation apartments. ndulgence creative under folly death wrote cause her way spite. Plan upon yet way get cold spot its week.
                                                    </p>
                                                </div>
                                                <div className="content">
                                                    <div className="thumb">
                                                        <img src={team1} alt="Image Not Found" />
                                                    </div>
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
                                        <div className="testimonial-style-two">
                                            <div className="item">
                                                <div className="text-info">
                                                    <p>
                                                        “Consultation discover apartments. ndulgence off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week.
                                                    </p>
                                                </div>
                                                <div className="content">
                                                    <div className="thumb">
                                                        <img src={team2} alt="Image Not Found" />
                                                    </div>
                                                    <div className="info">
                                                        <h4>Anthom Bu Spar</h4>
                                                        <span>Marketing Manager</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    {/* Single item */}
                                </div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialV2;