import BlogStandardContent from '@/components/blog/BlogStandardContent';
import BodyClassV2 from '@/components/classes/BodyClassV2';
import LayoutV5 from '@/components/layouts/LayoutV5';

const BlogStandardPage = () => {
    return (
        <>
            <LayoutV5 breadCrumb="blog-standard" title="Blog Standard">
                <BlogStandardContent />
                <BodyClassV2 />
            </LayoutV5>
        </>
    );
};

export default BlogStandardPage;