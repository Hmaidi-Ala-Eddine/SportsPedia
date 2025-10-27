import shape32 from "/assets/img/shape/32.png"
import { Link } from 'react-router-dom';
import ServicesV5Data from "@/assets/jsonData/services/ServicesV5Data.json"
import SingleServicesV5 from "./SingleServicesV5";

const ServicesV5 = ({ sectionClass }) => {
    return (
        <>
            <div className={`services-style-five-area default-padding-top ${sectionClass ? sectionClass : ""}`}>
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
                <div className="container container-stage">
                    <div className="services-style-five-items">
                        <div className="shape">
                            <img src={shape32} alt="Image Not Found" />
                        </div>
                        <div className="row align-center">
                            {ServicesV5Data.map(service =>
                                <div className="col-xl-3 col-lg-6 col-md-6 single-item" key={service.id}>
                                    <SingleServicesV5 service={service} />
                                </div>
                            )}
                            <div className="col-xl-3 col-lg-6 col-md-6 single-item">
                                <div className="services-style-five-item">
                                    <Link className="btn-large" to="/services"><i className="fas fa-long-arrow-right" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesV5;