// JS for page.html

document.addEventListener('DOMContentLoaded', initPage)

/**
 * Initialize Page
 * @function initPage
 */
async function initPage() {
    console.log('initPage')
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
}
