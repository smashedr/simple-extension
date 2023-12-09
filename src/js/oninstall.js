// JS for install.html

import { checkPerms } from './export.js'

document.addEventListener('DOMContentLoaded', initOnInstall)
document.getElementById('grant-perms').addEventListener('click', grantPermsBtn)
document.getElementById('open-options').addEventListener('click', openOptions)

/**
 * Initialize initOnInstall
 * @function initOnInstall
 */
async function initOnInstall() {
    console.log('initOnInstall')
    // const { options } = await chrome.storage.sync.get(['options'])
    // console.log('options:', options)
    await checkPerms()
}

/**
 * Grant Permissions Button Click Callback
 * @function grantPermsBtn
 * @param {MouseEvent} event
 */
async function grantPermsBtn(event) {
    console.log('grantPermsBtn:', event)
    await chrome.permissions.request({
        origins: ['https://*/*', 'http://*/*'],
    })
    const hasPerms = await checkPerms()
    if (hasPerms) {
        chrome.runtime.openOptionsPage()
        window.close()
    }
}

/**
 * Open Options Click Callback
 * @function openOptions
 * @param {MouseEvent} event
 */
function openOptions(event) {
    chrome.runtime.openOptionsPage()
    window.close()
}
