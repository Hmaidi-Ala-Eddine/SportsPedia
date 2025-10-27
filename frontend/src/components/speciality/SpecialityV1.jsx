import CountUp from 'react-countup';
import SkillProgressData from "@/assets/jsonData/progress/SkillProgressData.json"
import SkillProgress from '../progress/SkillProgress';

const SpecialityV1 = ({ sectionClass }) => {
    return (
        <>
            <div className={`speciality-style-one-area default-padding-bottom ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="row align-center">
                        <div className="col-lg-4">
                            <div className="fun-fact-style-two text-light" style={{ backgroundImage: 'url(/assets/img/shape/1.jpg)' }}>
                                <div className="fun-fact">
                                    <div className="counter-title">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={90} enableScrollSpy={true} /></div>
                                            <div className="operator">%</div>
                                        </div>
                                    </div>
                                    <span className="medium">Successfull Projects</span>
                                </div>
                                <div className="fun-fact">
                                    <div className="counter-title">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={38} enableScrollSpy={true} /></div>
                                            <div className="operator">K</div>
                                        </div>
                                    </div>
                                    <span className="medium">Happy Clients</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 offset-xl-1 col-lg-8">
                            <div className="speciality-items">
                                <h4 className="sub-title">Our expertise</h4>
                                <h2 className="title">Our commitment <br /> is client satisfaction </h2>
                                <div className="d-grid mt-40">
                                    <ul className="list-style-two">
                                        <li>Organizational structure model </li>
                                        <li>Satisfaction guarantee</li>
                                        <li>Ontime delivery</li>
                                    </ul>
                                    <div className="progress-items">
                                        {SkillProgressData.map(skill =>
                                            <SkillProgress skill={skill} key={skill.id} />
                                        )}
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

export default SpecialityV1;