
import AboutV4 from '@/components/about/AboutV4';
import BannerV5 from '@/components/banner/BannerV5';
import BlogV1 from '@/components/blog/BlogV1';
import LocationV1 from '@/components/location/LocationV1';
import ProcessV3 from '@/components/process/ProcessV3';
import ServicesV4 from '@/components/services/ServicesV4';
import TestimonialV4 from '@/components/testimonial/TestimonialV4';
import LayoutV4 from '@/components/layouts/LayoutV4';
import BodyClassV1 from '@/components/classes/BodyClassV1';
import QuoteV1 from '@/components/quote/QuoteV1';

const Home4 = () => {
    return (
        <>
            <LayoutV4>
                <BannerV5 />
                <AboutV4 />
                <ServicesV4 />
                <ProcessV3 />
                <LocationV1 />
                <QuoteV1 />
                <TestimonialV4 />
                <BlogV1 sectionClass="default-padding-bottom" />
                <BodyClassV1 />
            </LayoutV4>
        </>
    );
};

export default Home4;