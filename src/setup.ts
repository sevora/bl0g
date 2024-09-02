import attachChromaKey from './chroma';

const space = document.querySelector('#space') as HTMLElement;

/**
 * 
 */
const transitions: { [key: string]: () => void } = {
    /**
     * 
     */
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
 * 
 */
let transitionTimeouts: NodeJS.Timeout[] = [];

/**
 * 
 */
const isFirefoxMobile = /Android.+Firefox\//.test(navigator.userAgent);

/**
 * 
 */
export function onSetupPage(page: HTMLElement) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const duration = page.dataset.transitionDelay;
    const transition = transitions[page.dataset.transitionFunction];

    if (video && canvas) {
        attachChromaKey(video, canvas, [0, 255, 0], 0.75);

        /**
         * 
         */
        video.addEventListener('play', function() {
            if (!duration) return;
                    
            /**
             * 
             */
            const id = setTimeout(function () {
                if (transition && window.location.pathname == page.dataset.route)
                    transition();
                }, parseFloat(duration)
            );

            transitionTimeouts.push(id);
        });

        /**
         * 
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
 * 
 * 
 */
export function onNavigateRoute(page: HTMLElement, firstLoad?: boolean) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const transition = transitions[page.dataset.transitionFunction];

    document.documentElement.removeAttribute('style');
    
    /**
     * 
     */
    transitionTimeouts.forEach(clearTimeout);

    /**
     * Hard-coded cancellation of effects.
     */
    if (window.location.pathname != '/go/jo') {
        space.style.setProperty('display', 'none');
    }

    /**
     * 
     * 
     */
    if (canvas) {
        canvas.classList.remove('exit');
        canvas.classList.add('enter');
    }

    /**
     * 
     */
    if (video) {
        page.style.removeProperty('display');
        video.currentTime = 0;

        /**
         * 
         */
        if (!isFirefoxMobile) {
            if (firstLoad && transition)
                transition();
            else
                video.play();
        }
    }

}