import LayoutV5 from '@/components/layouts/LayoutV5';
import PartnerV2 from '@/components/partner/PartnerV2';
import PriceV1 from '@/components/price/PriceV1';
import ProcessV2 from '@/components/process/ProcessV2';
import ServicesV1 from '@/components/services/ServicesV1';
import SpecialityV1 from '@/components/speciality/SpecialityV1';
import TeamV1 from '@/components/team/TeamV1';

const ServicesPage = () => {
    return (
        <>
            <LayoutV5>
                <ServicesV1 />
                <PartnerV2 />
                <SpecialityV1 sectionClass="default-padding bg-gray" />
                <TeamV1 />
                <ProcessV2 />
                <PriceV1 />
            </LayoutV5>
        </>
    );
};

export default ServicesPage;