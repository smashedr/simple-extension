// JS for popup.html

import {
    checkPerms,
    requestPerms,
    saveOptions,
    showToast,
    updateOptions,
} from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('grant-perms').addEventListener('click', grantPerms)
// document.getElementById('revoke-perms').addEventListener('click', revokePerms)
document.getElementById('inject-script').addEventListener('click', injectScript)
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', popupLinks))
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
    const manifest = chrome.runtime.getManifest()
    document.querySelector('.version').textContent = manifest.version
    document.querySelector('[href="homepage_url"]').href = manifest.homepage_url

    await checkPerms()

    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
    updateOptions(options)

    if (chrome.runtime.lastError) {
        showToast(chrome.runtime.lastError.message, 'warning')
    }

    // const platformInfo = await chrome.runtime.getPlatformInfo()
    // console.log('platformInfo:', platformInfo)

    // const tabs = await chrome.tabs.query({ highlighted: true })
    // console.log('tabs:', tabs)

    // const views = chrome.extension.getViews()
    // console.log('views:', views)
    // const result = views.find((item) => item.location.href.endsWith('html/home.html'))
    // console.log('result:', result)
}

/**
 * Popup Links Click Callback
 * Firefox requires a call to window.close()
 * @function popupLinks
 * @param {MouseEvent} event
 */
async function popupLinks(event) {
    console.debug('popupLinks:', event)
    event.preventDefault()
    const anchor = event.target.closest('a')
    const href = anchor.getAttribute('href').replace(/^\.+/g, '')
    console.debug('href:', href)
    let url
    if (href.endsWith('html/options.html')) {
        chrome.runtime.openOptionsPage()
        return window.close()
    } else if (href.endsWith('html/panel.html')) {
        await chrome.windows.create({
            type: 'panel',
            url: '/html/panel.html',
            width: 720,
            height: 480,
        })
        return window.close()
    } else if (href.startsWith('http')) {
        url = href
    } else {
        url = chrome.runtime.getURL(href)
    }
    console.debug('url:', url)
    await chrome.tabs.create({ active: true, url })
    return window.close()
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

/**
 * Grant Permissions Click Callback
 * Promise from requestPerms is ignored so we can close the popup immediately
 * @function grantPerms
 * @param {MouseEvent} event
 */
export async function grantPerms(event) {
    console.debug('grantPerms:', event)
    requestPerms()
    window.close()
}
