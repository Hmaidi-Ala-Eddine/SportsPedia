import CountUp from 'react-countup';

const WhyChooseV3 = ({ sectionClass }) => {
    return (
        <>
            <div className={`chooseus-style-two-area style-three default-padding-bottom ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="chooseus-style-two-items bg-cover" style={{ backgroundImage: 'url(/assets/img/shape/2.jpg)' }}>
                        <div className="row">
                            <div className="col-xl-6 pr-50 pr-md-15 pr-xs-15">
                                <div className="fun-fact-style-info">
                                    <h2 className="title">We Appreciate Clients and Business</h2>
                                    <div className="fun-fact-card-two mt-40">
                                        <h4 className="sub-title">Why Choose Us</h4>
                                        <div className="counter-title">
                                            <div className="counter">
                                                <div className="timer"><CountUp end={56} enableScrollSpy={true} /></div>
                                                <div className="operator">K</div>
                                            </div>
                                        </div>
                                        <span className="medium">Clients around the world</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="choose-us-style-two">
                                    <div className="accordion" id="faqAccordion">
                                        <div className="accordion-item accordion-style-one">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    What problem does your business solve?
                                                </button>
                                            </h2>
                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                                <div className="accordion-body">
                                                    <p>
                                                        Bennings appetite disposed me an at subjects an. To no indulgence
                                                        diminution so discovered mr apartments. Are off under folly death wrote
                                                        cause her way spite.
                                                    </p>
                                                    <ul className="list-style-one">
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
                                                        Trollering appetite disposed me an at subjects an. To no indulgence
                                                        diminution so discovered mr apartments. Are off under folly death wrote
                                                        cause her way spite.
                                                    </p>
                                                    <ul className="list-style-one">
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
                                                        Perfect appetite disposed me an at subjects an. To no indulgence
                                                        diminution so discovered mr apartments. Are off under folly death wrote
                                                        cause her way spite.
                                                    </p>
                                                    <ul className="list-style-one">
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
                </div>
            </div>
        </>
    );
};

export default WhyChooseV3;