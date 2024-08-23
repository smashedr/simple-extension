// JS Content Script

console.log('%cRUNNING content-script.js', 'color: Khaki')

if (!chrome.storage.onChanged.hasListener(onChanged)) {
    console.debug('Adding storage.onChanged Listener')
    chrome.storage.onChanged.addListener(onChanged)
}

;(async () => {
    // get options
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
    // send message to service worker
    const message = { message: contentScriptFunction() }
    console.log('message:', message)
    const response = await chrome.runtime.sendMessage(message)
    // work with response from service worker
    console.log('response:', response)
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
    }
}

/**
 * contentScriptFunction
 * @return {string}
 */
function contentScriptFunction() {
    return 'Hello from content-script.js'
}
