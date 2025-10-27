import AboutV2 from '@/components/about/AboutV2';
import BannerV3 from '@/components/banner/BannerV3';
import BlogV1 from '@/components/blog/BlogV1';
import GalleryV2 from '@/components/gallery/GalleryV2';
import LayoutV2 from '@/components/layouts/LayoutV2';
import PriceV1 from '@/components/price/PriceV1';
import ProcessV2 from '@/components/process/ProcessV2';
import ServicesV2 from '@/components/services/ServicesV2';
import WhyChooseV3 from '@/components/whyChoose/WhyChooseV3';

const Home5 = () => {
    return (
        <>
            <LayoutV2>
                <BannerV3 />
                <ServicesV2 />
                <AboutV2 />
                <ProcessV2 />
                <WhyChooseV3 />
                <GalleryV2 />
                <PriceV1 />
                <BlogV1 sectionClass="default-padding" />
            </LayoutV2>
        </>
    );
};

export default Home5;