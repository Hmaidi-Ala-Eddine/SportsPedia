import { cloneElement, useState, useEffect, useRef } from 'react';

const Animation = ({ delay = '0s', duration = '1s', className, children }) => {
    const [isInView, setIsInView] = useState(false);
    const childRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (childRef.current) {
            observer.observe(childRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const style = isInView ? {
        animationDelay: delay,
        animationDuration: duration,
        ...children.props.style,
    } : { ...children.props.style };

    const combinedClassName = [
        children.props.className,
        isInView ? className : ''
    ].filter(Boolean).join(' ');

    return cloneElement(children, {
        style,
        className: combinedClassName,
        ref: childRef
    });
};

export default Animation;
