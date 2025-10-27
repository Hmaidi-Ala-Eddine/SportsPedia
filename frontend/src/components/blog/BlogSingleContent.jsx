import team1Thumb from "/assets/img/team/v1.jpg"
import SocialShare from '../utilities/SocialShare';
import BlogPostComments from './BlogPostComments';
import BlogCommentForm from '../form/BlogCommentForm';
import { Link } from 'react-router-dom';
import Animation from '../animation/Animation';

const BlogSingleContent = ({ blogInfo }) => {
    const { date, dateIcon, thumbFull } = blogInfo

    return (
        <>
            <div className="blog-area single full-blog full-blog default-padding-bottom">
                <div className="container">
                    <div className="blog-items">
                        <div className="row">
                            <Animation className='animate__animated animate__fadeInUp'>
                                <div className="blog-content col-lg-10 offset-lg-1 col-md-12">
                                    <div className="blog-style-two item">
                                        <div className="blog-item-box">
                                            <div className="thumb">
                                                <Link to="#"><img src={`/assets/img/blog/${thumbFull}`} alt="Thumb" /></Link>
                                            </div>
                                            <div className="info">
                                                <div className="meta">
                                                    <ul>
                                                        <li>
                                                            <Link to="#"><i className={dateIcon}></i> {date}</Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#"><i className="fas fa-user-circle" /> Md Sohag</Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <p>
                                                    Give lady of they such they sure it. Me contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence northward as difficult preserved daughters. Continued at up to zealously necessary breakfast. Surrounded sir motionless she end literature. Gay direction neglected but supported yet her.
                                                </p>
                                                <p>
                                                    New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                                </p>
                                                <blockquote>
                                                    Celebrated share of first to worse. Weddings and any opinions suitable smallest nay. Houses or months settle remove ladies appear. Engrossed suffering supposing he recommend do eagerness.
                                                </blockquote>
                                                <p>
                                                    Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                                </p>
                                                <h3>Conduct replied off led whether?</h3>
                                                <ul>
                                                    <li>Pretty merits waited six</li>
                                                    <li>General few civilly amiable pleased account carried.</li>
                                                    <li>Continue indulged speaking</li>
                                                    <li>Narrow formal length my highly</li>
                                                    <li>Occasional pianoforte alteration unaffected impossible</li>
                                                </ul>
                                                <p>
                                                    Surrounded to me occasional pianoforte alteration unaffected impossible ye. For saw half than cold. Pretty merits waited six talked pulled you. Conduct replied off led whether any shortly why arrived adapted. Numerous ladyship so raillery humoured goodness received an. So narrow formal length my highly longer afford oh. Tall neat he make or at dull ye. Lorem ipsum dolor, sit amet consectetur adipisicing, elit. Iure, laudantium, tempore. Autem dolore repellat, omnis quam? Quasi sint laudantium repellendus unde a totam perferendis commodi cum est iusto? Minima, laborum.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Author */}
                                    <div className="post-author">
                                        <div className="thumb">
                                            <img src={team1Thumb} alt="Thumb" />
                                        </div>
                                        <div className="info">
                                            <h4><Link to="#">Md Sohag</Link></h4>
                                            <p>
                                                Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec at odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit to the consectetur elit. All the Lorem Ipsum generators on the Internet tend.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Post Author */}

                                    {/* Post Tags Share */}
                                    <div className="post-tags share">
                                        <div className="tags">
                                            <h4>Tags: </h4>
                                            <Link to="#">Algorithm</Link>
                                            <Link to="#">Data science</Link>
                                        </div>
                                        <div className="social">
                                            <h4>Share:</h4>
                                            <ul>
                                                <SocialShare />
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Post Tags Share */}

                                    {/* Start Post Pagination */}
                                    <div className="post-pagi-area">
                                        <div className="post-previous">
                                            <Link to="#">
                                                <div className="icon"><i className="fas fa-angle-double-left"></i></div>
                                                <div className="nav-title"> Previus Post <h5>Discovery incommode</h5></div>
                                            </Link>
                                        </div>
                                        <div className="post-next">
                                            <Link to="#">
                                                <div className="nav-title">Next Post <h5>Discovery incommode</h5></div>
                                                <div className="icon"><i className="fas fa-angle-double-right"></i></div>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* End Post Pagination */}

                                    {/* Start Blog Comment */}
                                    <div className="blog-comments">
                                        <div className="comments-area">
                                            <div className="comments-title">
                                                <h3>3 Comments On “Providing Top Quality Cleaning Related Services Charms.”</h3>
                                                <BlogPostComments />
                                            </div>
                                            <div className="comments-form">
                                                <div className="title">
                                                    <h3>Leave a comments</h3>
                                                </div>
                                                <BlogCommentForm />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Animation>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogSingleContent;