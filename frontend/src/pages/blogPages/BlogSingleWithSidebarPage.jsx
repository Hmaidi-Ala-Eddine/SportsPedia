import BlogData from '@/assets/jsonData/blog/BlogData.json';
import BlogSingleWithSidebarContent from '@/components/blog/BlogSingleWithSidebarContent';
import BodyClassV2 from '@/components/classes/BodyClassV2';
import LayoutV5 from '@/components/layouts/LayoutV5';
import { useParams } from 'react-router-dom';

const BlogSingleWithSidebarPage = () => {

    const { id } = useParams()
    const data = BlogData.find(blog => blog.id === parseInt(id))

    return (
        <>
            <LayoutV5 breadCrumb="blog-single-with-sidebar" title="Partiality indulgence dispatched to of celebrated.">
                <BlogSingleWithSidebarContent blogInfo={data} />
                <BodyClassV2 />
            </LayoutV5>
        </>
    );
};

export default BlogSingleWithSidebarPage;