import HeaderV1 from '../header/HeaderV1';
import FooterV1 from '../footer/FooterV1';

const LayoutV1 = ({ children }) => {
    return (
        <>
            <HeaderV1 />
            {children}
            <FooterV1 />
        </>
    );
};

export default LayoutV1;