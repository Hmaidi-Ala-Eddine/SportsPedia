import AboutV3 from '@/components/about/AboutV3';
import BannerV2 from '@/components/banner/BannerV2';
import BlogV2 from '@/components/blog/BlogV2';
import FeatureV2 from '@/components/feature/FeatureV2';
import GalleryV1 from '@/components/gallery/GalleryV1';
import LayoutV2 from '@/components/layouts/LayoutV2';
import PartnerV1 from '@/components/partner/PartnerV1';
import ServicesV3 from '@/components/services/ServicesV3';
import SpecialityV1 from '@/components/speciality/SpecialityV1';
import TeamV2 from '@/components/team/TeamV2';
import TestimonialV2 from '@/components/testimonial/TestimonialV2';
import WhyChooseV2 from '@/components/whyChoose/WhyChooseV2';

const Home2 = () => {
    return (
        <>
            <div className="wrapper">
                <LayoutV2>
                    <BannerV2 />
                    <AboutV3 />
                    <FeatureV2 />
                    <PartnerV1 />
                    <WhyChooseV2 />
                    <ServicesV3 />
                    <SpecialityV1 />
                    <GalleryV1 sectionClass="bg-gray" />
                    <TeamV2 />
                    <TestimonialV2 sectionClass="text-light bg-dark" />
                    <BlogV2 />
                </LayoutV2>
            </div>
        </>
    );
};

export default Home2;