import { Link } from "react-router-dom";

const SingleGalleryV2 = ({ gallery }) => {
    const { id, title, category, description, image } = gallery

    return (
        <div className="gallery-style-two">
            <img src={`/assets/img/projects/${image}`} alt="Image Not Found" />
            <div className="overlay text-light">
                <div className="info">
                    <span>{category}</span>
                    <h4><Link to={`/project-details/${id}`}>{title}</Link></h4>
                    <p>{description}</p>
                </div>
                <Link to={`/project-details/${id}`}>Know More <i className="fas fa-long-arrow-right" /></Link>
            </div>
        </div>
    );
};

export default SingleGalleryV2;
