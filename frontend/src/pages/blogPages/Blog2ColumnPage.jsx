import Blog2ColumnContent from '@/components/blog/Blog2ColumnContent';
import BodyClassV2 from '@/components/classes/BodyClassV2';
import LayoutV5 from '@/components/layouts/LayoutV5';

const Blog2ColumnPage = () => {
    return (
        <>
            <LayoutV5 breadCrumb="blog-2-column" title="Latest Blog">
                <Blog2ColumnContent />
                <BodyClassV2 />
            </LayoutV5>
        </>
    );
};

export default Blog2ColumnPage;