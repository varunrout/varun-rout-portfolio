export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/*
 * Runs in <head> before first paint so the page never flashes the wrong theme. A saved choice wins;
 * otherwise the system preference decides. Storage can throw in private windows, hence the try.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;
