import { Link } from "react-router-dom";

const SingleProjectV1 = ({ project }) => {
    const { id, accordionId, title, subtitle, collapseId, expanded, image } = project;

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={accordionId}>
                <button
                    className={`accordion-button ${expanded ? "" : "collapsed"}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={expanded}
                    aria-controls={collapseId}
                >
                    <span>{title}</span>
                    <b>{subtitle}</b>
                </button>
            </h2>
            <div
                id={collapseId}
                className={`accordion-collapse collapse ${expanded ? "show" : ""}`}
                aria-labelledby={accordionId}
                data-bs-parent="#projectAccordion"
            >
                <div className="accordion-body">
                    <div className="portfolio-style-one-thumb">
                        <img src={`/assets/img/portfolio/${image}`} alt="Image Not Found" />
                        <Link to={`/project-details/${id}`}>
                            <i className="fas fa-link" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProjectV1;
