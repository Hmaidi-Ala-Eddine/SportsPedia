import CountUp from 'react-countup';

const FactV1 = ({ sectionClass }) => {
    return (
        <>
            <div className={`fun-factor-area default-padding-bottom ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="fun-fact-style-one-items text-center">
                        <div className="row">

                            {/* Single item */}
                            <div className="col-lg-3 col-md-6 funfact-style-one-item">
                                <div className="fun-fact">
                                    <div className="counter">
                                        <div className="timer"><CountUp end={56} enableScrollSpy={true} /></div>
                                        <div className="operator">K</div>
                                    </div>
                                    <span className="medium">Clients around the world</span>
                                </div>
                            </div>
                            {/* Single item */}
                            <div className="col-lg-3 col-md-6 funfact-style-one-item">
                                <div className="fun-fact">
                                    <div className="counter">
                                        <div className="timer"></div>
                                        <div className="operator"><CountUp end={30} enableScrollSpy={true} />+</div>
                                    </div>
                                    <span className="medium">Award Winning</span>
                                </div>
                            </div>
                            {/* Single item */}
                            <div className="col-lg-3 col-md-6 funfact-style-one-item">
                                <div className="fun-fact">
                                    <div className="counter">
                                        <div className="timer"><CountUp end={97} enableScrollSpy={true} /></div>
                                        <div className="operator">%</div>
                                    </div>
                                    <span className="medium">Business Growth</span>
                                </div>
                            </div>
                            {/* Single item */}
                            <div className="col-lg-3 col-md-6 funfact-style-one-item">
                                <div className="fun-fact">
                                    <div className="counter">
                                        <div className="timer"><CountUp end={60} enableScrollSpy={true} /></div>
                                        <div className="operator">+</div>
                                    </div>
                                    <span className="medium">Team Members</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FactV1;