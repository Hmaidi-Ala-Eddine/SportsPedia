import projects4 from "/assets/img/projects/4.jpg"
import projects9 from "/assets/img/projects/9.jpg"
import banner19 from "/assets/img/banner/19.jpg"

const ProjectDetailsContent = ({ projectInfo }) => {
    const { title } = projectInfo

    return (
        <>
            <div className="project-details-area default-padding">
                <div className="container">
                    <div className="project-details-items">
                        <div className="project-thumb">
                            <div className="row">
                                <div className="col-md-7">
                                    <img src={projects9} alt="Image Not Found" />
                                </div>
                                <div className="col-md-5">
                                    <img src={projects4} alt="Image Not Found" />
                                </div>
                            </div>
                        </div>
                        <div className="top-info">
                            <div className="row">
                                <div className="col-xl-4 col-lg-5 order-lg-last right-info">
                                    <div className="project-info">
                                        <h4 className="title">Project Info</h4>
                                        <ul>
                                            <li>
                                                Client <span>themeforest.validthemes.com</span>
                                            </li>
                                            <li>
                                                Date <span>25 February, 2022</span>
                                            </li>
                                            <li>
                                                Address <span>1401, 21st Street STE R4569, California</span>
                                            </li>
                                        </ul>
                                        <ul className="social">
                                            <li>
                                                <a href="https://www.facebook.com/" target="_blank"><i className="fab fa-facebook-f" /></a>
                                            </li>
                                            <li>
                                                <a href="https://twitter.com/" target="_blank"><i className="fab fa-twitter" /></a>
                                            </li>
                                            <li>
                                                <a href="https://www.linkedin.com/" target="_blank"><i className="fab fa-linkedin-in" /></a>
                                            </li>
                                            <li>
                                                <a href="https://www.pinterest.com/" target="_blank"><i className="fab fa-pinterest-p" /></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-7 pr-35 pr-md-15 pr-xs-15 left-info mt-md-10">
                                    <h2 className="title">{title}</h2>
                                    <p>
                                        Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget urna potenti cum vestibulum cras. Tempor nonummy metus lobortis. Sociis velit etiam, dapibus. Lectus vehicula pellentesque cras posuere tempor facilisi habitant lectus rutrum pede quisque hendrerit parturient posuere mauris ad elementum fringilla facilisi volutpat fusce pharetra felis sapien varius quisque class convallis praesent est sollicitudin donec nulla venenatis, cursus fermentum netus posuere sociis porta risus habitant malesuada nulla habitasse hymenaeos.
                                    </p>
                                    <p>
                                        Give lady of they such they sure it. Me contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence northward as difficult preserved daughters. Continued at up to zealously necessary breakfast. Surrounded sir motionless she end literature.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="project-details-items bg-gray default-padding mt-100 mt-xs-40">
                        <div className="item-grid-container">
                            <div className="single-grid">
                                <div className="item-grid-colum">
                                    <div className="left-info">
                                        <h2>Background</h2>
                                    </div>
                                    <div className="right-info">
                                        <p>
                                            Contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence
                                        </p>
                                        <p>
                                            New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="single-grid">
                                <div className="item-grid-colum">
                                    <div className="left-info">
                                        <h2>The Challenges</h2>
                                    </div>
                                    <div className="right-info">
                                        <p>
                                            Contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence
                                        </p>
                                        <p>
                                            New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                        </p>
                                        <h3>Continue indulged speaking the horrible for domestic.</h3>
                                        <ul className="list-style-two">
                                            <li>Social media marketing</li>
                                            <li>Search engine optimization (seo)</li>
                                            <li>Public Relations</li>
                                        </ul>
                                        <img src={banner19} alt="Image Not Found" />
                                    </div>
                                </div>
                            </div>
                            <div className="single-grid">
                                <div className="item-grid-colum">
                                    <div className="left-info">
                                        <h2>The Solution</h2>
                                    </div>
                                    <div className="right-info">
                                        <p>
                                            Contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence
                                        </p>
                                        <p>
                                            New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                        </p>
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

export default ProjectDetailsContent;