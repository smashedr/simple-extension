// JS Content Script

console.log('%cSimple Extension: content-script.js', 'color: Khaki')

if (!chrome.storage.onChanged.hasListener(onChanged)) {
    console.debug('Adding storage.onChanged Listener')
    chrome.storage.onChanged.addListener(onChanged)
}

let contentScript = true // eslint-disable-line no-unused-vars
let tabEnabled = false

;(async () => {
    // get options
    // const { options } = await chrome.storage.sync.get(['options'])
    // const { sites } = await chrome.storage.local.get(['sites'])
    const { options, sites } = await chrome.storage.sync.get([
        'options',
        'sites',
    ])
    console.log('options:', options)
    console.log('sites:', sites)
    console.log('window.location.hostname:', window.location.hostname)
    if (sites.includes(window.location.hostname)) {
        tabEnabled = true
        const response = await chrome.runtime.sendMessage({ badgeText: 'On' })
        console.log('response:', response)
    }
})()

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
async function onChanged(changes, namespace) {
    console.debug('onChanged:', changes, namespace)
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options') {
            console.debug('sync.options', oldValue, newValue)
        }
        if (namespace === 'sync' && key === 'sites') {
            console.debug('sync.sites', oldValue, newValue)
            await sitesChange(newValue)
        }
    }
}

async function sitesChange(data) {
    console.debug('sitesChange', data)
    console.debug('window.location.hostname', window.location.hostname)
    if (data.includes(window.location.hostname)) {
        await chrome.runtime.sendMessage({ badgeText: 'On' })
        if (!tabEnabled) {
            tabEnabled = true
        }
    } else {
        await chrome.runtime.sendMessage({ badgeText: '' })
        if (tabEnabled) {
            tabEnabled = false
        }
    }
}

// eslint-disable-next-line no-unused-vars
function contentScriptFunction() {
    return 'Hello from content-script.js'
}
