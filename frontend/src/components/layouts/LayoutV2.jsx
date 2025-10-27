import HeaderV2 from '../header/HeaderV2';
import FooterV2 from '../footer/FooterV2';

const LayoutV2 = ({ children }) => {
    return (
        <>
            <HeaderV2 />
            {children}
            <FooterV2 />
        </>
    );
};

export default LayoutV2;