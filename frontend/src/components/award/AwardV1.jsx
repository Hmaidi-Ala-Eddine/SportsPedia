import badge from "/assets/img/icon/badge.png"

const AwardV1 = () => {
    return (
        <>
            <div className="award-area bg-fixed" style={{ backgroundImage: 'url(/assets/img/banner/20.jpg)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="award-items text-center bg-dark text-light">
                                <div className="award-item">
                                    <img src={badge} alt="Image Not Found" />
                                    <div className="center-info">
                                        <h2>Official Selection</h2>
                                        <h4>Rising Star Award</h4>
                                    </div>
                                    <h2>2006</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AwardV1;