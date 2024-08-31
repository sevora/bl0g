
import setupSinglePage from './single-page';
import { onSetupPage, onNavigateRoute } from './setup';

/**
 * 
 */
const { navigateRoute } = setupSinglePage(onSetupPage, onNavigateRoute);

/**
 * 
 */
const navigation = document.querySelector('nav') as HTMLElement;
const navigationAnchors = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
const sections = document.querySelectorAll('#posts, #authors, #about') as NodeListOf<HTMLElement>;
const { hash } = window.location;

let lastY = 0;

/**
 * 
 */
function handleClickCard(event: MouseEvent) {
    event.stopPropagation();
    const card = event.currentTarget as HTMLElement;
    navigateRoute(card.dataset.displayPage);
}

document.querySelectorAll('.card').forEach(card => card.addEventListener('click', handleClickCard));


/**
 *  
 */
function handleClickNavigation(element: HTMLElement | EventTarget) {
    navigationAnchors.forEach(anchor =>
        anchor.classList[anchor === element ? 'add' : 'remove']('active')
    );

    navigateRoute('/');
}


/**
 * 
 */
function detectActiveNavigationAnchor() {
    sections.forEach((container, index) => {
        if (window.scrollY >= container.offsetTop - 10 && window.location.pathname === '/')
            navigationAnchors.forEach(anchor =>
                anchor.classList[anchor === navigationAnchors[index] ? 'add' : 'remove']('active')
            );
    });
}

/**
 * 
 */
window.addEventListener('scroll', () => {
    navigation.classList[window.scrollY > 0 ? 'add' : 'remove']('shadow');
    detectActiveNavigationAnchor();

    /**
     * 
     */
    navigation.classList[window.scrollY > 90 && Math.sign(window.scrollY - lastY) === 1 ? 'add' : 'remove']('minimize');
    lastY = window.scrollY;
});

navigationAnchors.forEach(anchor => anchor.addEventListener('click', event => handleClickNavigation(event.currentTarget)));
navigationAnchors.forEach(anchor => (anchor.hash === hash || anchor.hash === '#home' && hash.length === 0) && anchor.classList.add('active'));
detectActiveNavigationAnchor();