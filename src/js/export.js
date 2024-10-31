// JS Exports

export const githubURL = 'https://github.com/smashedr/simple-extension'

/**
 * Save Options Callback
 * @function saveOptions
 * @param {UIEvent} event
 */
export async function saveOptions(event) {
    console.debug('saveOptions:', event)
    const { options } = await chrome.storage.sync.get(['options'])
    let key = event.target.id
    let value
    if (event.target.type === 'radio') {
        key = event.target.name
        const radios = document.getElementsByName(key)
        for (const input of radios) {
            if (input.checked) {
                value = input.id
                break
            }
        }
    } else if (event.target.type === 'checkbox') {
        value = event.target.checked
    } else if (event.target.type === 'number') {
        const number = parseFloat(event.target.value)
        let min = parseFloat(event.target.min)
        let max = parseFloat(event.target.max)
        if (!isNaN(number) && number >= min && number <= max) {
            event.target.value = number.toString()
            value = number
        } else {
            event.target.value = options[event.target.id]
            return
        }
    } else {
        value = event.target.value
    }
    if (value !== undefined) {
        options[key] = value
        console.log(`Set %c${key}:`, 'color: Khaki', value)
        await chrome.storage.sync.set({ options })
    } else {
        console.warn(`No Value for key: ${key}`)
    }
}

/**
 * Update Options
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    console.debug('updateOptions:', options)
    for (let [key, value] of Object.entries(options)) {
        if (typeof value === 'undefined') {
            console.warn('Value undefined for key:', key)
            continue
        }
        // Option Key should be `radioXXX` and values should be the option IDs
        if (key.startsWith('radio')) {
            key = value //NOSONAR
            value = true //NOSONAR
        }
        // console.debug(`${key}: ${value}`)
        const el = document.getElementById(key)
        if (!el) {
            continue
        }
        if (el.tagName !== 'INPUT') {
            el.textContent = value.toString()
        } else if (typeof value === 'boolean') {
            el.checked = value
        } else {
            el.value = value
        }
        if (el.dataset.related) {
            hideShowElement(`#${el.dataset.related}`, value)
        }
    }
}

/**
 * Hide or Show Element with JQuery
 * @function hideShowElement
 * @param {String} selector
 * @param {Boolean} [show]
 * @param {String} [speed]
 */
function hideShowElement(selector, show, speed = 'fast') {
    const element = $(`${selector}`)
    // console.debug('hideShowElement:', show, element)
    if (show) {
        element.show(speed)
    } else {
        element.hide(speed)
    }
}

/**
 * Link Click Callback
 * Note: Firefox popup requires a call to window.close()
 * @function linkClick
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function linkClick(event, close = false) {
    console.debug('linkClick:', close, event)
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href').replace(/^\.+/g, '')
    console.debug('href:', href)
    let url
    if (href.startsWith('#')) {
        console.debug('return on anchor link')
        return
    } else if (href.endsWith('html/options.html')) {
        await chrome.runtime.openOptionsPage()
        if (close) window.close()
        return
    } else if (href.endsWith('html/panel.html')) {
        await openExtPanel()
        if (close) window.close()
        return
    } else if (href.endsWith('html/sidepanel.html')) {
        await openSidePanel()
        if (close) window.close()
        return
    } else if (href.startsWith('http')) {
        url = href
    } else {
        url = chrome.runtime.getURL(href)
    }
    console.debug('url:', url)
    await activateOrOpen(url)
    if (close) window.close()
}

/**
 * Activate or Open Tab from URL
 * @function activateOrOpen
 * @param {String} url
 * @param {Boolean} [open]
 * @return {Promise<chrome.tabs.Tab>}
 */
export async function activateOrOpen(url, open = true) {
    console.debug('activateOrOpen:', url, open)
    // Note: To Get Tab from Tabs (requires host permissions or tabs)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    console.debug('tabs:', tabs)
    for (const tab of tabs) {
        if (tab.url === url) {
            console.debug('found tab in tabs:', tab)
            return await chrome.tabs.update(tab.id, { active: true })
        }
    }
    if (open) {
        console.debug('tab not found, opening url:', url)
        return await chrome.tabs.create({ active: true, url })
    }
    console.warn('tab not found and open not set!')
}

/**
 * Update DOM with Manifest Details
 * @function updateManifest
 * @function updateManifest
 */
export async function updateManifest() {
    const manifest = chrome.runtime.getManifest()
    console.debug('updateManifest:', manifest)
    document.querySelectorAll('.version').forEach((el) => {
        el.textContent = manifest.version
    })
    document.querySelectorAll('[href="homepage_url"]').forEach((el) => {
        el.href = manifest.homepage_url
    })
    document.querySelectorAll('[href="version_url"]').forEach((el) => {
        el.href = `${githubURL}/releases/tag/${manifest.version}`
    })
}

/**
 * @function updateBrowser
 * @return {Promise<void>}
 */
export async function updateBrowser() {
    let selector = '.chrome'
    // noinspection JSUnresolvedReference
    if (typeof browser !== 'undefined') {
        selector = '.firefox'
    }
    console.debug('updateBrowser:', selector)
    document
        .querySelectorAll(selector)
        .forEach((el) => el.classList.remove('d-none'))
}

/**
 * @function updatePlatform
 * @return {Promise<void>}
 */
export async function updatePlatform() {
    const platform = await chrome.runtime.getPlatformInfo()
    console.debug('updatePlatform:', platform)
    const splitCls = (cls) => cls.split(' ').filter(Boolean)
    if (platform.os === 'android') {
        // document.querySelectorAll('[class*="mobile-"]').forEach((el) => {
        document
            .querySelectorAll(
                '[data-mobile-add],[data-mobile-remove],[data-mobile-replace]'
            )
            .forEach((el) => {
                if (el.dataset.mobileAdd) {
                    for (const cls of splitCls(el.dataset.mobileAdd)) {
                        // console.debug('mobileAdd:', cls)
                        el.classList.add(cls)
                    }
                }
                if (el.dataset.mobileRemove) {
                    for (const cls of splitCls(el.dataset.mobileRemove)) {
                        // console.debug('mobileAdd:', cls)
                        el.classList.remove(cls)
                    }
                }
                if (el.dataset.mobileReplace) {
                    const split = splitCls(el.dataset.mobileReplace)
                    // console.debug('mobileReplace:', split)
                    for (let i = 0; i < split.length; i += 2) {
                        const one = split[i]
                        const two = split[i + 1]
                        // console.debug(`replace: ${one} >> ${two}`)
                        el.classList.replace(one, two)
                    }
                }
            })
    }
}

/**
 * Check Host Permissions
 * @function checkPerms
 * @return {Promise<Boolean>}
 */
export async function checkPerms() {
    const hasPerms = await chrome.permissions.contains({
        origins: ['*://*/*'],
    })
    console.debug('checkPerms:', hasPerms)
    // Firefox still uses DOM Based Background Scripts
    if (typeof document === 'undefined') {
        return hasPerms
    }
    const hasPermsEl = document.querySelectorAll('.has-perms')
    const grantPermsEl = document.querySelectorAll('.grant-perms')
    if (hasPerms) {
        hasPermsEl.forEach((el) => el.classList.remove('d-none'))
        grantPermsEl.forEach((el) => el.classList.add('d-none'))
    } else {
        grantPermsEl.forEach((el) => el.classList.remove('d-none'))
        hasPermsEl.forEach((el) => el.classList.add('d-none'))
    }
    return hasPerms
}

/**
 * Grant Permissions Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function grantPerms(event, close = false) {
    console.debug('grantPerms:', event)
    // noinspection ES6MissingAwait
    requestPerms()
    if (close) {
        window.close()
    }
}

/**
 * Request Host Permissions
 * @function requestPerms
 * @return {Promise<Boolean>}
 */
export async function requestPerms() {
    return await chrome.permissions.request({
        origins: ['*://*/*'],
    })
}

/**
 * Revoke Permissions Click Callback
 * Note: This method does not work on Chrome if permissions are required.
 * @function revokePerms
 * @param {MouseEvent} event
 */
export async function revokePerms(event) {
    console.debug('revokePerms:', event)
    const permissions = await chrome.permissions.getAll()
    console.debug('permissions:', permissions)
    try {
        await chrome.permissions.remove({
            origins: permissions.origins,
        })
        await checkPerms()
    } catch (e) {
        console.log(e)
        showToast(e.toString(), 'danger')
    }
}

/**
 * Permissions On Added Callback
 * @param {chrome.permissions} permissions
 */
export async function onAdded(permissions) {
    console.debug('onAdded', permissions)
    await checkPerms()
}

/**
 * Permissions On Removed Callback
 * @param {chrome.permissions} permissions
 */
export async function onRemoved(permissions) {
    console.debug('onRemoved', permissions)
    await checkPerms()
}

/**
 * Open Extension Panel
 * @function openExtPanel
 * @param {String} [url]
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {String} [type]
 * @return {Promise<chrome.windows.Window|undefined>}
 */
export async function openExtPanel(
    url = '/html/panel.html',
    width = 720,
    height = 480,
    type = 'panel'
) {
    console.debug(`openExtPanel: ${url}`, width, height)
    if (!chrome.windows) {
        console.log('Browser does not support: chrome.windows')
        return
    }
    const { lastPanelID } = await chrome.storage.local.get(['lastPanelID'])
    console.debug('lastPanelID:', lastPanelID)

    try {
        const window = await chrome.windows.get(lastPanelID)
        if (window) {
            console.debug(`%c Window found: ${window.id}`, 'color: Lime')
            return await chrome.windows.update(lastPanelID, {
                focused: true,
            })
        }
    } catch (e) {
        console.log(e)
    }

    const window = await chrome.windows.create({ type, url, width, height })
    console.debug(`%c Created new window: ${window.id}`, 'color: Yellow')
    // noinspection ES6MissingAwait
    chrome.storage.local.set({ lastPanelID: window.id })
    return window
}

/**
 * Open Side Panel Callback
 * @function openSidePanel
 * @param {Event} [event]
 */
export async function openSidePanel(event) {
    console.debug('openSidePanel:', event)
    if (chrome.sidePanel) {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.sidePanel.open({ windowId: tab.windowId })
        })
    } else if (chrome.sidebarAction) {
        // noinspection JSUnresolvedReference
        await chrome.sidebarAction.open()
    } else {
        console.log('Side Panel Not Supported')
        if (event) {
            showToast('Side Panel Not Supported', 'danger')
            return
        }
    }
    if (event) {
        window.close()
    }
    // if (typeof window !== 'undefined') {
    //     window.close()
    // }
}

/**
 * Open Popup Click Callback
 * @function openPopup
 * @param {Event} [event]
 */
export async function openPopup(event) {
    console.debug('openPopup:', event)
    event?.preventDefault()
    // Note: This fails if popup is already open (ex. double clicks)
    try {
        await chrome.action.openPopup()
    } catch (e) {
        console.debug(e)
    }
}

/**
 * Show Bootstrap Toast
 * @function showToast
 * @param {String} message
 * @param {String} type
 */
export function showToast(message, type = 'primary') {
    console.debug(`showToast: ${type}: ${message}`)
    const clone = document.querySelector('#clone > .toast')
    const container = document.getElementById('toast-container')
    if (!clone || !container) {
        return console.warn('Missing clone or container:', clone, container)
    }
    const element = clone.cloneNode(true)
    element.querySelector('.toast-body').textContent = message
    element.classList.add(`text-bg-${type}`)
    container.appendChild(element)
    const toast = new bootstrap.Toast(element)
    element.addEventListener('mousemove', () => toast.hide())
    toast.show()
}

/**
 * Inject Script into Current Tab
 * @function injectScript
 * @param {Array|String} files
 * @return {Promise<chrome.scripting.InjectionResult.result>}
 */
export async function injectScript(files) {
    if (typeof files === 'string') {
        files = [files]
    }
    console.debug('injectScript files:', files)
    try {
        const [tab] = await chrome.tabs.query({
            currentWindow: true,
            active: true,
        })
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files,
        })
        console.debug('injectScript results:', results)
        if (results[0]?.error) {
            // noinspection JSUnresolvedReference
            console.log('injectScript error:', results[0].error)
        }
        return results[0]?.result
    } catch (e) {
        console.log(e)
    }
}

/**
 * Inject Function into Current Tab with args
 * @function injectFunction
 * @param {Function} func
 * @param {Array} [args]
 * @return {Promise<chrome.scripting.InjectionResult.result>}
 */
export async function injectFunction(func, args) {
    console.debug('injectFunction:', func, args)
    try {
        const [tab] = await chrome.tabs.query({
            currentWindow: true,
            active: true,
        })
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            injectImmediately: true,
            func: func,
            args: args,
        })
        console.debug('injectFunction results:', results)
        if (results[0]?.error) {
            // noinspection JSUnresolvedReference
            console.log('injectFunction error:', results[0].error)
        }
        return results[0]?.result
    } catch (e) {
        console.log(e)
    }
}

/**
 * Copy Text of ctx.linkText or from Active Element
 * Note: Chrome does not support ctx.linkText
 * @function copyActiveElementText
 * @param {OnClickData} ctx
 */
export function copyActiveElementText(ctx) {
    console.debug('copyActiveElementText:', ctx)
    // noinspection JSUnresolvedReference
    let text =
        ctx.linkText?.trim() ||
        document.activeElement.innerText?.trim() ||
        document.activeElement.title?.trim() ||
        document.activeElement.firstElementChild?.alt?.trim() ||
        document.activeElement.ariaLabel?.trim()
    console.log('text:', text)
    if (text?.length) {
        navigator.clipboard.writeText(text).then()
    } else {
        console.log('%cNo Text to Copy.', 'color: Yellow')
    }
}

/**
 * Copy Image SRC of document.activeElement.querySelector img
 * Note: This is injected because Chrome SW has no DOM and requires offscreen
 * @function copyActiveImageSrc
 * @param {OnClickData} ctx
 */
export function copyActiveImageSrc(ctx) {
    console.debug('copyActiveImageSrc:', ctx.srcUrl)
    navigator.clipboard.writeText(ctx.srcUrl).then()
    // console.debug('copyActiveElementText:', ctx, document.activeElement)
    // const img = document.activeElement.querySelector('img')
    // if (!img?.src) {
    //     return console.log('Image not found or no src.', img)
    // }
    // console.log('img.src:', img.src)
    // navigator.clipboard.writeText(img.src).then()
}

/**
 * Toggle Site Handler
 * @function toggleSite
 * @param {String} hostname
 * @return {Promise<Boolean|undefined>} true if enabled
 */
export async function toggleSite(hostname) {
    console.debug('toggleSite:', hostname)
    if (!hostname) {
        console.warn('No hostname:', hostname)
        return
    }
    let changed
    let enabled = false
    const { sites } = await chrome.storage.sync.get(['sites'])
    // if (!(hostname in sites)) {
    if (!sites.includes(hostname)) {
        console.log(`Enabling Site: ${hostname}`)
        // sites[hostname] = {}
        sites.push(hostname)
        changed = true
        enabled = true
    } else {
        console.log(`Disabling Site: ${hostname}`)
        // delete sites[hostname]
        sites.splice(sites.indexOf(hostname), 1)
        changed = true
    }
    if (changed) {
        sites.sort()
        await chrome.storage.sync.set({ sites })
        console.debug('changed sites:', sites)
    }
    return enabled
}

// /**
//  * Enable Site Handler
//  * @function enableSite
//  * @param {String} hostname
//  * @param {Boolean} [enabled]
//  */
// export async function enableSite(hostname, enabled = true) {
//     console.debug(`toggleSite: ${hostname}`, enabled)
//     if (!hostname) {
//         return console.warn('No hostname:', hostname)
//     }
//     const { sites } = await chrome.storage.sync.get(['sites'])
//     let changed = false
//     if (enabled) {
//         // if (!(hostname in sites)) {
//         if (!sites.includes(hostname)) {
//             // sites[hostname] = {}
//             sites.push(hostname)
//             console.debug('added:', hostname)
//             changed = true
//         }
//         // } else if (hostname in sites) {
//     } else if (sites.includes(hostname)) {
//         // delete sites[hostname]
//         const idx = sites.indexOf(hostname)
//         const removed = sites.splice(idx, 1)
//         console.debug('removed:', removed)
//         changed = true
//     }
//     if (changed) {
//         // noinspection JSIgnoredPromiseFromCall
//         await chrome.storage.sync.set({ sites })
//         console.debug('changed sites:', sites)
//     }
// }
