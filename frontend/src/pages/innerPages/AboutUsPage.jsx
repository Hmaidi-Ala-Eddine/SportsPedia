import AboutV1 from '@/components/about/AboutV1';
import AwardV1 from '@/components/award/AwardV1';
import FactV1 from '@/components/fact/FactV1';
import LayoutV5 from '@/components/layouts/LayoutV5';
import TeamV2 from '@/components/team/TeamV2';
import TestimonialV2 from '@/components/testimonial/TestimonialV2';
import WhyChooseV1 from '@/components/whyChoose/WhyChooseV1';

const AboutUsPage = () => {
    return (
        <>
            <LayoutV5>
                <AboutV1 sectionClass="shape-less default-padding" />
                <WhyChooseV1 />
                <TeamV2 sectionClass="bg-gray" />
                <FactV1 sectionClass="bg-gray" />
                <AwardV1 />
                <TestimonialV2 sectionClass="shape-3" />
            </LayoutV5>
        </>
    );
};

export default AboutUsPage;