// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('processing', {
    sketch: (code) => ipcRenderer.invoke('sketch', code),
})



document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const sketchConfig = document.querySelector('#sketchConfig');
            var value = sketchConfig?.getAttribute('value');
            if (value) {
                try {
                    const config = JSON.parse(value);
                    sketchConfig.removeAttribute('value');
                    if (!config.codeObjects.every(obj => obj.type === 'java')) {
                        continue
                    }
                    console.log('Parsed sketchConfig:', config);
                    const sketchContainer = document.querySelector('iframe[name^="sketchIframe"]');
                    if (sketchContainer) {
                        if (sketchContainer.src) {
                            ipcRenderer.invoke('sketch', config)
                        }
                        sketchContainer.src = ""
                    }
                } catch (e) {
                    console.error('Error parsing sketchConfig:', e);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});