import AboutV1 from '@/components/about/AboutV1';
import BannerV1 from '@/components/banner/BannerV1';
import BlogV1 from '@/components/blog/BlogV1';
import FactV1 from '@/components/fact/FactV1';
import FeatureV1 from '@/components/feature/FeatureV1';
import LayoutV1 from '@/components/layouts/LayoutV1';
import ProjectV1 from '@/components/projects/ProjectV1';
import ServicesV1 from '@/components/services/ServicesV1';
import TeamV1 from '@/components/team/TeamV1';
import TestimonialV1 from '@/components/testimonial/TestimonialV1';
import WhyChooseV1 from '@/components/whyChoose/WhyChooseV1';

const Home1 = () => {
    return (
        <>
            <LayoutV1>
                <BannerV1 />
                <FeatureV1 />
                <AboutV1 />
                <ServicesV1 />
                <WhyChooseV1 />
                <ProjectV1 />
                <TeamV1 />
                <FactV1 />
                <TestimonialV1 />
                <BlogV1 sectionClass="default-padding" />
            </LayoutV1>
        </>
    );
};

export default Home1;