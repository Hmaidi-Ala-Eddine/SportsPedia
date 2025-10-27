import { Link } from "react-router-dom";
import Animation from "../animation/Animation";

const SinglePortfolioV3 = ({ portfolio }) => {
    const { category, year, title, image, id } = portfolio;

    return (
        <Animation className="animate__animated animate__fadeInUp">
            <div className="portfolio-style-one">
                <Link to={`/project-details/${id}`} className="cursor-target">
                    <div className="thumb-zoom">
                        <img className="img-reveal" src={`/assets/img/portfolio/${image}`} alt="Image Not Found" />
                    </div>
                    <div className="pf-item-info">
                        <div className="content">
                            <div className="pf-tags">
                                <span>{category}</span>
                                <span>{year}</span>
                            </div>
                            <h2>{title}</h2>
                        </div>
                    </div>
                </Link>
            </div>
        </Animation>
    );
};

export default SinglePortfolioV3;
