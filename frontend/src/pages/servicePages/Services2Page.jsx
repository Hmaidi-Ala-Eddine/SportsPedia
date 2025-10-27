import LayoutV5 from '@/components/layouts/LayoutV5';
import PartnerV2 from '@/components/partner/PartnerV2';
import PriceV1 from '@/components/price/PriceV1';
import ServicesV3 from '@/components/services/ServicesV3';
import SpecialityV1 from '@/components/speciality/SpecialityV1';
import TeamV2 from '@/components/team/TeamV2';
import TestimonialV1 from '@/components/testimonial/TestimonialV1';

const Services2Page = () => {
    return (
        <>
            <LayoutV5>
                <ServicesV3 />
                <SpecialityV1 />
                <PartnerV2 />
                <TeamV2 />
                <PriceV1 />
                <TestimonialV1 sectionClass="default-padding" />
            </LayoutV5>
        </>
    );
};

export default Services2Page;