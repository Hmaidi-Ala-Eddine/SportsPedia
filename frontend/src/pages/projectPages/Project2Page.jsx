import AboutV5 from '@/components/about/AboutV5';
import FactV1 from '@/components/fact/FactV1';
import GalleryV1 from '@/components/gallery/GalleryV1';
import LayoutV5 from '@/components/layouts/LayoutV5';

const Project2Page = () => {
    return (
        <>
            <LayoutV5>
                <GalleryV1 />
                <FactV1 />
                <AboutV5 sectionClass="bg-gray" />
            </LayoutV5>
        </>
    );
};

export default Project2Page;