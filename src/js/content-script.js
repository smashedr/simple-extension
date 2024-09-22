// JS Content Script

console.log('%cSimple Extension: content-script.js', 'color: Khaki')

if (!chrome.storage.onChanged.hasListener(onChanged)) {
    console.debug('Adding storage.onChanged Listener')
    chrome.storage.onChanged.addListener(onChanged)
}

;(async () => {
    // get options
    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
    const { sites } = await chrome.storage.local.get(['sites'])
    console.log('sites:', sites)
    console.log('window.location.hostname:', window.location.hostname)
    if (sites.includes(window.location.hostname)) {
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
        if (namespace === 'local' && key === 'sites') {
            console.debug('sync.options', oldValue, newValue)
            console.debug('window.location.hostname', window.location.hostname)
            if (newValue.includes(window.location.hostname)) {
                chrome.runtime.sendMessage({ badgeText: 'On' })
            } else {
                chrome.runtime.sendMessage({ badgeText: '' })
            }
        }
    }
}

/**
 * contentScriptFunction
 * @return {string}
 */
function contentScriptFunction() {
    return 'Hello from content-script.js'
}
