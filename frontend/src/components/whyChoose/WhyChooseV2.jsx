/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import illustration7 from "/assets/img/illustration/7.png"

import CircleType from 'circletype';
import { Link } from 'react-router-dom';

const WhyChooseV2 = () => {

    const circleTypeElm = useRef(null);

    useEffect(() => {
        if (circleTypeElm.current) {
            const options = circleTypeElm.current.dataset.circleTextOptions;
            const circleTypeInstance = new CircleType(circleTypeElm.current);
        }
    }, []);

    return (
        <>
            <div className="choose-us-style-two-area relative bg-dark text-light">
                <div className="container">
                    <div className="row align-center">
                        <div className="col-xl-6 order-xl-last pl-80 pl-md-15 pl-xs-15 choose-us-style-two-content">
                            <div className="info-style-one">
                                <h4 className="sub-title">Why Choose Us</h4>
                                <h2 className="title">Empowering success in technology since 1968 </h2>
                                <p>
                                    Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                </p>
                                <ul className="list-sytle-four mt-30">
                                    <li>
                                        <h4>Tech Solution</h4>
                                        <p>
                                            Continued at up to zealously necessary breakfast. Surrounded sir motionless she end literature.
                                        </p>
                                    </li>
                                    <li>
                                        <h4>Quick support</h4>
                                        <p>
                                            Continued at up to zealously necessary breakfast. Surrounded sir motionless she end literature
                                        </p>
                                    </li>
                                </ul>
                                <Link className="btn btn-md circle btn-gradient animation mt-20" to="/about-us">Learn More</Link>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="thumb-style-three">
                                <img src={illustration7} alt="Image Not Found" />
                                <div className="circle-text" style={{ backgroundImage: 'url(/assets/img/shape/26.png)' }}>
                                    {/* curved-circle start*/}
                                    <div
                                        ref={circleTypeElm}
                                        className="circle-text-item"
                                        data-circle-text-options='{"radius": 81, "forceWidth": true, "forceHeight": true }'
                                    >
                                        .  Certified Company   .  IT Consulting Solution
                                    </div>
                                    <Link to="#"><i className="fas fa-long-arrow-right" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhyChooseV2;