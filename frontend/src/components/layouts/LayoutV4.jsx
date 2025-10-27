import FooterV1 from '../footer/FooterV1';
import HeaderV4 from '../header/HeaderV4';

const LayoutV4 = ({ children }) => {
    return (
        <>
            <HeaderV4 />
            {children}
            <FooterV1 />
        </>
    );
};

export default LayoutV4;