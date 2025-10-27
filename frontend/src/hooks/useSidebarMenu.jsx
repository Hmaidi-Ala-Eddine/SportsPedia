import { useState } from 'react';

const useSidebarMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openMenu = () => {
        setIsOpen(true);
        document.body.classList.add('no-fade');
    };

    const closeMenu = () => {
        setIsOpen(false);
        document.body.classList.remove('no-fade');
    };

    return { isOpen, openMenu, closeMenu };
};

export default useSidebarMenu