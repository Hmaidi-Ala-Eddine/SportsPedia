import team2Thumb from '/assets/img/team/v2.jpg';
import team4Thumb from '/assets/img/team/v4.jpg';
import { Link } from 'react-router-dom';


const BlogPostComments = () => {
    return (
        <>
            <div className="comments-list">
                <div className="comment-item">
                    <div className="avatar">
                        <img src={team2Thumb} alt="Author" />
                    </div>
                    <div className="content">
                        <div className="title">
                            <h5>Bubhan Prova <span className="reply"><Link to="#"><i className="fas fa-reply"></i> Reply</Link></span></h5>
                            <span>28 Feb, 2023</span>
                        </div>
                        <p>
                            Delivered ye sportsmen zealously arranging frankness estimable as. Nay any article enabled musical shyness yet sixteen yet blushes. Entire its the did figure wonder off. sportsmen zealously arranging to the main pint. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.
                        </p>
                    </div>
                </div>
                <div className="comment-item reply">
                    <div className="avatar">
                        <img src={team4Thumb} alt="Author" />
                    </div>
                    <div className="content">
                        <div className="title">
                            <h5>Mickel Jones <span className="reply"><Link to="#"><i className="fas fa-reply"></i> Reply</Link></span></h5>
                            <span>15 Mar, 2023</span>
                        </div>
                        <p>
                            Delivered ye sportsmen zealously arranging frankness estimable as. Nay any article enabled musical shyness yet sixteen yet blushes. Entire its the did figure wonder off. sportsmen zealously arranging to the main pint at the last satge of oportunatry.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPostComments;