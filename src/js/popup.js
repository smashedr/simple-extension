// JS for popup.html

import {
    checkPerms,
    grantPerms,
    injectFunction,
    injectScript,
    linkClick,
    saveOptions,
    showToast,
    toggleSite,
    updateManifest,
    updateOptions,
    updatePlatform,
} from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('inject-script').addEventListener('click', injectClick)
// noinspection JSCheckFunctionSignatures
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
// noinspection JSCheckFunctionSignatures
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', (e) => linkClick(e, true)))
document
    .querySelectorAll('.options input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .querySelectorAll('form.options')
    .forEach((el) => el.addEventListener('submit', (e) => e.preventDefault()))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

const hostnameEl = document.getElementById('hostname')
const switchEl = document.getElementById('switch')
const toggleSiteEl = document.getElementById('toggle-site')
toggleSiteEl.addEventListener('change', toggleSiteChange)

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    // noinspection ES6MissingAwait
    updateManifest()
    // noinspection ES6MissingAwait
    updatePlatform()

    // Update Options
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
        updateOptions(items.options)
    })

    // Check Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        return console.log('%cHost Permissions Not Granted', 'color: Red')
    }

    // Get Tab Info
    // Note: contentScript is defined in the content-script.js and fails if not loaded
    const siteInfo = await injectFunction(() => {
        return { contentScript, ...window.location }
    })
    console.debug('siteInfo:', siteInfo)

    // Check if Current Tab is Accessible
    if (!siteInfo) {
        document
            .querySelectorAll('.tab-perms')
            .forEach((el) => el.classList.add('d-none'))
        switchEl.classList.replace('border-secondary', 'border-danger')
        return console.log('%cNo Tab Permissions', 'color: Orange')
    }

    // Update Site Data
    try {
        // noinspection JSUnresolvedReference
        hostnameEl.textContent = siteInfo.hostname
        // noinspection JSUnresolvedReference
        console.debug('%c hostname:', 'color: Lime', siteInfo.hostname)
        document.getElementById('toggle-site').disabled = false
        const { sites } = await chrome.storage.sync.get(['sites'])
        // noinspection JSUnresolvedReference
        if (sites.includes(siteInfo.hostname)) {
            switchEl.classList.replace('border-secondary', 'border-success')
            toggleSiteEl.checked = true
        }
    } catch (e) {
        console.warn(e)
        showToast(e.message, 'danger')
    }

    // const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    // console.debug('tab:', tab)

    // const tabs = await chrome.tabs.query({ highlighted: true })
    // console.log('tabs:', tabs)

    // const views = chrome.extension.getViews()
    // console.log('views:', views)

    // const platform = await chrome.runtime.getPlatformInfo()
    // console.debug('platform:', platform)
}

/**
 * Inject Button Click Callback
 * @function injectClick
 * @param {MouseEvent} event
 */
async function injectClick(event) {
    console.debug('injectClick:', event)
    await injectScript('/js/inject.js')
    window.close()
}

/**
 * Toggle Site Change Callback
 * @function toggleSiteChange
 * @param {InputEvent} event
 */
async function toggleSiteChange(event) {
    console.debug('toggleSiteChange:', event)
    const enabled = await toggleSite(hostnameEl.textContent)
    if (enabled) {
        switchEl.classList.replace('border-secondary', 'border-success')
    } else {
        switchEl.classList.replace('border-success', 'border-secondary')
    }
}
