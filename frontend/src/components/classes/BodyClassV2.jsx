import { useEffect } from 'react';

const BodyClassV2 = () => {

    useEffect(() => {
        document.body.classList.add('wrapper');

        return () => {
            document.body.classList.remove('wrapper');
        };
    }, []);

    return (
        <>

        </>
    );
};

export default BodyClassV2;