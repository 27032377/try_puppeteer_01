# Puppeteer

## Overview

> Puppeteer 是一个 Node 库，它提供一个高级 API 来通过 DevTolls 协议控制 Chromium 或 Chrome。Puppeteer API 是分层次的，反映了浏览器结构。

![Puppeteer 层次](https://user-images.githubusercontent.com/746130/40333229-5df5480c-5d0c-11e8-83cb-c3e371de7374.png)

- `Puppeteer` 使用 [DevTools协议](https://chromedevtools.github.io/devtools-protocol/) 与浏览器进行通信
- `Browser` 实例可以拥有浏览器上下文
- `BrowserContext` 实例定义了一个浏览会话并可拥有多个页面
- `Page` 至少有一个框架：主框架。可能还有其他框架有 `iframe` 或 `框架标签` 创建
- `frame` 至少有一个执行上下文 - 默认的执行上下文 - 框架的 JavaScript 被执行。一个框架可能有额外的与拓展关联的执行上下文
- `Worker` 具有单一执行上下文，并且便于与 [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 进行交互

## Puppeteer

> Puppeteer 提供了一种启动 Chromium 实例的方法。

puppeteer.launch()返回一个Promise，resolve 接收参数为 browser 的实例。

### puppeteer.connect(options)

> 此方法将 Puppeteer 添加到已有的 Chromium 实例。

puppeteer.launch() 连接后断开的 browser，可以通过 puppeteer.connect({ browserWSEndpoint: browser.wsEndpoint() }) 来重新建立连接。

连接 websocket，返回实例为 browser 的 Promise。

### puppeteer.createBrowserFetcher([options])

返回一个 BrowserFetcher。

### puppeteer.defaultArgs([optitons])

> Chromium 启动时使用的默认参数。

### puppeteer.executablePath()

> 返回 string。Puppeteer希望找到绑定的 Chromium 的路径。

### puppeteer.launch(options)

启动 Puppeteer，返回 Browser 实例。

## Browser

> 当 Puppeteer 连接到一个 Chromium 实例的时候会通过 puppeteer.launch 或 puppeteer.connect 创建一个 Browser 对象。

### Events

#### browser.on('disconnected')

当 Puppeteer 从 Chromium 实例断开连接时被触发。

- Chromium 关闭或奔溃