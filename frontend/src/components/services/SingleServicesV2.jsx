import { Link } from 'react-router-dom';

const SingleServicesV2 = ({ service }) => {
    const { id, title, description, icon } = service;

    return (
        <>
            <div className="service-style-two">
                <img src={`/assets/img/icon/${icon}`} alt="Image Not Found" />
                <h4><Link to={`/services-details/${id}`}>{title}</Link></h4>
                <p>{description}</p>
            </div>
        </>
    );
};

export default SingleServicesV2;
