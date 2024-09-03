
import setupSinglePage from './single-page';
import { onSetupPage, onNavigateRoute } from './setup';
import attachChromaKey from './chroma';

/**
 * 
 */
const navigation = document.querySelector('nav') as HTMLElement;
const navigationAnchors = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
const sections = document.querySelectorAll('#posts, #writers, #about') as NodeListOf<HTMLElement>;
const { hash } = window.location;

let lastY = 0;

/**
 * 
 */
const { navigateRoute } = setupSinglePage(onSetupPage, (page, firstLoad) => { 
    onNavigateRoute(page, firstLoad);
    detectActiveNavigationAnchor();
});

/**
 * 
 */
function handleClickCard(event: MouseEvent) {
    event.stopPropagation();
    const card = event.currentTarget as HTMLElement;
    navigateRoute(card.dataset.displayPage);
    
    /**
     * 
     */
    navigationAnchors.forEach(anchor =>
        anchor.classList.remove('active')
    );
}

document.querySelectorAll('.card').forEach(card => card.addEventListener('click', handleClickCard));

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

navigationAnchors.forEach(anchor => anchor.addEventListener('click', _event => navigateRoute('/')));
navigationAnchors.forEach(anchor => (anchor.hash === hash || anchor.hash === '#home' && hash.length === 0) && anchor.classList.add('active'));
detectActiveNavigationAnchor();

const specialButton = document.querySelector('#special-button');
const specialCanvas = document.querySelector('#special-canvas') as HTMLCanvasElement;
const specialVideo = document.querySelector('#special-video') as HTMLVideoElement;

attachChromaKey(specialVideo, specialCanvas, [0, 255, 0], 0.7);
specialButton.addEventListener('click', () => specialVideo.play());

specialVideo.addEventListener('play', () => {
    specialCanvas.style.removeProperty('display');
});

specialVideo.addEventListener('ended', () => {
    specialCanvas.style.display = 'none';
})