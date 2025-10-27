import { useEffect } from 'react';

const BodyClassV1 = () => {

    useEffect(() => {
        document.body.classList.add('color-style-two');

        return () => {
            document.body.classList.remove('color-style-two');
        };
    }, []);

    return (
        <>

        </>
    );
};

export default BodyClassV1;