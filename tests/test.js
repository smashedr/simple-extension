const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const sourceDir = 'src'
const screenshotsDir = 'tests/screenshots'

let count = 1

/**
 * @function ssOpts
 * @param {String} name
 * @param {Object} [options]
 * @return {Object}
 */
function ssOpts(name, options = {}) {
    const n = count.toString().padStart(2, '0')
    count++
    const opts = { path: `${screenshotsDir}/${n}_${name}.png` }
    Object.assign(opts, options)
    console.log('ssOpts:', opts)
    return opts
}

/**
 * @function getPage
 * @param {puppeteer.Browser} browser
 * @param {String} name
 * @param {Boolean=} log
 * @param {String=} size
 * @return {Promise<puppeteer.Page>}
 */
async function getPage(browser, name, log, size) {
    console.debug(`getPage: ${name}`, log, size)
    const target = await browser.waitForTarget(
        (target) => target.type() === 'page' && target.url().endsWith(name)
    )
    const page = await target.asPage()
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ])
    if (size) {
        const [width, height] = size.split('x').map((x) => parseInt(x))
        await page.setViewport({ width, height })
    }
    if (log) {
        console.debug(`Adding Logger: ${name}`)
        page.on('console', (msg) =>
            console.log(`console: ${name}:`, msg.text())
        )
    }
    return page
}

;(async () => {
    if (fs.existsSync(screenshotsDir)) {
        fs.rmdirSync(screenshotsDir, { recursive: true, force: true })
    }
    fs.mkdirSync(screenshotsDir)

    const pathToExtension = path.join(process.cwd(), sourceDir)
    console.log('pathToExtension:', pathToExtension)
    const browser = await puppeteer.launch({
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
        dumpio: true,
        // headless: false,
        // slowMo: 150,
    })
    console.log('browser:', browser)

    // Get Service Worker
    const workerTarget = await browser.waitForTarget(
        (target) =>
            target.type() === 'service_worker' &&
            target.url().endsWith('service-worker.js')
    )
    const worker = await workerTarget.worker()
    console.log('worker:', worker)

    // Popup
    await worker.evaluate('chrome.action.openPopup();')
    let page = await getPage(browser, 'popup.html')
    console.log('page:', page)
    await page.waitForNetworkIdle()
    await page.screenshot(ssOpts('popup'))
    await page.locator('[href="../html/options.html"]').click()

    // Home Page / Popup
    const manifest = await worker.evaluate('chrome.runtime.getManifest();')
    console.log('manifest:', manifest)
    const homepage = await browser.newPage()
    await homepage.goto(manifest.homepage_url)
    await worker.evaluate('chrome.action.openPopup();')
    page = await getPage(browser, 'popup.html')
    console.log('page:', page)
    await page.waitForNetworkIdle()
    await page.screenshot(ssOpts('github1'))

    await page.locator('#toggle-site').click()
    await page.screenshot(ssOpts('github2'))

    // Options
    // await worker.evaluate('chrome.runtime.openOptionsPage();')
    page = await getPage(browser, 'options.html')
    console.log('page:', page)
    await page.waitForNetworkIdle()
    await page.screenshot(ssOpts('options1'))
    await page.locator('.fa-regular.fa-trash-can').click()
    // await page.keyboard.press('Enter')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await page.screenshot(ssOpts('options2'))
    await page.close()

    await browser.close()
})()
