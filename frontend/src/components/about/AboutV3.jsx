import about4 from '/assets/img/about/4.jpg'
import CountUp from 'react-countup';

const AboutV3 = () => {
    return (
        <>
            <div className="about-style-three-area default-padding">
                <div className="container">
                    <div className="row align-center">
                        <div className="col-lg-6">
                            <div className="about-style-three-info">
                                <h4 className="sub-title">About Us</h4>
                                <h2 className="title">Providing technology for smart it solutions</h2>
                                <p>
                                    Numerous ladyship so raillery humoured goodness received an. So narrow formal length my highly longer afford oh. Tall neat he make or at dull ye. Lorem ipsum dolor, sit amet consectetur adipisicing, elit. Iure, laudantium, tempore.
                                </p>
                                <div className="info-grid mt-50">
                                    <div className="left-info">
                                        <div className="fun-fact-card-two">
                                            <h4 className="sub-title">Our Expertise</h4>
                                            <div className="counter-title">
                                                <div className="counter">
                                                    <div className="timer"><CountUp end={26} enableScrollSpy={true} /></div>
                                                    <div className="operator">+</div>
                                                </div>
                                            </div>
                                            <span className="medium">Years of experience</span>
                                        </div>
                                    </div>
                                    <div className="right-info bg-gradient text-light">
                                        <ul className="list-style-three">
                                            <li>Network security</li>
                                            <li>Mobile networking</li>
                                            <li>Cloud computing</li>
                                            <li>Information technology consulting</li>
                                            <li>Backup solutions</li>
                                            <li>Hardware support</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <div className="thumb-style-two">
                                <img src={about4} alt="Image Not Found" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutV3;