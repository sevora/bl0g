import attachChromaKey from './chroma';

const space = document.querySelector('#space') as HTMLElement;

/**
 * These are the transitions used for the effects.
 */
const transitions: { [key: string]: () => void } = {
    'darkness': function() {
        document.documentElement.style.setProperty('--background-color', '#000');
        document.documentElement.style.setProperty('--foreground-color', '#f9f0f0');
        document.documentElement.style.setProperty('--badge-color', '#5e5e5e');
        document.documentElement.style.setProperty('--hover-color', '#4e4e4e');
    },
    'stars': function() {
        document.documentElement.style.setProperty('--background-color', '#000');
        document.documentElement.style.setProperty('--foreground-color', '#f9f0f0');
        document.documentElement.style.setProperty('--badge-color', '#5e5e5e');
        document.documentElement.style.setProperty('--hover-color', '#4e4e4e');
        space.style.removeProperty('display');
    }
}

/**
 * We also detect all transition timeouts.
 */
let transitionTimeouts: number[] = [];

/**
 * We disable on FirefoxMobile as canvas is not 
 * reliable there.
 */
const isFirefoxMobile = /Android.+Firefox\//.test(navigator.userAgent);

/**
 * This is the event handler for page setup.
 * Specifically handles our extra canvas effects.
 */
export function onSetupPage(page: HTMLElement) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const duration = page.dataset.transitionDelay;
    const transition = transitions[page.dataset.transitionFunction!];

    if (video && canvas) {
        attachChromaKey(video, canvas, [0, 255, 0], 0.75);

        /**
         * When the video plays we want to set a timeout to call
         * their transition by the set duration, otherwise we use video end.
         */
        video.addEventListener('play', function() {
            if (!duration) return;
             
            const id = setTimeout(function () {
                if (transition && window.location.hash.replace("#", "") == page.dataset.route)
                    transition();
                }, parseFloat(duration)
            );

            transitionTimeouts.push(id);
        });

        /**
         * On video end if theres no duration we call
         * the transition and end the video.
         */
        video.addEventListener('ended', function () {
            canvas.classList.remove('enter');
            canvas.classList.add('exit');

            if (transition && !duration && window.location.pathname == page.dataset.route)
                transition();
        });
    }
}

/**
 * On navigation we clear the timeouts and reset the transitions.
 */
export function onNavigateRoute(page: HTMLElement, firstLoad?: boolean) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const transition = transitions[page.dataset.transitionFunction!];

    document.documentElement.removeAttribute('style');
    
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];

    /**
     * Hard-coded cancellation of effects.
     */
    if (window.location.pathname != '/go/jo') {
        space.style.setProperty('display', 'none');
    }

    /**
     * We make the canvas appear too.
     */
    if (canvas) {
        canvas.classList.remove('exit');
        canvas.classList.add('enter');
    }

    /**
     * We display the video if any from the 
     * beginning.
     */
    if (video) {
        page.style.removeProperty('display');
        video.currentTime = 0;

        /**
         * Firefox Mobile disabled cause of problems.
         */
        if (!isFirefoxMobile) {
            if (firstLoad && transition)
                transition();
            else
                video.play();
        }
    }

}