import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';
import GalleryV1Data from "@/assets/jsonData/gallery/GalleryV1Data.json"
import SingleGalleryV1 from './SingleGalleryV1';

const GalleryV1 = ({ sectionClass }) => {

    const sliderSettings = {
        // Optional parameters
        loop: true,
        freeMode: true,
        grabCursor: true,
        slidesPerView: 1,
        spaceBetween: 50,
        autoplay: true,
        // pagination
        pagination: {
            el: '.project-pagination',
            type: 'fraction',
            clickable: true,
        },
        // Navigation arrows
        navigation: {
            nextEl: ".project-button-next",
            prevEl: ".project-button-prev"
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2.5,
                centeredSlides: true,
            },
        },
    }

    return (
        <>
            <div className={`gallery-style-one-area default-padding ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-lg-9">
                            <div className="site-heading">
                                <h4 className="sub-title">Case Studies</h4>
                                <h2 className="title">Have a view of our amazing projects with our clients</h2>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-3">
                            <div className="project-navigation-items">
                                {/* Navigation */}
                                <div className="project-swiper-nav">
                                    {/* Pagination */}
                                    <div className="project-pagination" />
                                    <div className="project-button-prev" />
                                    <div className="project-button-next" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fill">
                    <div className="row">
                        <Swiper {...sliderSettings}
                            className="gallery-style-one-carousel swiper"
                            modules={[Keyboard, Autoplay, Pagination, Navigation]}
                        >
                            <div className="swiper-wrapper">
                                {GalleryV1Data.map(gallery =>
                                    <SwiperSlide key={gallery.id} >
                                        <SingleGalleryV1 gallery={gallery} />
                                    </SwiperSlide>
                                )}
                            </div>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GalleryV1;