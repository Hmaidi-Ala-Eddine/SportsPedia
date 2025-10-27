const handleSmoothScroll = (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: 'smooth', top: 0 });
};

export default handleSmoothScroll;