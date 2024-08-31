import attachChromaKey from './chroma';
import setupNavigationBar from './navigation-bar';

setupNavigationBar();

/**
 * These are the DOM elements necessary for 
 * this to work. Technically this could be rewritten
 */
const home = document.querySelector('#home') as HTMLElement;
const cards = document.querySelectorAll('[data-load-post-id]') as NodeListOf<HTMLElement>;
const posts = scanForPosts();

const effects: { [key: string]: (post: HTMLElement) => void } = {
    /**
     * 
     */
    'darkness': function darkness(post) {
        if (post.style.display !== 'none') {
            document.documentElement.style.setProperty('--background-color', '#000'); 
            document.documentElement.style.setProperty('--foreground-color', '#f9f0f0'); 
            document.documentElement.style.setProperty('--badge-color', '#5e5e5e'); 
            document.documentElement.style.setProperty('--hover-color', '#4e4e4e'); 
        }
         
    }
}

/**
 * 
 * @returns 
 */
function scanForPosts() {
    let result: { [id: string]: HTMLElement } = {};
    document.querySelectorAll('.post').forEach(post => result[post.id] = post as HTMLElement);
    return result;
}

/**
 * 
 */
function setupCard(card: HTMLElement) {
    const post = posts[card.dataset.loadPostId];
    const video = post.querySelector('video');
    const canvas = post.querySelector('canvas');
    const effect = effects[post.dataset.effectFunction];
        
    if (video && canvas) {
        attachChromaKey(video, canvas, [0, 255, 0], 0.75);

        video.addEventListener('ended', function () {
            canvas.style.setProperty('opacity', '0');
            
            if (effect)
                effect(post);

            video.currentTime = 0;
        });
    }
        
    
    card.addEventListener('click', handleClickCard);
}

/**
 * 
 */
function handleClickCard(event: MouseEvent) {
    event.stopPropagation();
    const card = event.currentTarget as HTMLElement;
    displayPostAsPage(card.dataset.loadPostId);
}

/**
 * 
 */
function displayPostAsPage(id: string) {
    const post = posts[id];
    const video = post.querySelector('video');
    const canvas = post.querySelector('canvas');
    
    /**
     * 
     */
    home.style.setProperty('display', 'none');
    Object.entries(posts).forEach(([otherId, otherPost]) => {
        if (otherId === id) return;
        otherPost.style.setProperty('display', 'none');
    });

    post.style.removeProperty('display');
    
    /**
     * 
     * 
     */
    if (canvas)
        canvas.style.setProperty('opacity', '1');

    if (video) {
        video.currentTime = 0;
        video.play();
    }

    /**
     * 
     */
    history.pushState({}, null, `?read=${id}`);
}

/**
 * 
 */
function ensureCorrectPage() {
    const { search } = window.location;
    console.log(search.startsWith('?read='))
    if (search.startsWith('?read=')) {
        const [_, id] = search.split('=');

        const post = posts[id];
        const effect = effects[post.dataset.effectFunction];
        displayPostAsPage(id);

        if (effect)
            effect(post);
    }
}

ensureCorrectPage();
cards.forEach(setupCard);