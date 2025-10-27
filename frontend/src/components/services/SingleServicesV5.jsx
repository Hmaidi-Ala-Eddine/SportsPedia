import { Link } from 'react-router-dom';

const SingleServicesV5 = ({ service }) => {
    const { id, title, description, image, features } = service

    return (
        <div className="services-style-five-item">
            <div className="icon">
                <img src={`/assets/img/icon/${image}`} alt={title} />
            </div>
            <h3><Link to={`/services-details/${id}`}>{title}</Link></h3>
            <p>{description}</p>
            <ul className="list-style-four">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
    );
};

export default SingleServicesV5;
