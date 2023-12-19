// JS Content Script

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
 * contentScriptFunction
 * @return {string}
 */
function contentScriptFunction() {
    return 'Hello from content-script.js'
}
