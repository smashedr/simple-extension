// JS for options.html

import {
    checkPerms,
    linkClick,
    onAdded,
    onRemoved,
    requestPerms,
    revokePerms,
    saveOptions,
    updateManifest,
    updateOptions,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', initOptions)
document.getElementById('grant-perms').addEventListener('click', grantPerms)
document.getElementById('revoke-perms').addEventListener('click', revokePerms)

document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .getElementById('options-form')
    .addEventListener('submit', (e) => e.preventDefault())
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

/**
 * Initialize Options
 * @function initOptions
 */
async function initOptions() {
    console.debug('initOptions')
    updateManifest()

    await setShortcuts({
        mainKey: '_execute_action',
        openHome: 'openHome',
        showPanel: 'showPanel',
    })
    // await setShortcuts('#keyboard-shortcuts')

    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
    updateOptions(options)

    await checkPerms()
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
function onChanged(changes, namespace) {
    console.debug('onChanged:', changes, namespace)
    for (const [key, { newValue }] of Object.entries(changes)) {
        if (namespace === 'sync') {
            if (key === 'options') {
                updateOptions(newValue)
            }
        }
    }
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

/**
 * Set Keyboard Shortcuts
 * @function setShortcuts
 * @param {Object} mapping { elementID: name }
 */
async function setShortcuts(mapping) {
    const commands = await chrome.commands.getAll()
    for (const [elementID, name] of Object.entries(mapping)) {
        // console.debug(`${elementID}: ${name}`)
        const command = commands.find((x) => x.name === name)
        if (command?.shortcut) {
            console.debug(`${elementID}: ${command.shortcut}`)
            const el = document.getElementById(elementID)
            if (el) {
                el.textContent = command.shortcut
            }
        }
    }
}

// /**
//  * Set Keyboard Shortcuts
//  * @function setShortcuts
//  * @param {String} selector
//  */
// async function setShortcuts(selector) {
//     const table = document.querySelector(selector)
//     console.debug('table:', table)
//     const commands = await chrome.commands.getAll()
//     const source = table.querySelector('tfoot > tr')
//     for (const command of commands) {
//         console.debug('command:', command)
//         const row = source.cloneNode(true)
//         row.querySelector('.description').textContent = command.description
//         row.querySelector('kbd').textContent = command.shortcut
//         table.appendChild(row)
//     }
// }
