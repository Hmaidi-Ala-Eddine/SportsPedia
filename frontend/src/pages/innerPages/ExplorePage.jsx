import ExploreContent from '@/components/explore/ExploreContent';
import BodyClassV2 from '@/components/classes/BodyClassV2';
import LayoutV5 from '@/components/layouts/LayoutV5';

const ExplorePage = () => {
    return (
        <>
            <LayoutV5 breadCrumb="explore" title="Explore Sports Data">
                <ExploreContent />
                <BodyClassV2 />
            </LayoutV5>
        </>
    );
};

export default ExplorePage;
