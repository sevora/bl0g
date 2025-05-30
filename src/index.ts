
import setupSinglePage from './single-page';
import attachChromaKey from './chroma';
import { onSetupPage, onNavigateRoute } from './setup';

/**
 * These are the important DOM elements for the entire application.
 * We use them in the main script because they're central.
 */
const navigation = document.querySelector('nav') as HTMLElement;
const navigationAnchors = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
const sections = document.querySelectorAll('#posts, #writers, #about') as NodeListOf<HTMLElement>;

const { hash } = window.location;

/**
 * The lastY is the last value on the scrolling,
 * we use this to be able to find the direction of scroll.
 */
let lastScrollY = 0;

/**
 * This function converts the entire HTML to a single-page application.
 * We can set the callbacks of certain things by its callback parameters.
 */
const { navigateRoute } = setupSinglePage(onSetupPage, (page, firstLoad) => { 
    onNavigateRoute(page, firstLoad);
    detectActiveNavigationAnchor();
});

/**
 * This is the event handler for a card click, it n
 */
function handleClickCard(event: MouseEvent) {
    event.stopPropagation();
    const card = event.currentTarget as HTMLElement;
    navigateRoute(card.dataset.displayPage!);
    
    /**
     * This ensures that no navigation anchor appears to be clicked as that
     * is faulty in terms of visual design. The navigate route has related side-effects
     * which is `detectActiveNavigationAnchor()`.
     */
    navigationAnchors.forEach(anchor =>
        anchor.classList.remove('active')
    );
}

document.querySelectorAll('.card').forEach(card => (card as HTMLElement).addEventListener('click', handleClickCard));

/**
 * This detects the active navigation anchor through the scroll and activates
 * that anchor by changing its class.
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
 * This is what happens when we scroll. (1) upon scrolling up or down the shadow 
 * is removed or added. (2) when the scroll direction is down and to a sufficient level,
 * the navigation is minimized. (3) the last scroll value is updated.
 */
window.addEventListener('scroll', () => {
    navigation.classList[window.scrollY > 0 ? 'add' : 'remove']('shadow');
    navigation.classList[window.scrollY > 90 && Math.sign(window.scrollY - lastScrollY) === 1 ? 'add' : 'remove']('minimize');
    detectActiveNavigationAnchor();
    lastScrollY = window.scrollY;
});

navigationAnchors.forEach(anchor => anchor.addEventListener('click', _event => navigateRoute('/')));
navigationAnchors.forEach(anchor => (anchor.hash === hash || anchor.hash === '#home' && hash.length === 0) && anchor.classList.add('active'));
detectActiveNavigationAnchor();

/**
 * This is a special button, for all intents and purposes, this may be unnecessary.
 * But hey we want to have some fun.
 */
const specialButton = document.querySelector('#special-button') as HTMLButtonElement;
const specialCanvas = document.querySelector('#special-canvas') as HTMLCanvasElement;
const specialVideo = document.querySelector('#special-video') as HTMLVideoElement;

attachChromaKey(specialVideo, specialCanvas, [0, 255, 0], 0.7);
specialButton.addEventListener('click', () => specialVideo.play());

specialVideo.addEventListener('play', () => {
    specialCanvas.style.removeProperty('display');
});

specialVideo.addEventListener('ended', () => {
    specialCanvas.style.display = 'none';
});

/**
 * Need to manually define a popstate event listener
 * to handle the back button from an existing post.
 */
window.addEventListener("popstate", () => {
    let { hash } = window.location;
    hash = hash.replace("#", "");

    if (["posts", "writers", "about"].includes(hash) || hash.length === 0)
        navigateRoute("/", false);
    
    console.log(hash);
})