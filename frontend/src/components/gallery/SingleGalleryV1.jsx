import { Link } from "react-router-dom";

const SingleGalleryV1 = ({ gallery }) => {
    const { title, category, description, image, id } = gallery;

    return (
        <div className="gallery-style-one">
            <img src={`/assets/img/projects/${image}`} alt="Image Not Found" />
            <div className="overlay">
                <div className="info">
                    <h4><Link to={`/project-details/${id}`}>{title}</Link></h4>
                    <span>{category}</span>
                    <p>{description}</p>
                </div>
                <Link to={`/project-details/${id}`}>Explore <i className="fas fa-long-arrow-right" /></Link>
            </div>
        </div>
    );
};

export default SingleGalleryV1;
