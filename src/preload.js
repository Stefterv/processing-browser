// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "./index.css"


document.addEventListener('DOMContentLoaded', () => {
    // // list
    // // Preload logic can be added here.
    // document.body.style.backgroundColor = '#f0f000';
    // debugger
    // listen for element with id 'sketchConfig' to be added
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const sketchConfig = document.querySelector('#sketchConfig');
            // console.log('👋 This message is being logged by "preload.js", included via Vite', sketchConfig);
            var value = sketchConfig?.getAttribute('value');
            if (value) {
                try {
                    const config = JSON.parse(value);
                    sketchConfig.removeAttribute('value');
                    console.log('Parsed sketchConfig:', config);
                } catch (e) {
                    console.error('Error parsing sketchConfig:', e);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});