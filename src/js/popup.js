// JS for popup.html

import {
    checkPerms,
    grantPerms,
    injectFunction,
    linkClick,
    openSidePanel,
    saveOptions,
    showToast,
    updateManifest,
    updateOptions,
} from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('inject-script').addEventListener('click', injectScript)
document.getElementById('side-panel').addEventListener('click', openSidePanel)
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

const hostnameEl = document.getElementById('hostname')

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    void updateManifest()
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
        updateOptions(items.options)
    })

    if (chrome.runtime.lastError) {
        showToast(chrome.runtime.lastError.message, 'warning')
    }

    // Check Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        return console.log('%cHost Permissions Not Granted', 'color: Red')
    }

    // Check Tab Permissions
    const siteInfo = await getSiteInfo()
    if (!siteInfo) {
        document
            .querySelectorAll('.has-perms')
            .forEach((el) => el.classList.add('d-none'))
        return console.log('%cNo Tab Permissions', 'color: Yellow')
    }

    // Update Site Data
    hostnameEl.classList.replace('border-danger', 'border-success')
    hostnameEl.textContent = siteInfo.hostname

    // const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    // console.debug('tab:', tab)

    // const tabs = await chrome.tabs.query({ highlighted: true })
    // console.log('tabs:', tabs)

    // const views = chrome.extension.getViews()
    // console.log('views:', views)

    // const platform = await chrome.runtime.getPlatformInfo()
    // console.debug('platform:', platform)
}

async function getSiteInfo() {
    async function getInfo() {
        return {
            hostname: window.location.hostname,
        }
    }
    try {
        const results = await injectFunction(getInfo)
        console.debug('results:', results)
        const result = results[0]?.result
        console.debug('result:', result)
        return result
    } catch (e) {
        console.debug(`%cInjection error: ${e.message}`, 'color: OrangeRed')
    }
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
        console.info(e)
    }
}
