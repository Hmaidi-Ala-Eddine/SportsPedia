import FooterV1 from '../footer/FooterV1';
import HeaderV5 from '../header/HeaderV5';
import BreadCrumb from '../breadCrumb/BreadCrumb';

const LayoutV5 = ({ children, breadCrumb, title }) => {
    return (
        <>
            <HeaderV5 />
            {breadCrumb && <BreadCrumb breadCrumb={breadCrumb} title={title} />}
            {children}
            <FooterV1 />
        </>
    );
};

export default LayoutV5;