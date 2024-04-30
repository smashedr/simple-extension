// JS for home.html

import { checkPerms, grantPerms } from './export.js'

chrome.permissions.onAdded.addListener(onAdded)

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('grant-perms').addEventListener('click', grantPerms)
document
    .querySelectorAll('.open-options')
    .forEach((el) => el.addEventListener('click', openOptions))
document
    .querySelectorAll('.open-page')
    .forEach((el) => el.addEventListener('click', openPage))

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

async function openPage(event) {
    console.debug('openPage:', event)
    event.preventDefault()
    await chrome.windows.create({
        type: 'detached_panel',
        url: '/html/page.html',
        width: 720,
        height: 480,
    })
}

/**
 * Permissions On Added Callback
 * @param permissions
 */
async function onAdded(permissions) {
    console.info('onAdded', permissions)
    await checkPerms()
}
