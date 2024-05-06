// JS for home.html

import {
    checkPerms,
    onAdded,
    onRemoved,
    requestPerms,
    revokePerms,
} from './export.js'

chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('grant-perms').addEventListener('click', grantPerms)
document.getElementById('revoke-perms').addEventListener('click', revokePerms)
document
    .querySelectorAll('.open-options')
    .forEach((el) => el.addEventListener('click', openOptions))
document
    .querySelectorAll('.open-panel')
    .forEach((el) => el.addEventListener('click', openPanel))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
    await checkPerms()
}

async function openOptions(event) {
    console.debug('openOptions:', event)
    event.preventDefault()
    chrome.runtime.openOptionsPage()
}

async function openPanel(event) {
    console.debug('openPanel:', event)
    event.preventDefault()
    await chrome.windows.create({
        type: 'panel',
        url: '/html/panel.html',
        width: 720,
        height: 480,
    })
}

/**
 * Grant Permissions Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 */
export async function grantPerms(event) {
    console.debug('grantPerms:', event)
    await requestPerms()
}
