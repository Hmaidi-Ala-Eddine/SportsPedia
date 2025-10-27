import brand11 from "/assets/img/brand/11.png"
import brand22 from "/assets/img/brand/22.png"
import brand33 from "/assets/img/brand/33.png"
import brand44 from "/assets/img/brand/44.png"
import brand55 from "/assets/img/brand/55.png"
import brand66 from "/assets/img/brand/66.png"
import Animation from '../animation/Animation';

const PartnerV2 = () => {
    return (
        <>
            <div className="partner-style-two-area default-padding bg-dark text-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 partner-style-one">
                            <div className="partner-style-one-item bg-theme text-light" style={{ backgroundImage: 'url(/assets/img/shape/22.png)' }}>
                                <h4 className="sub-title">Our Partners</h4>
                                <h2 className="title">Worked with <br /> Largest Brands</h2>
                            </div>
                        </div>

                        <Animation className='animate__animated animate__fadeInLeft' delay='100ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand11} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>

                        <Animation className='animate__animated animate__fadeInLeft' delay='200ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand22} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>

                        <Animation className='animate__animated animate__fadeInLeft' delay='300ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand33} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>

                        <Animation className='animate__animated animate__fadeInLeft' delay='400ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand44} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>

                        <Animation className='animate__animated animate__fadeInLeft' delay='500ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand55} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>

                        <Animation className='animate__animated animate__fadeInLeft' delay='600ms'>
                            <div className="col-lg-3 col-md-6 partner-style-one">
                                <div className="partner-style-one-item">
                                    <img src={brand66} alt="Image Not Found" />
                                </div>
                            </div>
                        </Animation>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerV2;