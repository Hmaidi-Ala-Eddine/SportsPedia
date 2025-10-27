import { useEffect, useState } from 'react';
import ServicesV1Data from "@/assets/jsonData/services/ServicesV1Data.json"
import SingleServicesV1 from './SingleServicesV1';

const ServicesV1 = () => {

    const [expandedItem, setExpandedItem] = useState(0);
    const [isWideScreen, setIsWideScreen] = useState(false);

    const handleMouseEnter = (index) => {
        setExpandedItem(index);
    };

    const handleTouchStart = (index) => {
        setExpandedItem(index);
    };

    const handleTouchEnd = () => {
        setExpandedItem(null);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 767);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="services-style-one-area default-padding" style={{ background: 'url(/assets/img/shape/12.png)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Our Services</h4>
                                <h2 className="title">Empower your business with our services.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="services-style-one-items">
                                {ServicesV1Data.map((service, index) =>
                                    <div
                                        key={index}
                                        className={`services-style-one-item ${expandedItem === index ? 'out' : ''}`}
                                        onMouseEnter={isWideScreen ? () => handleMouseEnter(index) : null}
                                        onTouchStart={isWideScreen ? null : () => handleTouchStart(index)}
                                        onTouchEnd={isWideScreen ? null : handleTouchEnd}
                                    >
                                        <SingleServicesV1 service={service} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesV1;