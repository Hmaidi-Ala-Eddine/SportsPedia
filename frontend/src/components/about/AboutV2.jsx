import { useState } from 'react';
import thumb2 from "/assets/img/thumb/2.jpg"
import thumb5 from "/assets/img/thumb/5.jpg"
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';

const AboutV2 = () => {

    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <div className="about-style-two-area default-padding">
                <div className="container">
                    <div className="row align-center">
                        <div className="col-xl-6 offset-xl-1 col-lg-6 order-lg-last">
                            <div className="about-style-two-thumb">
                                <div className="thumb">
                                    <img src={thumb5} alt="Image Not Found" />
                                    <div className="shape-card text-light" style={{ backgroundImage: 'url(/assets/img/shape/21.png)' }}>
                                        <h4>Empower your business with us!</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6">
                            <h4 className="sub-title">About Us</h4>
                            <h2 className="title">Meet the executives driving our success.</h2>
                            <p>
                                Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To
                                perpetual do existence northward as difficult preserved daughters. Continued at up to zealously
                                necessary breakfast. Surrounded sir motionless she end literature ganiay direction.
                            </p>
                            <div className="card-style-two mt-40">
                                <div className="thumb">
                                    <img src={thumb2} alt="Image Not Found" />
                                    <Link onClick={() => setOpen(true)} to="#" className="popup-youtube video-play-button"><i className="fas fa-play" /></Link>
                                </div>
                                <div className="info">
                                    <h2>3.8 X</h2>
                                    <h5>Economical growth </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="aTC_RNYtEb0" onClose={() => setOpen(false)} />
        </>
    );
};

export default AboutV2;