// JS for sidepanel.html

import { linkClick, updateManifest } from './export.js'

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.close-panel')
    .forEach((el) => el.addEventListener('click', closePanel))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    // noinspection ES6MissingAwait
    updateManifest()
    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
}

/**
 * Close Side Panel
 * @function closePanel
 * @param {Event} [event]
 */
async function closePanel(event) {
    console.debug('closePanel:', event)
    event?.preventDefault()
    // noinspection JSUnresolvedReference
    if (typeof browser !== 'undefined') {
        // noinspection JSUnresolvedReference
        await browser.sidebarAction.close()
    } else {
        window.close()
    }
}
