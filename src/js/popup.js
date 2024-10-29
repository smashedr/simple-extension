// JS for popup.html

import {
    checkPerms,
    grantPerms,
    injectFunction,
    linkClick,
    saveOptions,
    showToast,
    toggleSite,
    updateManifest,
    updateOptions,
} from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('inject-script').addEventListener('click', injectScript)
// noinspection JSCheckFunctionSignatures
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
// noinspection JSCheckFunctionSignatures
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', (e) => linkClick(e, true)))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
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
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
        updateOptions(items.options)
    })

    // if (chrome.runtime.lastError) {
    //     showToast(chrome.runtime.lastError.message, 'warning')
    // }

    // Check Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        return console.log('%cHost Permissions Not Granted', 'color: Red')
    }

    // Get Tab Info
    injectFunction(() => {
        return { ...window.location }
    })
        .then((siteInfo) => {
            console.debug('siteInfo:', siteInfo)
            if (!siteInfo) {
                document
                    .querySelectorAll('.tab-perms')
                    .forEach((el) => el.classList.add('d-none'))
                switchEl.classList.replace('border-secondary', 'border-danger')
                return console.log('%cNo Tab Permissions', 'color: Yellow')
            }

            // Update Site Data
            // noinspection JSUnresolvedReference
            hostnameEl.textContent = siteInfo.hostname
            // noinspection JSUnresolvedReference
            console.debug('siteInfo.hostname:', siteInfo.hostname)
            document.getElementById('toggle-site').disabled = false
            chrome.storage.sync.get(['sites']).then((items) => {
                console.debug('sites:', items.sites)
                // if (siteInfo.hostname in items.sites) {
                // noinspection JSUnresolvedReference
                if (items.sites.includes(siteInfo.hostname)) {
                    switchEl.classList.replace(
                        'border-secondary',
                        'border-success'
                    )
                    toggleSiteEl.checked = true
                }
            })
        })
        .catch((e) => {
            console.debug(e)
        })

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
 * Grant Permissions Button Click Callback
 * @function injectScript
 * @param {MouseEvent} event
 */
async function injectScript(event) {
    console.debug('injectScript:', event)
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    try {
        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['/js/inject.js'],
        })
        console.debug('Injection Result:', result)
        window.close()
    } catch (e) {
        showToast(e.toString(), 'danger')
        console.log(e)
    }
}

/**
 * Toggle Site Change Callback
 * @function toggleSiteChange
 * @param {InputEvent} event
 */
async function toggleSiteChange(event) {
    console.debug('toggleSiteChange:', event)
    const hostname = hostnameEl.textContent
    const enabled = await toggleSite(hostname)
    if (enabled) {
        switchEl.classList.replace('border-secondary', 'border-success')
    } else {
        switchEl.classList.replace('border-success', 'border-secondary')
    }
}
