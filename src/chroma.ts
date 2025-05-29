type ChromaKey = [number, number, number];

/**
 * I wrote this function in order to do chroma-keying on any video through a canvas.
 * @param video the video element to be chroma-keyed.
 * @param canvas where the element will be rendered, this will get adjusted to the set width and height attributes of the video.
 * @param key the color value in rgb to use as a key for chroma-keying.
 * @param threshold ranging from 0-1 adjusting sensitivity of chroma-keying.
 */
function attachChromaKey(video: HTMLVideoElement, canvas: HTMLCanvasElement, key: ChromaKey, threshold: number) {
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    const [keyR, keyG, keyB] = key;

    /**
     * This is the maximum distance the pixels can 
     * have (and is relative to the key)
     */
    const maximum = Math.sqrt(Math.pow(keyR, 2) + Math.pow(keyG, 2) + Math.pow(keyB, 2));
    let isRendering = false;

    /**
     * This is the setup which prepares the canvas to look like 
     * the video source.
     */
    function setup() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.style.width = `${video.width}px`;
        canvas.style.height = 'auto';

        video.addEventListener('play', startRender);
        video.addEventListener('pause', endRender);
        video.addEventListener('ended', endRender);
    }
    
    /**
     * Start the canvas rendering when the video is played.
     */
    function startRender() {
        isRendering = true;
        render();
    }
    
    /**
     * This renders a single frame with the keyed out frames processed
     * every time.
     */
    function render() {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        let frame = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
    
        for (let i = 0; i < frame.data.length; i += 4) {
            const r = frame.data[i];
            const g = frame.data[i+1];
            const b = frame.data[i+2];

            const distance = Math.sqrt(Math.pow(r-keyR, 2) + Math.pow(g-keyG, 2) + Math.pow(b-keyB, 2))

            // formula optimized through multiplication
            if (distance <= threshold * maximum) 
                frame.data[i+3] = 0;
        }
    
        context.putImageData(frame, 0, 0);
    
        if (isRendering) 
            window.requestAnimationFrame(render);
    }
    
    /**
     * End the render by setting isRendering to false
     * which would make it so that the next render call won't happen.
     */
    function endRender() {
        isRendering = false;
    }

    video.addEventListener('loadeddata', setup);
    video.load();
}

export default attachChromaKey;