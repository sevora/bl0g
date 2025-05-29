/**
 * A single page application script converter written by Ralph 
 * Louis Gopez, this turns a single html page to multiple pages
 * by the power of scripting and history API. It also provides
 * some degree of control to customize the page.
 */
export default function setupSinglePage(onSetupPage?: (page: HTMLElement) => void, onNavigateRoute?: (page: HTMLElement, firstLoad?: boolean) => void) {
    /**
     * These are the DOM elements necessary for 
     * this to work. Technically this could be rewritten
     */
    const pages = scanForPages();
    
    /**
     * This scans for the pages in the HTML. A page is 
     * expected to have the class page.
     */
    function scanForPages() {
        let result: { [id: string]: HTMLElement } = {};
        document.querySelectorAll('.page').forEach(post =>
            result[(post as HTMLElement).dataset.route!.toLowerCase()] = post as HTMLElement
        );
        return result;
    }


    /**
     * This is used to navigate to a page through its set 
     * route via `data-route` attribute.
     */
    function navigateRoute(route: string, firstLoad?: boolean) {
        const page = pages[route.toLowerCase()];
        if (!page) return;
        
        history.pushState({ scrollY: window.scrollY }, "", `${route}`);

        /**
         * Hide all the other pages and make the current page appear.
         */
        Object.entries(pages).forEach(([otherRoute, otherPage]) => {
            if (otherRoute === route) return;
            otherPage.style.setProperty('display', 'none');
        });

        page.style.removeProperty('display');

        if (onNavigateRoute)
            onNavigateRoute(page, firstLoad);

        window.scroll(0, 0);
    }

    /**
     * Improve this by scrolling to previous y-level if there is any. 
     */
    function loadCorrectPageFromRoute(event?: PopStateEvent) {
        const { pathname } = window.location;
        const page = pages[pathname];

        if (page)
            navigateRoute(pathname, true);

        if (event?.state && event?.state.scrollY)
            window.scrollTo(0, event.state.scrollY);
    }

    window.addEventListener('popstate', loadCorrectPageFromRoute);

    if (onSetupPage) 
        Object.values(pages).forEach(onSetupPage);

    loadCorrectPageFromRoute();
    return { navigateRoute };
}