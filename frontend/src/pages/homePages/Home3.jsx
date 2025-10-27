import AboutV5 from '@/components/about/AboutV5';
import BannerV6 from '@/components/banner/BannerV6';
import BlogV1 from '@/components/blog/BlogV1';
import BrandV2 from '@/components/brand/BrandV2';
import LayoutV3 from '@/components/layouts/LayoutV3';
import ParallaxV1 from '@/components/parallax/ParallaxV1';
import PartnerV2 from '@/components/partner/PartnerV2';
import PortfolioV3 from '@/components/portfolio/PortfolioV3';
import ServicesV5 from '@/components/services/ServicesV5';
import TeamV3 from '@/components/team/TeamV3';
import TestimonialV3 from '@/components/testimonial/TestimonialV3';

const Home3 = () => {
    return (
        <>
            <LayoutV3>
                <BannerV6 />
                <ParallaxV1 />
                <AboutV5 />
                <ServicesV5 sectionClass="bg-gray" />
                <PartnerV2 />
                <PortfolioV3 />
                <BrandV2 />
                <TestimonialV3 />
                <TeamV3 />
                <BlogV1 sectionClass="bg-gray default-padding" />
            </LayoutV3>
        </>
    );
};

export default Home3;