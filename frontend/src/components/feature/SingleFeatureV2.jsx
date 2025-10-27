import { Link } from 'react-router-dom';

const SingleFeatureV2 = ({ feature }) => {
    const { image, icon, title, description, id } = feature

    return (
        <div className="feature-style-two">
            <div className="thumb">
                <img src={`/assets/img/features/${image}`} alt="Thumb" />
                <div className="title">
                    <div className="top">
                        <img src={`/assets/img/icon/${icon}`} alt="Icon Not Found" />
                        <h4><Link to={`/services-details/${id}`}>{title}</Link></h4>
                    </div>
                    <Link to={`/services-details/${id}`}><i className="fas fa-long-arrow-right" /></Link>
                </div>
                <div className="overlay text-center">
                    <div className="content">
                        <div className="icon">
                            <img src={`/assets/img/icon/${icon}`} alt="Icon Not Found" />
                        </div>
                        <h4><Link to={`/services-details/${id}`}>{title}</Link></h4>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleFeatureV2;
