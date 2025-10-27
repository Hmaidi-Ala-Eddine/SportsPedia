import Progress2Data from "@/assets/jsonData/progress/SkillProgress2Data.json"
import SkillProgressV2 from '../progress/SkillProgressV2';
import MessageForm from '../form/MessageForm';
import { Link } from 'react-router-dom';

const SingleTeamMemberInfo = ({ teamInfo }) => {
    const { name, memberThumb, designation, email, phone } = teamInfo

    return (
        <>
            <div className="team-single-area default-padding-top">
                <div className="container">
                    <div className="team-content-top">
                        <div className="row">
                            <div className="col-lg-5 left-info">
                                <div className="thumb">
                                    <img src={`/assets/img/team/${memberThumb}`} alt="Thumb" />
                                </div>
                            </div>
                            <div className="col-lg-7 right-info">
                                <h2 className="title">{name}</h2>
                                <span>{designation}</span>
                                <p>
                                    Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring house in never fruit up. Pasture imagine my garrets..
                                </p>
                                <ul>
                                    <li>
                                        <strong>Email:</strong>
                                        <a href={`mailto:${email}`}> {email}</a>
                                    </li>
                                    <li>
                                        <strong>Phone:</strong>
                                        <a href={`tel:${phone}`}> {phone}</a>
                                    </li>
                                </ul>
                                <div className="social">
                                    <Link className="btn circle btn-sm btn-gradient animation" to="/contact-us">Contact Me</Link>
                                    <div className="share-link">
                                        <i className="fas fa-share-alt" />
                                        <ul>
                                            <li className="facebook">
                                                <a href="http://facebook.com" target='_blank'>
                                                    <i className="fab fa-facebook-f" />
                                                </a>
                                            </li>
                                            <li className="twitter">
                                                <a href="http://twitter.com" target='_blank'>
                                                    <i className="fab fa-twitter" />
                                                </a>
                                            </li>
                                            <li className="youtube">
                                                <a href="http://youtube.com" target='_blank'>
                                                    <i className="fab fa-youtube" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-info bg-gray default-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="skill-items">
                                    <h2>Personal Skills</h2>
                                    <p>
                                        Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position.
                                    </p>
                                    {Progress2Data.map(skill =>
                                        <SkillProgressV2 skill={skill} key={skill.id} />
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="short-contact">
                                    <h2 className="heading">Send  a Massage</h2>
                                    <MessageForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleTeamMemberInfo;