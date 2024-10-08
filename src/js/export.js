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
        } else if (['checkbox', 'radio'].includes(el.type)) {
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
        chrome.runtime.openOptionsPage()
        if (close) window.close()
        return
    } else if (href.endsWith('html/panel.html')) {
        await openExtPanel()
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
    // Get Tab from Tabs (requires host permissions)
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
 */
export async function updateManifest() {
    const manifest = chrome.runtime.getManifest()
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
 * @return {Promise<chrome.windows.Window>}
 */
export async function openExtPanel(
    url = '/html/panel.html',
    width = 1280,
    height = 720
) {
    console.debug(`openExtPanel: ${url}`, width, height)
    const windows = await chrome.windows.getAll({ populate: true })
    for (const window of windows) {
        // console.debug('window:', window)
        if (window.tabs[0]?.url?.endsWith(url)) {
            console.debug(`%c Panel found: ${window.id}`, 'color: Lime')
            return chrome.windows.update(window.id, { focused: true })
        }
    }
    return chrome.windows.create({ type: 'panel', url, width, height })
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
 * Inject Function into Current Tab with args
 * @function injectFunction
 * @param {Function} func
 * @param {Array} [args]
 * @return {Promise<chrome.scripting.InjectionResult[]>}
 */
export async function injectFunction(func, args) {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    return await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        injectImmediately: true,
        func: func,
        args: args,
    })
}

/**
 * Copy Text of ctx.linkText or from Active Element
 * Note: Chrome does not support ctx.linkText
 * @function copyActiveElementText
 * @param {OnClickData} ctx
 */
export function copyActiveElementText(ctx) {
    console.debug('copyActiveElementText:', ctx)
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
