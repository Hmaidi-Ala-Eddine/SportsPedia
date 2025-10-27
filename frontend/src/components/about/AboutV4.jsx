import illustration10 from "/assets/img/illustration/10.png"
import illustration11 from "/assets/img/illustration/11.png"
import about6 from "/assets/img/about/6.jpg"
import CountUp from 'react-countup';

const AboutV4 = () => {
    return (
        <>
            <div className="about-style-four-area default-padding">
                <div className="container">
                    <div className="row align-center">
                        <div className="col-xl-4 col-lg-6">
                            <div className="thumb-style-four">
                                <img src={illustration11} alt="Image Not Found" />
                                <img src={illustration10} alt="Image Not Found" />
                                <div className="expertise-card">
                                    <div className="fun-fact">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={56} enableScrollSpy={true} /></div>
                                            <div className="operator">K</div>
                                        </div>
                                        <span className="medium">Clients around the world</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 pl-50 pl-md-15 pl-xs-15">
                            <h2 className="title"> We’ll keep your items damage free</h2>
                            <p>
                                Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.
                                Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not
                                esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son
                                themselves.
                            </p>
                            <ul className="list-style-two mt-20">
                                <li>Intermodal Shipping</li>
                                <li>Container Freight</li>
                                <li>Freeze product Shipping</li>
                            </ul>
                        </div>
                        <div className="col-xl-3">
                            <div className="address-card">
                                <div className="thumb">
                                    <img src={about6} alt="Image Not Found" />
                                </div>
                                <div className="info">
                                    <h4>Warehouse Storage </h4>
                                    <p>
                                        70240 Avenue of the Moon MF Tower, East California
                                    </p>
                                    <ul>
                                        <li><a href="tel:+4733378901"><i className="fas fa-phone-alt" /> +4733378901</a></li>
                                        <li><a href="mailto:info@crysta.com"><i className="fas fa-envelope" />
                                            info@digital.com</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutV4;