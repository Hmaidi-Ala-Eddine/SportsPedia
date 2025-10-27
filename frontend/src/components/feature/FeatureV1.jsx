import CountUp from 'react-countup';

const FeatureV1 = () => {
    return (
        <>
            <div className="feature-style-one-area">
                <div className="container container-stage">
                    <div className="feature-style-one-items">
                        <div className="row">
                            <div className="col-xl-4 col-lg-5">
                                <div className="feature-style-one-info">
                                    <div className="fun-fact">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={68} enableScrollSpy={true} /></div>
                                            <div className="operator">K</div>
                                        </div>
                                    </div>
                                    <h3>Customers are served in our conusting services</h3>
                                    <ul className="list-style-one mt-25">
                                        <li>Growth Method Analysis</li>
                                        <li>Business Management consultation</li>
                                        <li>Team Building Leadership</li>
                                        <li>Assessment Report Analysis</li>
                                    </ul>
                                    <div className="path" />
                                </div>
                            </div>
                            <div className="col-xl-8 col-lg-7 feature-style-one-content text-light">
                                <div className="feature-style-one-cards">
                                    <div className="path" />

                                    {/* Single item */}
                                    <div className="feature-style-one-item">
                                        <div className="icon">
                                            <img src="/assets/img/icon/1.png" alt="Image Not Found" />
                                        </div>
                                        <div className="info">
                                            <h4>Approach</h4>
                                            <p>
                                                Continued at necessary breakfast. Surrounded sir motionless she end literature. Gay direction neglected but supported yet her.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Single item */}
                                    <div className="feature-style-one-item">
                                        <div className="icon">
                                            <img src="/assets/img/icon/2.png" alt="Image Not Found" />
                                        </div>
                                        <div className="info">
                                            <h4>Information</h4>
                                            <p>
                                                Continued at necessary breakfast. Surrounded sir motionless she end literature. Gay direction neglected but supported yet her.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Single item */}
                                    <div className="feature-style-one-item">
                                        <div className="icon">
                                            <img src="/assets/img/icon/3.png" alt="Image Not Found" />
                                        </div>
                                        <div className="info">
                                            <h4>Goal</h4>
                                            <p>
                                                Continued at necessary breakfast. Surrounded sir motionless she end literature. Gay direction neglected but supported yet her.
                                            </p>
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

export default FeatureV1;