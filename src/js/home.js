// JS for home.html

import {
    checkPerms,
    grantPerms,
    linkClick,
    onAdded,
    onRemoved,
    revokePerms,
} from './export.js'

chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.revoke-permissions')
    .forEach((el) => el.addEventListener('click', revokePerms))
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', grantPerms))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

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
