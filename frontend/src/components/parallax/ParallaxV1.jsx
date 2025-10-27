/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import shape27 from "/assets/img/shape/27.png"
import banner20 from "/assets/img/banner/20.jpg"
import CircleType from 'circletype';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParallaxV1 = () => {

    const circleTypeElm = useRef(null);

    useEffect(() => {
        if (circleTypeElm.current) {
            const options = circleTypeElm.current.dataset.circleTextOptions;
            const circleTypeInstance = new CircleType(circleTypeElm.current);
        }
    }, []);

    // image Parallax 
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {

        if (width > 768) {
            gsap.registerPlugin(ScrollTrigger);
            const imageParallax = document.querySelectorAll('.img-container');
            imageParallax.forEach((container) => {
                const img = container.querySelector('img');
                const t4 = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        scrub: true,
                        pin: false,
                    },
                });

                t4.fromTo(img, {
                    yPercent: -60,
                    ease: 'none',
                }, {
                    yPercent: 60,
                    ease: 'none',
                });
            });
        }
    }, [width]);

    return (
        <>
            <div className="parallax-area">
                <img src={shape27} alt="Image Not Found" />
                <div className="img-container shape">
                    <img src={banner20} alt="Image Not Found" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="circle-progress-style-two text-center">
                                <div className="circle-text-card">
                                    <div className="circle-text style-two">
                                        {/* curved-circle start*/}
                                        <div
                                            ref={circleTypeElm}
                                            className="circle-text-item"
                                            data-circle-text-options='{"radius": 105, "forceWidth": true, "forceHeight": true }'
                                        >
                                            .  Certified Creative   .  Digital Agency Company
                                        </div>
                                    </div>
                                    <Link to="#"><i className="fas fa-long-arrow-right" /></Link>
                                </div>
                                <h2 className="title">Best creative &; modern agency</h2>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab veniam ullam vero officia incidunt ea, odio excepturi aut ipsum quis nihil eius ipsa at est libero reprehenderit sapiente iure voluptatem?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParallaxV1;