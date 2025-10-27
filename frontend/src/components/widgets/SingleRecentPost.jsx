import { Link } from 'react-router-dom';

const SingleRecentPost = ({ blog }) => {
    const { id, thumb, title, date } = blog

    const truncateString = (str) => {
        if (str.length <= 47) {
            return str;
        }
        return `${str.slice(0, 47)} ...`;
    };

    const truncatedTitle = truncateString(title);

    return (
        <>
            <li>
                <div className="thumb">
                    <Link to={`/blog-single-with-sidebar/${id}`}>
                        <img src={`/assets/img/blog/${thumb}`} alt="Thumb" />
                    </Link>
                </div>
                <div className="info">
                    <div className="meta-title">
                        <span className="post-date">{date}</span>
                    </div>
                    <Link to={`/blog-single-with-sidebar/${id}`}>{truncatedTitle}</Link>
                </div>
            </li>
        </>
    );
};

export default SingleRecentPost;