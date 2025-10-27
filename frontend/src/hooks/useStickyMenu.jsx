import { useState, useEffect } from 'react';

function useStickyMenu(offset = 5) {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > offset);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [offset]);

    return isSticky;
}

export default useStickyMenu