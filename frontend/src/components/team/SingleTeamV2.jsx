import { Link } from 'react-router-dom';

const SingleTeamV2 = ({ team }) => {
    const { id, memberThumb2, name, designation } = team

    return (
        <>
            <div className="team-style-two-item" style={{ backgroundImage: 'url(/assets/img/shape/15.webp)' }}>
                <div className="thumb">
                    <img src={`/assets/img/team/${memberThumb2}`} alt="Image Not Found" />
                    <Link to="#" ><i className="fas fa-envelope" /></Link>
                </div>
                <div className="info">
                    <h4><Link to={`/team-details/${id}`}>{name}</Link></h4>
                    <span>{designation}</span>
                </div>
            </div>
        </>
    );
};

export default SingleTeamV2;