// JS for sidepanel.html

import { linkClick, openPopup, updateManifest } from './export.js'

chrome.tabs.onActivated.addListener(onActivated)
document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('.open-popup')
    .forEach((el) => el.addEventListener('click', openPopup))
document
    .querySelectorAll('.close-panel')
    .forEach((el) => el.addEventListener('click', closePanel))

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
 * Close Side Panel Click Callback
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

/**
 * Tab Change Callback
 * @function onActivated
 * @param {chrome.tabs.TabActiveInfo} activeInfo
 */
async function onActivated(activeInfo) {
    console.debug('onActivated:', activeInfo)
    const window = await chrome.windows.getCurrent()
    // console.debug('window:', window)
    if (window.id !== activeInfo.windowId) {
        return console.debug('Tab Change in Different Window!')
    }
    console.debug('%c Tab Change - Update Tab Specific Data.', 'color: Lime')
    const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true,
    })
    console.debug('tab:', tab)
    console.debug('tab.url:', tab.url)
}
