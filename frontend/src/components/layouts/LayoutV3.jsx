import HeaderV3 from '../header/HeaderV3';
import FooterV1 from '../footer/FooterV1';
import BreadCrumb from '../breadCrumb/BreadCrumb';

const LayoutV3 = ({ children, breadCrumb, title }) => {
    return (
        <>
            <HeaderV3 />
            {breadCrumb && <BreadCrumb breadCrumb={breadCrumb} title={title} />}
            {children}
            <FooterV1 />
        </>
    );
};

export default LayoutV3;