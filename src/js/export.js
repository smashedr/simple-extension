// JS Exports

/**
 * Check Host Permissions
 * @function checkPerms
 * @return {Boolean}
 */
export async function checkPerms() {
    const hasPermsEl = document.querySelectorAll('.has-perms')
    const grantPermsEl = document.querySelectorAll('.grant-perms')
    const hasPerms = await chrome.permissions.contains({
        origins: ['https://*/*', 'http://*/*'],
    })
    console.log('checkPerms:', hasPerms)
    if (hasPerms) {
        hasPermsEl.forEach((el) => el.classList.remove('visually-hidden'))
        grantPermsEl.forEach((el) => el.classList.add('visually-hidden'))
    } else {
        grantPermsEl.forEach((el) => el.classList.remove('visually-hidden'))
        hasPermsEl.forEach((el) => el.classList.add('visually-hidden'))
    }
    return hasPerms
}

/**
 * Save Options Callback
 * @function saveOptions
 * @param {InputEvent} event
 */
export async function saveOptions(event) {
    console.log('saveOptions:', event)
    const { options } = await chrome.storage.sync.get(['options'])
    let value
    if (event.target.type === 'checkbox') {
        value = event.target.checked
    } else if (event.target.type === 'text') {
        value = event.target.value
    }
    if (value !== undefined) {
        options[event.target.id] = value
        console.log(`Set: ${event.target.id}:`, value)
        await chrome.storage.sync.set({ options })
    }
}

/**
 * Update Options based on typeof
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    for (const [key, value] of Object.entries(options)) {
        // console.log(`${key}: ${value}`)
        const el = document.getElementById(key)
        if (el) {
            if (typeof value === 'boolean') {
                el.checked = value
            } else if (typeof value === 'string') {
                el.value = value
            }
        }
    }
}
