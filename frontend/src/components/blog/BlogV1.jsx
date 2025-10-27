import BlogData from '@/assets/jsonData/blog/BlogData.json'
import SingleBlogV1 from './SingleBlogV1';

const BlogV1 = ({ sectionClass }) => {
    return (
        <>
            <div className={`blog-area home-blog bottom-less ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Blog Insight</h4>
                                <h2 className="title">Valuable insights to change your startup idea</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">

                        {BlogData.slice(0, 3).map(blog =>
                            <div className="col-xl-4 col-md-6 col-lg-6 mb-30" key={blog.id}>
                                <SingleBlogV1 blog={blog} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogV1;