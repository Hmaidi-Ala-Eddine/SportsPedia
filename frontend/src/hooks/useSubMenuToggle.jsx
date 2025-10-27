const useSubMenuToggle = () => {

    const toggleSubMenu = (e) => {
        e.preventDefault();
        const listItem = e.target.parentElement;
        const subMenu = listItem.querySelector('ul.dropdown-menu');

        if (subMenu) {
            listItem.classList.toggle('on');
            subMenu.style.maxHeight = subMenu.style.maxHeight === '20000px' ? '0' : '20000px';
        }
    };

    return toggleSubMenu;
};

export default useSubMenuToggle;