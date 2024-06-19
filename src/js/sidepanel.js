// JS for sidepanel.html

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('close').addEventListener('click', closePanel)

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
}

/**
 * Close Side Panel
 * @function closePanel
 */
async function closePanel(event) {
    console.debug('closePanel:', event)
    event.preventDefault()
    if (typeof browser !== 'undefined') {
        await browser.sidebarAction.close()
    } else {
        window.close()
    }
}
