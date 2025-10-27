import AboutV2 from '@/components/about/AboutV2';
import LayoutV5 from '@/components/layouts/LayoutV5';
import PartnerV1 from '@/components/partner/PartnerV1';
import ProcessV2 from '@/components/process/ProcessV2';
import TeamV4 from '@/components/team/TeamV4';
import TestimonialV1 from '@/components/testimonial/TestimonialV1';
import WhyChooseV2 from '@/components/whyChoose/WhyChooseV2';

const AboutUs2Page = () => {
    return (
        <>
            <LayoutV5>
                <AboutV2 />
                <PartnerV1 />
                <WhyChooseV2 />
                <TeamV4 />
                <ProcessV2 />
                <TestimonialV1 sectionClass="default-padding" />
            </LayoutV5>
        </>
    );
};

export default AboutUs2Page;