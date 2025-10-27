import BlogData from '@/assets/jsonData/blog/BlogData.json'
import SingleBlogV2 from './SingleBlogV2';

const BlogV2 = () => {
    return (
        <>
            <div className="blog-area home-blog blog-2-col default-padding bottom-less">
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
                        {BlogData.slice(1, 3).map(blog =>
                            <div className="col-xl-6 col-md-6 col-lg-6 mb-30" key={blog.id}>
                                <SingleBlogV2 blog={blog} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogV2;