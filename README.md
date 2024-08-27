[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ifefifghpkllfibejafbakmflidjcjfp?logo=google&logoColor=white&label=users)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/link-extractor?logo=mozilla&label=users)](https://addons.mozilla.org/addon/link-extractor)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/ifefifghpkllfibejafbakmflidjcjfp?logo=google&logoColor=white)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/link-extractor?logo=mozilla&logoColor=white)](https://addons.mozilla.org/addon/link-extractor)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/link-extractor?style=flat&logo=github&logoColor=white)](https://github.com/cssnr/link-extractor/stargazers)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ifefifghpkllfibejafbakmflidjcjfp?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/link-extractor?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/link-extractor)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/link-extractor?logo=github)](https://github.com/cssnr/link-extractor/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/smashedr/simple-extension/build.yaml?logo=github&logoColor=white&label=build)](https://github.com/smashedr/simple-extension/actions/workflows/build.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/smashedr/simple-extension/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/smashedr/simple-extension/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=smashedr_simple-extension&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_simple-extension)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/simple-extension?logo=github&logoColor=white&label=updated)](https://github.com/smashedr/simple-extension/graphs/commit-activity)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/simple-extension?logo=htmx&logoColor=white)](https://github.com/smashedr/simple-extension)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Simple Extension Template

Modern Chrome Web Extension and Firefox Browser Addon for Copying and Creating New Extensions.
Written in Vanilla JavaScript using Bootstrap and compatible with Mobile Firefox, Yandex, Kiwi, etc.

* [Features](#features)
* [Configuration](#configuration)
* [Development](#development)
    - [Building](#building)
    - [Chrome Setup](#Chrome-Setup)
    - [Firefox Setup](#Firefox-Setup)

## Features

* Options Page
* Toolbar Popup
* Extension Page
* Extension Panel
* Context Menu
* Keyboard Shortcuts
* Content Script
* Service Worker
* Host Permissions
* Dark/Light Theme Switcher
* Fully Mobile Compatible

## Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Link Extractor icon, then;  
**Chrome,** click the `Pin` icon.  
**Firefox,** click the `Settings Wheel` and `Pin to Toolbar`.

# Development

First, clone (or download) this repository and change into the directory.

Second, install the dependencies:

```shell
npm install
```

Finally, to run Chrome or Firefox with web-ext, run one of the following:

```shell
npm run chrome
npm run firefox
```

Additionally, to Load Unpacked/Temporary Add-on make a `manifest.json` and run from the [src](src) folder, run one of
the following:

```shell
npm run manifest:chrome
npm run manifest:firefox
```

Chrome: [https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)  
Firefox: [https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

For more information on
web-ext, [read this documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/).  
To pass additional arguments to an `npm run` command, use `--`.  
Example: `npm run chrome -- --chromium-binary=...`

## Building

Install the requirements and copy libraries into the `src/dist` directory by running `npm install`.
See [gulpfile.js](gulpfile.js) for more information on `postinstall`.

```shell
npm install
```

To create a `.zip` archive of the [src](src) directory for the desired browser run one of the following:

```shell
npm run build
npm run build:chrome
npm run build:firefox
```

For more information on building, see the scripts section in the [package.json](package.json) file.

## Chrome Setup

1. Build or Download a [Release](https://github.com/smashedr/simple-extension/releases).
1. Unzip the archive, place the folder where it must remain and note its location for later.
1. Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1. In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1. Navigate to the folder you extracted in step #3 then click `Select Folder`.

## Firefox Setup

1. Build or Download a [Release](https://github.com/smashedr/simple-extension/releases).
1. Unzip the archive, place the folder where it must remain and note its location for later.
1. Go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on...`
1. Navigate to the folder you extracted earlier, select `manifest.json` then click `Select File`.
1. Optional: open `about:config` search for `extensions.webextensions.keepStorageOnUninstall` and set to `true`.

If you need to test a restart, you must pack the addon. This only works in ESR, Development, or Nightly.
You may also use an Unbranded
Build: [https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds)

1. Run `npm run build:firefox` then use `web-ext-artifacts/{name}-firefox-{version}.zip`.
1. Open `about:config` search for `xpinstall.signatures.required` and set to `false`.
1. Open `about:addons` and drag the zip file to the page or choose Install from File from the Settings wheel.

# Contributing

To support this project install, star, or provide a 5-star rating on other Web Extensions I have created and published:

- [Link Extractor](https://github.com/cssnr/link-extractor)
- [Open Links in New Tab](https://github.com/cssnr/open-links-in-new-tab)
- [Cache Cleaner](https://github.com/cssnr/cache-cleaner)
- [Auto Auth](https://github.com/cssnr/auto-auth)
- [Cache Cleaner](https://github.com/cssnr/cache-cleaner)
- [Auto Auth](https://github.com/cssnr/auto-auth)
- [HLS Video Downloader](https://github.com/cssnr/hls-video-downloader)
- [SMWC Web Extension](https://github.com/cssnr/smwc-web-extension)
- [PlayDrift Extension](https://github.com/cssnr/playdrift-extension)
- [ASN Plus](https://github.com/cssnr/asn-plus)
- [Aviation Tools](https://github.com/cssnr/aviation-tools)
- [Text Formatter](https://github.com/cssnr/text-formatter)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
