import ContactUsV1 from '@/components/contact/ContactUsV1';
import LayoutV5 from '@/components/layouts/LayoutV5';
import MapV1 from '@/components/map/MapV1';

const ContactUsPage = () => {
    return (
        <>
            <LayoutV5>
                <ContactUsV1 />
                <MapV1 />
            </LayoutV5>
        </>
    );
};

export default ContactUsPage;