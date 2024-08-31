export default function setupSinglePage(onSetupPage?: (page: HTMLElement) => void, onNavigateRoute?: (page: HTMLElement, firstLoad?: boolean) => void) {
    /**
     * These are the DOM elements necessary for 
     * this to work. Technically this could be rewritten
     */
    const pages = scanForPages();

    /**
     * 
     * @returns 
     */
    function scanForPages() {
        let result: { [id: string]: HTMLElement } = {};
        document.querySelectorAll('.page').forEach(post =>
            result[(post as HTMLElement).dataset.route] = post as HTMLElement
        );
        return result;
    }


    /**
     * 
     */
    function navigateRoute(route: string, firstLoad?: boolean) {
        const page = pages[route];
        if (!page) return;

     
        /**
         * 
         */
        Object.entries(pages).forEach(([otherRoute, otherPage]) => {
            if (otherRoute === route) return;
            otherPage.style.setProperty('display', 'none');
        });

        page.style.removeProperty('display');

        if (onNavigateRoute)
            onNavigateRoute(page, firstLoad);

        /**
         * 
         */
        history.pushState({}, null, `${route}`);
    }

    /**
     * 
     */
    function onLoadCorrectPageFromRoute() {
        const { pathname } = window.location;
        const page = pages[pathname];
        if (page) 
            navigateRoute(pathname, true);
    }

    onLoadCorrectPageFromRoute();
    if (onSetupPage) 
        Object.values(pages).forEach(onSetupPage);

    return { navigateRoute };
}