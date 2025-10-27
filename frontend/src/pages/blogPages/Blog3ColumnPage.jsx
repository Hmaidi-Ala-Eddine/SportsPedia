import Blog3ColumnContent from '@/components/blog/Blog3ColumnContent';
import BodyClassV2 from '@/components/classes/BodyClassV2';
import LayoutV5 from '@/components/layouts/LayoutV5';

const Blog3ColumnPage = () => {
    return (
        <>
            <LayoutV5 breadCrumb="blog-2-column" title="Latest Blog">
                <Blog3ColumnContent />
                <BodyClassV2 />
            </LayoutV5>
        </>
    );
};

export default Blog3ColumnPage;