import { useState } from 'react';
import banner21 from "/assets/img/banner/21.jpg"
import about1 from "/assets/img/about/1.jpg"
import icon4 from "/assets/img/icon/4.png"
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';

const ServicesDetailsContent = ({ serviceInfo }) => {
    const { title } = serviceInfo

    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <div className="services-details-area default-padding">
                <div className="cotnainer">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Service Details</h4>
                                <h2 className="title">Best influencer marketing services</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="services-details-items">
                        <div className="row">
                            <div className="col-xl-12 services-single-content">
                                <div className="thumb mb-50">
                                    <img src={banner21} alt="Thumb" />
                                </div>
                                <p>
                                    We denounce with righteous indige nation and dislike men who are so beguiled and demo realized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue cannot foresee. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled data structures manages data in technology. New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                </p>
                                <div className="process-style-one-items mt-50">
                                    <div className="choose-us-one-thumb">
                                        <div className="content">
                                            <div className="left-info">
                                                <h2 className="title">{title}</h2>
                                            </div>
                                            <div className="process-style-one">
                                                <div className="process-style-one-item">
                                                    <span>01</span>
                                                    <h4>Information Collection</h4>
                                                    <p>
                                                        Excuse Deal say over contain performance from comparison new melancholy themselves.
                                                    </p>
                                                </div>
                                                <div className="process-style-one-item">
                                                    <span>02</span>
                                                    <h4>Projection Report Analysis</h4>
                                                    <p>
                                                        Excuse Deal say over contain performance from comparison new melancholy themselves.
                                                    </p>
                                                </div>
                                                <div className="process-style-one-item">
                                                    <span>03</span>
                                                    <h4>Consultation Solution</h4>
                                                    <p>
                                                        Excuse Deal say over contain performance from comparison new melancholy themselves.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="services-content bg-gray default-padding">
                <div className="container">
                    <div className="about-style-one-items">
                        <div className="row">
                            <div className="col-xl-7 col-lg-6">
                                <div className="thumb-style-one">
                                    <img src={about1} alt="Image Not Found" />
                                    <Link onClick={() => setOpen(true)} to="#" className="popup-youtube video-play-button">
                                        <i className="fas fa-play" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-xl-5 col-lg-6 pl-50 pl-md-15 pl-xs-15">
                                <div className="about-style-one-info">
                                    <div className="content">
                                        <h2 className="title">Meet the executives driving our success.</h2>
                                        <p>
                                            Businesses operate in various industries, including technology, finance, healthcare, retail, and manufacturing, among others. They play a crucial role in the economy by providing goods, services, and employment never fruit up Pasture imagin. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse.
                                        </p>
                                    </div>
                                    <ul className="card-list">
                                        <li>
                                            <img src={icon4} alt="Image Not Found" />
                                            <h5>Award Winning Company</h5>
                                        </li>
                                        <li>
                                            <h2>3.8 X</h2>
                                            <h5>Economical growth </h5>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="services-content default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h2 className="title">Service Process</h2>
                            <p>
                                Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                            </p>
                            <div className="accordion mt-50" id="faqAccordion">
                                <div className="accordion-item accordion-style-one">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            What problem does your business solve?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            <p>
                                                New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                            </p>
                                            <ul className="list-style-two">
                                                <li>Business Management consultation</li>
                                                <li>Team Building Leadership</li>
                                                <li>Growth Method Analysis</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item accordion-style-one">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            How does your business generate income?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            <p>
                                                New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                            </p>
                                            <ul className="list-style-two">
                                                <li>Business Management consultation</li>
                                                <li>Team Building Leadership</li>
                                                <li>Growth Method Analysis</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item accordion-style-one">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Which parts of business are profitable?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            <p>
                                                New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                            </p>
                                            <ul className="list-style-two">
                                                <li>Business Management consultation</li>
                                                <li>Team Building Leadership</li>
                                                <li>Growth Method Analysis</li>
                                            </ul>
                                        </div>
                                    </div>
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

export default ServicesDetailsContent;