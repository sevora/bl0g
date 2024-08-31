/**
 * 
 */
function setupNavigationBar() {
    let lastY = 0;

    const home = document.querySelector('#home') as HTMLElement;
    const posts = document.querySelectorAll('.post') as NodeListOf<HTMLElement>;

    /**
     * 
     */
    const navigation = document.querySelector('nav') as HTMLElement;
    const navigationAnchors = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
    const { hash } = window.location;

    /**
     * 
     */
    const sections = document.querySelectorAll('#home, #authors, #about') as NodeListOf<HTMLElement>;

    /**
     * 
     */
    function handleClickNavigation(element: HTMLElement | EventTarget) {
        navigationAnchors.forEach(anchor => 
            anchor.classList[anchor === element ? 'add' : 'remove']('active')
        );

        document.documentElement.removeAttribute('style');
        home.style.removeProperty('display');
        posts.forEach(post => post.style.setProperty('display', 'none'));
        
        history.pushState({}, null, '/');
    }

    /**
     * 
     */
    window.addEventListener('scroll', () => {
        navigation.classList[window.scrollY > 0 ? 'add' : 'remove']('shadow');
        
        sections.forEach((container, index) => {
            if (window.scrollY >= container.offsetTop - 10 && home.style.display != 'none')
                navigationAnchors.forEach(anchor => 
                    anchor.classList[anchor === navigationAnchors[index] ? 'add' : 'remove']('active')
                );
        });

        /**
         * 
         */
        navigation.classList[window.scrollY > 90 && Math.sign(window.scrollY - lastY) === 1 ? 'add' : 'remove']('minimize');
        lastY = window.scrollY;
    });

    /**
     * 
     */
    navigationAnchors.forEach(anchor => anchor.addEventListener('click', event => handleClickNavigation(event.currentTarget) ));
    navigationAnchors.forEach(anchor => (anchor.hash === hash || anchor.hash === '#home' && hash.length === 0) && anchor.classList.add('active'));
}

export default setupNavigationBar;
