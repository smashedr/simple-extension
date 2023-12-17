// JS for home.html

document.addEventListener('DOMContentLoaded', domContentLoaded)

document
    .querySelectorAll('.open-options')
    .forEach((el) => el.addEventListener('click', openOptions))
document
    .querySelectorAll('.open-page')
    .forEach((el) => el.addEventListener('click', openPage))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.log('domContentLoaded')
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
}

async function openOptions(event) {
    console.log('openOptions', event)
    event.preventDefault()
    chrome.runtime.openOptionsPage()
}

async function openPage(event) {
    console.log('openOptions', event)
    event.preventDefault()
    await chrome.windows.create({
        type: 'detached_panel',
        url: '/html/page.html',
        width: 720,
        height: 480,
    })
}
