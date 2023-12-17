// JS for popup.html

import { checkPerms, saveOptions, updateOptions } from './export.js'

document.addEventListener('DOMContentLoaded', initPopup)

document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', popupLinks))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))

document.getElementById('grant-perms').addEventListener('click', grantPerms)
// document.getElementById('revoke-perms').addEventListener('click', revokePerms)
document.getElementById('inject-script').addEventListener('click', injectScript)

document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.log('initPopup')
    document.getElementById('version').textContent =
        chrome.runtime.getManifest().version
    document.getElementById('homepage_url').href =
        chrome.runtime.getManifest().homepage_url

    await checkPerms()

    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
    updateOptions(options)

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
    console.log('popupLinks:', event)
    event.preventDefault()
    const anchor = event.target.closest('a')
    console.log(`anchor.href: ${anchor.href}`)
    let url
    if (anchor.href.endsWith('html/options.html')) {
        chrome.runtime.openOptionsPage()
        return window.close()
    } else if (anchor.href.endsWith('html/page.html')) {
        await chrome.windows.create({
            type: 'detached_panel',
            url: '/html/page.html',
            width: 720,
            height: 480,
        })
        return window.close()
    } else if (anchor.href.startsWith('http')) {
        url = anchor.href
    } else {
        url = chrome.runtime.getURL(anchor.href)
    }
    console.log('url:', url)
    await chrome.tabs.create({ active: true, url })
    return window.close()
}

/**
 * Grant Permissions Button Click Callback
 * @function grantPerms
 * @param {Event} event
 */
function grantPerms(event) {
    console.log('grantPerms:', event)
    chrome.permissions.request({
        origins: ['https://*/*', 'http://*/*'],
    })
    window.close()
}

// /**
//  * Revoke Permissions Button Click Callback
//  * TODO: Determine how to remove host permissions on chrome
//  * @function revokePerms
//  * @param {Event} event
//  */
// async function revokePerms(event) {
//     console.log('revokePerms:', event)
//     const permissions = await chrome.permissions.getAll()
//     console.log('permissions:', permissions)
//     await chrome.permissions.remove({
//         origins: permissions.origins,
//     })
//     window.close()
// }

/**
 * Grant Permissions Button Click Callback
 * @function injectScript
 * @param {MouseEvent} event
 */
async function injectScript(event) {
    console.log('injectScript:', event)
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: alertFunction,
    })
    window.close()
}

function alertFunction() {
    alert('Inject Script Success')
}
