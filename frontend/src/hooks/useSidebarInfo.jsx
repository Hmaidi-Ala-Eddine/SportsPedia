import { useState } from 'react';

const useSidebarInfo = () => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const openInfoBar = () => {
        setIsInfoOpen(true);
        document.body.classList.add('on-side');
    };

    const closeInfoBar = () => {
        setIsInfoOpen(false);
        document.body.classList.remove('on-side');
    };

    return { isInfoOpen, openInfoBar, closeInfoBar };
};

export default useSidebarInfo