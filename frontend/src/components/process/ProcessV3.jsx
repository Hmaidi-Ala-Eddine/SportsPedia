import banner16 from "/assets/img/banner/16.jpg"

const ProcessV3 = () => {
    return (
        <>
            <div className="process-style-three-area default-padding bg-gray">
                <div className="fixed-half-thumb">
                    <img src={banner16} alt="Image Not Found" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-6">
                            <div className="process-style-three-info">
                                <h4 className="sub-title">Our Process</h4>
                                <h2 className="title">Fast delivery and <br /> secure packages </h2>
                            </div>
                            <div className="process-style-three-items project-style-one-items">
                                <div className="accordion" id="projectAccordion">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                <span><strong>01</strong></span>
                                                <b>Booking of freight</b>
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#projectAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    Contrasted dissimilar get joy you instrument out reasonably. Again keeps at
                                                    no meant stuff. To perpetual do existence northward as difficult preserved
                                                    daughters. Continued at up to zealously necessary breakfast. Surrounded sir
                                                    motionless she end literature. Gay direction neglected but supported yet
                                                    her.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                <span><strong>02</strong></span>
                                                <b>Goods are processed</b>
                                            </button>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#projectAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    Contrasted dissimilar get joy you instrument out reasonably. Again keeps at
                                                    no meant stuff. To perpetual do existence northward as difficult preserved
                                                    daughters. Continued at up to zealously necessary breakfast. Surrounded sir
                                                    motionless she end literature. Gay direction neglected but supported yet
                                                    her.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                <span><strong>03</strong></span>
                                                <b>Goods arrive in the country</b>
                                            </button>
                                        </h2>
                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#projectAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    Contrasted dissimilar get joy you instrument out reasonably. Again keeps at
                                                    no meant stuff. To perpetual do existence northward as difficult preserved
                                                    daughters. Continued at up to zealously necessary breakfast. Surrounded sir
                                                    motionless she end literature. Gay direction neglected but supported yet
                                                    her.
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
        </>
    );
};

export default ProcessV3;