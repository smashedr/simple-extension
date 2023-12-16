// JS for home.html

document.addEventListener('DOMContentLoaded', domContentLoaded)

document.getElementById('close').addEventListener('click', closePage)

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.log('domContentLoaded')
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
}

function closePage() {
    chrome.windows.remove(chrome.windows.WINDOW_ID_CURRENT)
}
