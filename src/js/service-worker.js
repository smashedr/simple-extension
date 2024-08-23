// JS Background Service Worker

import {
    activateOrOpen,
    checkPerms,
    copyActiveElementText,
    copyActiveImageSrc,
    injectFunction,
    openExtPanel,
} from './export.js'

chrome.runtime.onStartup.addListener(onStartup)
chrome.runtime.onInstalled.addListener(onInstalled)
chrome.contextMenus?.onClicked.addListener(onClicked)
chrome.commands?.onCommand.addListener(onCommand)
chrome.runtime.onMessage.addListener(onMessage)
chrome.storage.onChanged.addListener(onChanged)

/**
 * On Startup Callback
 * @function onStartup
 */
async function onStartup() {
    console.log('onStartup')
    if (typeof browser !== 'undefined') {
        console.log('Firefox CTX Menu Workaround')
        const { options } = await chrome.storage.sync.get(['options'])
        console.debug('options:', options)
        if (options.contextMenu) {
            createContextMenus()
        }
    }
}

/**
 * On Installed Callback
 * @function onInstalled
 * @param {InstalledDetails} details
 */
async function onInstalled(details) {
    console.log('onInstalled:', details)
    const githubURL = 'https://github.com/smashedr/simple-extension'
    // const uninstallURL = new URL('https://link-extractor.cssnr.com/uninstall/')
    const options = await setDefaultOptions({
        testInput: 'Default Value',
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
    // uninstallURL.searchParams.append('version', manifest.version)
    // console.log('uninstallURL:', uninstallURL.href)
    // await chrome.runtime.setUninstallURL(uninstallURL.href)
    await chrome.runtime.setUninstallURL(`${githubURL}/issues`)

    const platform = await chrome.runtime.getPlatformInfo()
    console.debug('platform:', platform)
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
    console.debug(`onCommand: ${command}`, tab)
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
    console.debug('onMessage: message, sender:', message, sender)
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
                    console.info('Enabled contextMenu...')
                    createContextMenus()
                } else {
                    console.info('Disabled contextMenu...')
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
    /** @type {Array[String[], String, String]} */
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
 * @param {[String[],String,String?]} context
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
        console.log('Error Adding Context:', e)
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
            console.log(`%cSet ${key}:`, 'color: Khaki', value)
        }
    }
    if (changed) {
        await chrome.storage.sync.set({ options })
        console.log('changed:', options)
    }
    return options
}
