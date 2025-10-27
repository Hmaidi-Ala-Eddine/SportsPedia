import { useState } from 'react';
import mapIcon from "/assets/img/icon/map.png"
import mapThumb from "/assets/img/map.png"
import CountUp from 'react-countup';
import LocationData from "@/assets/jsonData/location/LocationData.json"

function LocationItem({ isActive, setActive, children }) {
    return (
        <div
            className={`location-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            {children}
        </div>
    );
}

const LocationV1 = () => {
    const [activeIndex, setActiveIndex] = useState(1);

    return (
        <>
            <div className="gobal-location-area default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="site-heading">
                                <h1 className="text-gradient" style={{ backgroundImage: 'url(/assets/img/banner/17.jpg)' }}>Global
                                    Locations</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="global-location-items">
                                {LocationData.map((data, index) =>
                                    <LocationItem
                                        key={index}
                                        isActive={activeIndex === index}
                                        setActive={() => setActiveIndex(index)}
                                    >
                                        <img src={mapIcon} alt="Image Not Found" />
                                        <div className="location-details">
                                            <h5>{data.title}</h5>
                                            <p>{data.text} </p>
                                        </div>
                                    </LocationItem>
                                )}
                                {/* Single Item */}
                                <img src={mapThumb} alt="Image Not Found" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container default-padding-top">
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
                                        <div className="timer"><CountUp end={30} enableScrollSpy={true} /></div>
                                        <div className="operator">+</div>
                                    </div>
                                    <span className="medium">Award Winning</span>
                                </div>
                            </div>
                            {/* Single item */}
                            <div className="col-lg-3 col-md-6 funfact-style-one-item">
                                <div className="fun-fact">
                                    <div className="counter">
                                        <div className="timer"><CountUp end={56} enableScrollSpy={true} /></div>
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
                            {/* End Single item */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LocationV1;