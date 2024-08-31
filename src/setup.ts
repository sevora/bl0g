import attachChromaKey from './chroma';

/**
 * 
 */
const transitions: { [key: string]: () => void } = {
    /**
     * 
     */
    'darkness': function darkness() {
        document.documentElement.style.setProperty('--background-color', '#000');
        document.documentElement.style.setProperty('--foreground-color', '#f9f0f0');
        document.documentElement.style.setProperty('--badge-color', '#5e5e5e');
        document.documentElement.style.setProperty('--hover-color', '#4e4e4e');
    }
}

/**
 * 
 */
export function onSetupPage(page: HTMLElement) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const transition = transitions[page.dataset.transitionFunction];

    if (video && canvas) {
        attachChromaKey(video, canvas, [0, 255, 0], 0.75);

        video.addEventListener('ended', function () {
            canvas.classList.remove('enter');
            canvas.classList.add('exit');

            if (transition)
                transition();

            video.currentTime = 0;
        });
    }
}

/**
 * 
 * @param page 
 */
export function onNavigateRoute(page: HTMLElement) {
    const video = page.querySelector('video[data-chroma-key]') as HTMLVideoElement;
    const canvas = page.querySelector('canvas[data-chroma-key]') as HTMLCanvasElement;
    const transition = transitions[page.dataset.transitionFunction];

    /**
     * 
     * 
     */
    if (canvas) {
        canvas.classList.remove('exit');
        canvas.classList.add('enter');
    }
 
    if (video) {
        video.currentTime = 0;
        video.play()
            .catch(() => transition && transition());   
    }
    
}