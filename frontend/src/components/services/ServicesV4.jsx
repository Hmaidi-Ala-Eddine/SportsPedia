import icon23 from "/assets/img/icon/23.png"
import icon20 from "/assets/img/icon/20.png"
import icon21 from "/assets/img/icon/21.png"
import icon22 from "/assets/img/icon/22.png"
import { Link } from 'react-router-dom';

const ServicesV4 = () => {
    return (
        <>
            <div className="services-style-four-area default-padding-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="services-style-four-items">
                                {/* Single Item */}
                                <div className="services-style-four-item active">
                                    <div className="icon">
                                        <img src={icon23} alt="Image Not Found" />
                                    </div>
                                    <div className="info">
                                        <h4><Link to="/services-2">Air freight transportation </Link></h4>
                                    </div>
                                    <div className="button">
                                        <Link to="/services-2"><i className="fas fa-long-arrow-right" /></Link>
                                    </div>
                                </div>
                                {/* Single Item */}
                                <div className="services-style-four-item">
                                    <div className="icon">
                                        <img src={icon20} alt="Image Not Found" />
                                    </div>
                                    <div className="info">
                                        <h4><Link to="/services-2">Ocaen freight transportation </Link></h4>
                                    </div>
                                    <div className="button">
                                        <Link to="/services-2"><i className="fas fa-long-arrow-right" /></Link>
                                    </div>
                                </div>
                                {/* Single Item */}
                                <div className="services-style-four-item">
                                    <div className="icon">
                                        <img src={icon21} alt="Image Not Found" />
                                    </div>
                                    <div className="info">
                                        <h4><Link to="/services-2">Land freight transportation </Link></h4>
                                    </div>
                                    <div className="button">
                                        <Link to="/services-2"><i className="fas fa-long-arrow-right" /></Link>
                                    </div>
                                </div>
                                {/* Single Item */}
                                <div className="services-style-four-item">
                                    <div className="icon">
                                        <img src={icon22} alt="Image Not Found" />
                                    </div>
                                    <div className="info">
                                        <h4><Link to="/services-2">Rail freight transportation </Link></h4>
                                    </div>
                                    <div className="button">
                                        <Link to="/services-2"><i className="fas fa-long-arrow-right" /></Link>
                                    </div>
                                </div>
                                {/* End Single Item */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesV4;