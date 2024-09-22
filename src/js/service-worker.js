// JS Background Service Worker

import {
    activateOrOpen,
    checkPerms,
    copyActiveElementText,
    copyActiveImageSrc,
    injectFunction,
    openExtPanel,
    githubURL,
} from './export.js'

chrome.runtime.onInstalled.addListener(onInstalled)
chrome.runtime.onStartup.addListener(onStartup)
chrome.contextMenus?.onClicked.addListener(onClicked)
chrome.commands?.onCommand.addListener(onCommand)
chrome.runtime.onMessage.addListener(onMessage)
chrome.storage.onChanged.addListener(onChanged)

/**
 * On Installed Callback
 * @function onInstalled
 * @param {chrome.runtime.InstalledDetails} details
 */
async function onInstalled(details) {
    console.log('onInstalled:', details)
    const options = await setDefaultOptions({
        testInput: 'Default Value',
        testNumber: 60,
        contextMenu: true,
        showUpdate: false,
    })
    console.debug('options:', options)
    if (options.contextMenu) {
        createContextMenus()
    }
    const manifest = chrome.runtime.getManifest()
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const hasPerms = await checkPerms()
        if (hasPerms) {
            chrome.runtime.openOptionsPage()
        } else {
            const url = chrome.runtime.getURL('/html/permissions.html')
            await chrome.tabs.create({ active: true, url })
        }
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        if (options.showUpdate) {
            if (manifest.version !== details.previousVersion) {
                const url = `${githubURL}/releases/tag/${manifest.version}`
                await chrome.tabs.create({ active: false, url })
            }
        }
    }
    setUninstallURL()

    const platform = await chrome.runtime.getPlatformInfo()
    console.debug('platform:', platform)
}

/**
 * On Startup Callback
 * @function onStartup
 */
async function onStartup() {
    console.log('onStartup')
    // noinspection JSUnresolvedReference
    if (typeof browser !== 'undefined') {
        console.log('Firefox Startup Workarounds')
        const { options } = await chrome.storage.sync.get(['options'])
        console.debug('options:', options)
        if (options.contextMenu) {
            createContextMenus()
        }
        setUninstallURL()
    }
}

function setUninstallURL() {
    // const manifest = chrome.runtime.getManifest()
    // const url = new URL('https://link-extractor.cssnr.com/uninstall/')
    // url.searchParams.append('version', manifest.version)
    // chrome.runtime.setUninstallURL(url.href)
    // console.debug(`setUninstallURL: ${url.href}`)
    chrome.runtime.setUninstallURL(`${githubURL}/issues`)
    console.debug(`setUninstallURL: ${githubURL}/issues`)
}

/**
 * On Clicked Callback
 * @function onClicked
 * @param {OnClickData} ctx
 * @param {chrome.tabs.Tab} tab
 */
async function onClicked(ctx, tab) {
    console.debug('onClicked:', ctx, tab)
    if (ctx.menuItemId === 'openOptions') {
        chrome.runtime.openOptionsPage()
    } else if (ctx.menuItemId === 'openHome') {
        const url = chrome.runtime.getURL('/html/home.html')
        await activateOrOpen(url)
    } else if (ctx.menuItemId === 'openExtPanel') {
        await openExtPanel()
    } else if (ctx.menuItemId === 'copyText') {
        console.debug('injectFunction: copy')
        await injectFunction(copyActiveElementText, [ctx])
    } else if (ctx.menuItemId === 'copySrc') {
        console.debug('injectFunction: image')
        await injectFunction(copyActiveImageSrc, [ctx])
    } else {
        console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
}

/**
 * On Command Callback
 * @function onCommand
 * @param {String} command
 * @param {chrome.tabs.Tab} tab
 */
async function onCommand(command, tab) {
    console.debug('onCommand:', command, tab)
    if (command === 'openOptions') {
        chrome.runtime.openOptionsPage()
    } else if (command === 'openHome') {
        const url = chrome.runtime.getURL('/html/home.html')
        await activateOrOpen(url)
    } else if (command === 'openExtPanel') {
        await openExtPanel()
    } else {
        console.warn(`Unknown Command: ${command}`)
    }
}

/**
 * On Message Callback
 * @function onMessage
 * @param {Object} message
 * @param {MessageSender} sender
 * @param {Function} sendResponse
 */
function onMessage(message, sender, sendResponse) {
    console.debug('onMessage:', message, sender)
    sendResponse('Success.')
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
function onChanged(changes, namespace) {
    // console.debug('onChanged:', changes, namespace)
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options' && oldValue && newValue) {
            if (oldValue.contextMenu !== newValue.contextMenu) {
                if (newValue?.contextMenu) {
                    console.log('%cEnabled contextMenu...', 'color: Lime')
                    createContextMenus()
                } else {
                    console.log('%cDisabled contextMenu...', 'color: OrangeRed')
                    chrome.contextMenus?.removeAll()
                }
            }
        }
    }
}

/**
 * Create Context Menus
 * @function createContextMenus
 */
function createContextMenus() {
    if (!chrome.contextMenus) {
        return console.debug('Skipping: chrome.contextMenus')
    }
    console.debug('createContextMenus')
    chrome.contextMenus.removeAll()
    /** @type {Array[chrome.contextMenus.ContextType[], String, String]} */
    const contexts = [
        [['link'], 'copyText', 'Copy Link Text'],
        [['image', 'audio', 'video'], 'copySrc', 'Copy Source URL'],
        [['link', 'image', 'audio', 'video'], 'separator'],
        [['all'], 'openHome', 'Home Page'],
        [['all'], 'openExtPanel', 'Extension Panel'],
        [['all'], 'separator'],
        [['all'], 'openOptions', 'Open Options'],
    ]
    contexts.forEach(addContext)
}

/**
 * Add Context from Array
 * @function addContext
 * @param {[chrome.contextMenus.ContextType[],String,String,chrome.contextMenus.ContextItemType?]} context
 */
function addContext(context) {
    // console.debug('addContext:', context)
    try {
        if (context[1] === 'separator') {
            const id = Math.random().toString().substring(2, 7)
            context[1] = `${id}`
            context.push('separator', 'separator')
        }
        // console.debug('menus.create:', context)
        chrome.contextMenus.create({
            contexts: context[0],
            id: context[1],
            title: context[2],
            type: context[3] || 'normal',
        })
    } catch (e) {
        console.log('%cError Adding Context:', 'color: Yellow', e)
    }
}

/**
 * Set Default Options
 * @function setDefaultOptions
 * @param {Object} defaultOptions
 * @return {Promise<Object>}
 */
async function setDefaultOptions(defaultOptions) {
    console.log('setDefaultOptions', defaultOptions)
    let { options } = await chrome.storage.sync.get(['options'])
    options = options || {}
    let changed = false
    for (const [key, value] of Object.entries(defaultOptions)) {
        // console.log(`${key}: default: ${value} current: ${options[key]}`)
        if (options[key] === undefined) {
            changed = true
            options[key] = value
            console.log(`Set %c${key}:`, 'color: Khaki', value)
        }
    }
    if (changed) {
        await chrome.storage.sync.set({ options })
        console.log('changed options:', options)
    }
    return options
}
