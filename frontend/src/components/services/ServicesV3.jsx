import ServicesV3Data from '@/assets/jsonData/services/ServicesV3Data.json'
import SingleServicesV3 from "./SingleServicesV3";

const ServicesV3 = () => {
    return (
        <>
            <div className="services-style-three-area default-padding bottom-less bg-gray-secondary bg-cover" style={{ backgroundImage: 'url(/assets/img/shape/24.png)' }}>
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
                        {ServicesV3Data.map(service =>
                            <div className="col-xl-4 col-lg-6 col-md-6 mb-30" key={service.id}>
                                <SingleServicesV3 service={service} key={service.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesV3;