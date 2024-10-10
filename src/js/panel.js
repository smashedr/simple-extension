// JS for panel.html

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.close-panel')
    .forEach((el) => el.addEventListener('click', closePanel))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
    })
}

function closePanel(event) {
    console.debug('closePanel:', event)
    event.preventDefault()
    window.close()
}
