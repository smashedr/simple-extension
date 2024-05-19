// JS for popup.html

import {
    checkPerms,
    grantPerms,
    linkClick,
    saveOptions,
    showToast,
    updateManifest,
    updateOptions,
} from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('inject-script').addEventListener('click', injectScript)
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', (e) => linkClick(e, true)))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    updateManifest()

    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
    updateOptions(options)

    if (chrome.runtime.lastError) {
        showToast(chrome.runtime.lastError.message, 'warning')
    }

    // Check Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        return console.debug('Host Permissions Not Granted')
    }

    // Check Tab Permissions
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    console.debug('tab:', tab)
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            injectImmediately: true,
            func: function () {
                return true
            },
        })
    } catch (e) {
        document
            .querySelectorAll('.has-perms')
            .forEach((el) => el.classList.add('d-none'))
        document
            .querySelectorAll('.tab-perms')
            .forEach((el) => el.classList.remove('d-none'))
        return console.log('No Tab Permissions', e, tab)
    }

    // const platformInfo = await chrome.runtime.getPlatformInfo()
    // console.log('platformInfo:', platformInfo)

    // const tabs = await chrome.tabs.query({ highlighted: true })
    // console.log('tabs:', tabs)

    // const views = chrome.extension.getViews()
    // console.log('views:', views)
}

/**
 * Grant Permissions Button Click Callback
 * @function injectScript
 * @param {MouseEvent} event
 */
async function injectScript(event) {
    console.debug('injectScript:', event)
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['/js/inject.js'],
        })
        window.close()
    } catch (e) {
        showToast(e.toString(), 'danger')
        console.info(e)
    }
}
