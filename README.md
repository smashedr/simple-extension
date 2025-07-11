[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ifefifghpkllfibejafbakmflidjcjfp?logo=google&logoColor=white&label=users)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/link-extractor?logo=mozilla&label=users)](https://addons.mozilla.org/addon/link-extractor)
[![Edge Add-on Users](https://img.shields.io/badge/dynamic/json?label=users&logo=gmail&logoColor=white&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fnmndaimimedljcfgnnoahempcajdamej)](https://microsoftedge.microsoft.com/addons/detail/link-extractor/nmndaimimedljcfgnnoahempcajdamej)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/ifefifghpkllfibejafbakmflidjcjfp?logo=google&logoColor=white)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/link-extractor?logo=mozilla&logoColor=white)](https://addons.mozilla.org/addon/link-extractor)
[![Edge Add-on Rating](https://img.shields.io/badge/dynamic/json?label=rating&logo=gmail&logoColor=white&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fnmndaimimedljcfgnnoahempcajdamej)](https://microsoftedge.microsoft.com/addons/detail/link-extractor/nmndaimimedljcfgnnoahempcajdamej)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/link-extractor?style=flat&logo=github&logoColor=white)](https://github.com/cssnr/link-extractor/stargazers)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ifefifghpkllfibejafbakmflidjcjfp?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/link-extractor/ifefifghpkllfibejafbakmflidjcjfp)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/link-extractor?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/link-extractor)
[![Edge Add-on Version](https://img.shields.io/badge/dynamic/json?label=microsoft&logo=leptos&logoColor=2bc3d2&&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fnmndaimimedljcfgnnoahempcajdamej)](https://microsoftedge.microsoft.com/addons/detail/link-extractor/nmndaimimedljcfgnnoahempcajdamej)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/link-extractor?logo=github)](https://github.com/cssnr/link-extractor/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/smashedr/simple-extension/build.yaml?logo=github&logoColor=white&label=build)](https://github.com/smashedr/simple-extension/actions/workflows/build.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/smashedr/simple-extension/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/smashedr/simple-extension/actions/workflows/test.yaml)
[![Lint](https://img.shields.io/github/actions/workflow/status/smashedr/simple-extension/lint.yaml?logo=github&logoColor=white&label=lint)](https://github.com/smashedr/simple-extension/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_link-extractor&metric=alert_status&label=quality)](https://sonarcloud.io/summary/overall?id=cssnr_link-extractor)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/simple-extension?logo=github&logoColor=white&label=updated)](https://github.com/smashedr/simple-extension/graphs/commit-activity)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/simple-extension?logo=htmx&logoColor=white)](https://github.com/smashedr/simple-extension)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/simple-extension?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/smashedr/simple-extension)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Simple Extension Template

Modern Chrome Web Extension and Firefox Browser Addon for Copying and Creating New Extensions.
Written in Vanilla JavaScript using Bootstrap and compatible with Mobile Firefox, Yandex, Kiwi, etc.

- [Features](#features)
- [Configuration](#configuration)
- [Template Notes](#template-notes)
- [Development](#development)
- [Contributing](#Contributing)

## Features

- Options Page
- Toolbar Popup
- Extension Page
- Extension Panel
- Context Menu
- Keyboard Shortcuts
- Content Script
- Service Worker
- Host Permissions
- Dark/Light Theme Switcher
- Fully Mobile Compatible

## Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Link Extractor icon, then;  
**Chrome,** click the `Pin` icon.  
**Firefox,** click the `Settings Wheel` and `Pin to Toolbar`.

# Template Notes

- Minimum Chrome and Firefox Versions

These should ben set to the highest level of API you use.  
**Firefox** is set to 112 due to `background: type: "module"` allowing import in the service-worker.  
**Chrome** is set to 127 due to using `action.openPopup()` which was policy restricted until then.

# Development

For instructions on building, testing and submitting a PR, see [CONTRIBUTING.md](CONTRIBUTING.md).

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

Additionally, you can star or provide a 5-star rating on other Web Extensions I have created and published:

- [Link Extractor](https://github.com/cssnr/link-extractor?tab=readme-ov-file#readme)
- [Open Links in New Tab](https://github.com/cssnr/open-links-in-new-tab?tab=readme-ov-file#readme)
- [Auto Auth](https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme)
- [Cache Cleaner](https://github.com/cssnr/cache-cleaner?tab=readme-ov-file#readme)
- [HLS Video Downloader](https://github.com/cssnr/hls-video-downloader?tab=readme-ov-file#readme)
- [Obtainium Extension](https://github.com/cssnr/obtainium-extension?tab=readme-ov-file#readme)
- [SMWC Web Extension](https://github.com/cssnr/smwc-web-extension?tab=readme-ov-file#readme)
- [PlayDrift Extension](https://github.com/cssnr/playdrift-extension?tab=readme-ov-file#readme)
- [ASN Plus](https://github.com/cssnr/asn-plus?tab=readme-ov-file#readme)
- [Aviation Tools](https://github.com/cssnr/aviation-tools?tab=readme-ov-file#readme)
- [Text Formatter](https://github.com/cssnr/text-formatter?tab=readme-ov-file#readme)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
