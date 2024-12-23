// JS for options.html

import {
    checkPerms,
    toggleSite,
    grantPerms,
    linkClick,
    onAdded,
    onRemoved,
    revokePerms,
    saveOptions,
    showToast,
    updateManifest,
    updateBrowser,
    updateOptions,
    updatePlatform,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', initOptions)
document.getElementById('copy-support').addEventListener('click', copySupport)
document.getElementById('sites-input').addEventListener('change', sitesChange)
document.getElementById('add-host').addEventListener('submit', addHost)
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
    .querySelectorAll('.options input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .querySelectorAll('form.options')
    .forEach((el) => el.addEventListener('submit', (e) => e.preventDefault()))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))
document
    .querySelectorAll('.import-export')
    .forEach((el) => el.addEventListener('click', importExportClick))
document
    .querySelectorAll('.form-control')
    .forEach((el) =>
        el.addEventListener('input', () => el.classList.remove('is-invalid'))
    )
document
    .querySelectorAll('.modal')
    .forEach((el) =>
        el.addEventListener('shown.bs.modal', () =>
            el.querySelector('input,textarea').focus()
        )
    )

document.getElementById('chrome-shortcuts').addEventListener('click', () => {
    // noinspection JSIgnoredPromiseFromCall
    chrome.tabs.update({ url: 'chrome://extensions/shortcuts' })
})

/**
 * Initialize Options
 * @function initOptions
 */
async function initOptions() {
    console.debug('initOptions')
    // noinspection ES6MissingAwait
    updateManifest()
    // noinspection ES6MissingAwait
    updateBrowser()
    // noinspection ES6MissingAwait
    updatePlatform()
    // noinspection ES6MissingAwait
    checkPerms()
    // noinspection ES6MissingAwait
    setShortcuts()
    chrome.storage.sync.get(['options', 'sites']).then((items) => {
        // console.debug('options, sites:', items.options, items.sites)
        updateOptions(items.options)
        updateTable(items.sites)
    })
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
        if (namespace === 'sync' && key === 'options') {
            updateOptions(newValue)
        }
        if (namespace === 'sync' && key === 'sites') {
            updateTable(newValue)
        }
    }
}

/**
 * Set Keyboard Shortcuts
 * @function setShortcuts
 * @param {String} [selector]
 */
async function setShortcuts(selector = '#keyboard-shortcuts') {
    if (!chrome.commands) {
        return console.debug('Skipping: chrome.commands')
    }
    const table = document.querySelector(selector)
    table.classList.remove('d-none')
    const tbody = table.querySelector('tbody')
    const source = table.querySelector('tfoot > tr').cloneNode(true)
    const commands = await chrome.commands.getAll()
    for (const command of commands) {
        // console.debug('command:', command)
        const row = source.cloneNode(true)
        let description = command.description
        // Note: Chrome does not parse the description for _execute_action in manifest.json
        if (!description && command.name === '_execute_action') {
            description = 'Open Popup' // NOTE: Also defined in: manifest.json
        }
        row.querySelector('.description').textContent = description
        row.querySelector('kbd').textContent = command.shortcut || 'Not Set'
        tbody.appendChild(row)
    }
}

/**
 * Copy Support Click Callback
 * @function copySupport
 * @param {MouseEvent} event
 */
async function copySupport(event) {
    console.debug('copySupport:', event)
    event.preventDefault()
    const manifest = chrome.runtime.getManifest()
    const permissions = await chrome.permissions.getAll()
    const { options } = await chrome.storage.sync.get(['options'])
    const result = [
        `${manifest.name} - ${manifest.version}`,
        navigator.userAgent,
        `permissions.origins: ${JSON.stringify(permissions.origins)}`,
        `options: ${JSON.stringify(options)}`,
    ]
    const commands = await chrome.commands?.getAll()
    if (commands) {
        result.push(`commands: ${JSON.stringify(commands)}`)
    }
    await navigator.clipboard.writeText(result.join('\n'))
    showToast('Support Information Copied.')
}

/**
 * Update Popup Table with Data
 * @function updateTable
 * @param {String[]} data
 */
function updateTable(data) {
    console.debug('updateTable:', data)
    const tbody = document.querySelector('#hosts-table > tbody')
    tbody.innerHTML = ''

    const faCopy = document.querySelector('#clone > .fa-copy')
    const faTrashCan = document.querySelector('#clone > .fa-trash-can')

    // for (const [site, value] of Object.entries(data)) {
    for (const site of data) {
        // console.debug(`site: ${site}:`, value)
        console.debug('site:', site)
        const row = tbody.insertRow()

        const deleteBtn = document.createElement('a')
        deleteBtn.appendChild(faTrashCan.cloneNode(true))
        deleteBtn.title = 'Delete'
        deleteBtn.dataset.site = site
        deleteBtn.classList.add('link-danger')
        deleteBtn.setAttribute('role', 'button')
        deleteBtn.addEventListener('click', deleteHost)
        const cell1 = row.insertCell()
        cell1.classList.add('text-center')
        cell1.appendChild(deleteBtn)

        const hostLink = document.createElement('a')
        hostLink.textContent = site
        hostLink.title = site
        hostLink.href = `https://${site}`
        hostLink.target = '_blank'
        hostLink.setAttribute('role', 'button')
        const cell2 = row.insertCell()
        cell2.classList.add('text-break')
        cell2.appendChild(hostLink)

        const copyLink = document.createElement('a')
        copyLink.appendChild(faCopy.cloneNode(true))
        copyLink.title = 'Copy'
        copyLink.dataset.clipboardText = site
        copyLink.classList.add('link-info')
        copyLink.setAttribute('role', 'button')
        const cell3 = row.insertCell()
        cell3.classList.add('text-center')
        cell3.appendChild(copyLink)
    }
}

/**
 * Delete Host Click Callback
 * @function deleteHost
 * @param {MouseEvent} event
 */
async function deleteHost(event) {
    console.debug('deleteHost:', event)
    event.preventDefault()
    const site = event.currentTarget?.dataset?.site
    console.info(`Delete Host: ${site}`)
    await toggleSite(site)
    showToast('Deleted Host', 'info')
}

/**
 * Import/Export Click Callbacks
 * @function importExportClick
 * @param {MouseEvent} event
 */
async function importExportClick(event) {
    console.debug('importExportClick:', event)
    const target = event.currentTarget
    event.preventDefault()
    const action = target.dataset.action
    console.debug('action:', action)
    if (action === 'export') {
        event.preventDefault()
        const { sites } = await chrome.storage.sync.get(['sites'])
        console.debug('sites:', sites)
        if (sites.length === 0) {
            return showToast('No Hosts to Export', 'warning')
        }
        const json = JSON.stringify(sites, null, 2)
        textFileDownload('simple-extension-sites.txt', json)
    } else if (action === 'file') {
        document.getElementById('sites-input').click()
    } else if (action === 'text') {
        const el = document.getElementById(target.dataset.id)
        console.debug('el:', el)
        if (!el.value) {
            el.focus()
        } else {
            try {
                const data = JSON.parse(el.value)
                console.debug('data:', data)
                const count = await importSites(data)
                const type = count ? 'success' : 'warning'
                showToast(`Imported ${count}/${data.length} Hosts.`, type)
                $('#import-modal').modal('hide')
                el.value = ''
            } catch (e) {
                console.debug('Import Error:', e)
                el.nextElementSibling.textContent = `Import Error: ${e.message}`
                el.classList.add('is-invalid')
                el.focus()
                // showToast(`Import Error: ${e.message}`, 'danger')
            }
        }
    } else if (action === 'clear') {
        const el = document.getElementById(target.dataset.id)
        console.debug('el:', el)
        el.value = ''
        el.classList.remove('is-invalid')
        el.focus()
    }
}

/**
 * Sites Input Change Callback
 * @function sitesChange
 * @param {InputEvent} event
 */
async function sitesChange(event) {
    console.debug('sitesChange:', event)
    event.preventDefault()
    try {
        const file = event.target.files.item(0)
        const text = await file.text()
        const data = JSON.parse(text)
        console.debug('data:', data)
        const count = await importSites(data)
        const type = count ? 'success' : 'warning'
        showToast(`Imported ${count}/${data.length} Hosts.`, type)
    } catch (e) {
        console.log('Import error:', e)
        showToast(`Import Error: ${e.message}`, 'danger')
    }
}

/**
 * Import Sites Handler
 * @function sitesChange
 * @param {String[]} data
 * @return {Promise<Number>}
 */
async function importSites(data) {
    console.debug('importSites:', data)
    const { sites } = await chrome.storage.sync.get(['sites'])
    let count = 0
    for (const site of data) {
        if (!sites.includes(site)) {
            sites.push(site)
            count++
        }
    }
    if (count) {
        sites.sort()
        await chrome.storage.sync.set({ sites })
    }
    return count
}

/**
 * Text File Download Handler
 * @function textFileDownload
 * @param {String} filename
 * @param {String} text
 */
function textFileDownload(filename, text) {
    console.debug(`textFileDownload: ${filename}`)
    const element = document.createElement('a')
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)
    element.classList.add('d-none')
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

/**
 * Add Host Submit Callback
 * @function addHost
 * @param {SubmitEvent} event
 */
async function addHost(event) {
    console.debug('addHost:', event)
    event.preventDefault()
    const input = event.target.elements.site
    let value = input.value?.trim()
    if (!value) {
        input.focus()
        input.select()
        console.debug('Missing input.value:', input)
        return
    }
    if (!value.includes('://')) {
        value = `https://${value}`
    }
    console.debug('value:', value)
    let url
    try {
        url = new URL(value)
    } catch (e) {
        input.focus()
        input.select()
        showToast(e.message, 'danger')
        console.error(e)
        return
    }
    console.log('url:', url)
    const { sites } = await chrome.storage.sync.get(['sites'])
    if (sites.includes(url.hostname)) {
        input.focus()
        input.select()
        showToast(`Host Exists: ${url.hostname}`, 'warning')
        console.log(`%c Existing Host: ${url.hostname}`, 'color: Yellow', url)
    } else {
        sites.push(url.hostname)
        sites.sort()
        await chrome.storage.sync.set({ sites })
        input.value = ''
        input.focus()
        showToast(`Added Host: ${url.hostname}`)
        console.log(`%c Added Host: ${url.hostname}`, 'color: Lime', url)
    }
}
