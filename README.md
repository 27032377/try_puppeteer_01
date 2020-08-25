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

当 Puppeteer 从 Chromium 实例断开连接时被触发。回调参数会是 `undefined`。

- Chromium 关闭或奔溃
- 调用 `browser.disconnect` 方法

#### browser.on('targetchanged')

当目标的 url 改变时被触发

#### browser.on('targetcreated')

当目标被创建时触发，e.g `window.open` 或 `browser.newPage`。回调参数是一个 `browser.target()`。

#### browser.on('targetdestroyed')

当目标被销毁时触发，例如当一个页面被关闭时。`window.close` 或 `browser.close`。回调参数是一个 `browser.target()`。

```
const puppeteer = require('puppeteer');

try {
  (async () => {
    // return promise instanceof Browser
    const browser = await puppeteer.launch({
      timeout: 0,
      headless: false
    });

    // 当 Puppeteer 从 Chromium 实例断开连接时触发。
    browser.on('disconnected', ev => {
      console.info('Browser has disconnected!');
      console.log(ev); // undefined
    })

    // 当目标的 url 改变时被触发
    browser.on('targetChanged', ev => {
      console.info('Browser\'s target was changed!');
      console.log(ev);
    })

    // 当目标被创建时触发，e.g window.open browser.newPage
    browser.on('targetcreated', ev => {
      console.info('Browser created a new target!');
      console.log(ev); // browser.target()
    })

    browser.on('targetdestroyed', ev => {
      console.info('Browser was destroyed!');
      console.log(ev); // browser.target()
    })

    const page = await browser.newPage();

    await page.goto('https://www.baidu.com');

    const wsPoint = browser.wsEndpoint();

    browser.disconnect();

    const browser2 = await puppeteer.connect({
      browserWSEndpoint: wsPoint
    })

    // 当 Puppeteer 从 Chromium 实例断开连接时触发。
    browser2.on('disconnected', ev => {
      console.info('Browser2 has disconnected!');
      console.log(ev); // undefined
    })

    // 当目标的 url 改变时被触发
    browser2.on('targetChanged', ev => {
      console.info('Browser2\'s target was changed!');
      console.log(ev);
    })

    // 当目标被创建时触发，e.g window.open browser.newPage
    browser2.on('targetcreated', ev => {
      console.info('Browser2 created a new target!');
      console.log(ev); // browser.target()
    })

    browser2.on('targetdestroyed', ev => {
      console.info('Browser2 was destroyed!');
      console.log(ev); // browser.target()
    })

    const page2 = await browser2.newPage();

    await page2.goto('https://www.npmjs.com');

    page2.close();
  })()
} catch (err) {
  console.warn('Puppeteer Launch Error!');
  throw Error(err);
}
```

### Methods

#### browser.browserContext()
> 返回一个包含所有开大浏览器上下文的数组。在新创建的浏览器中， 将返回 BrowserContext 的单一实例。

#### browser.close()

> 关闭 Chromium 及其所有页面(如果页面被打开的话)。Browser 对象本身被认为是处理过的并不能再被使用。

#### browser.createIncognitoBrowserContext()

> 返回一个 Promise 创建一个匿名的浏览器上下文。这将不会和其他浏览器上下文分享 cookies/cache。

```
const browser = await puppeteer.launch();
// 创建一个匿名的浏览器上下文
const context = await browser.createIncognitoBrowserContext();
// 在匿名的原生上下文中创建一个新页面
const page = await context.newPage();
await page.goto('https://www.baidu.com');
```

#### browser.defaultBrowserContext()

> 返回一个默认的浏览器上下文。这个上下文不能被关闭。

#### browser.disconnect()

> 断开 Puppeteer 和浏览器的连接，但 Chromium 进行仍然在运行。在调用 disconnect 之后，Browser 对象本身被认为是处理过的并不能被在使用。

#### browser.newPage()

> 返回一个新的 Promise\<Page> 对象。Page 在一个默认的浏览器上下文中被创建。

#### browser.pages()

> 返回一个浏览器中所有页面的数组 Promise\<Array\<Page>>。在多个浏览器上下文的情况下，该方法将返回一个包含所有浏览器上下文中所有页面的数组。页面不可见的，比如 "background_page" 将不会列在这。不过可以通过 target.page() 找到它们。

#### browser.process()

> 返回产生浏览器的进程。如果浏览器实例是由 puppeteer.connect 方法创建的则返回 null。

由stderr, stdin, stdout, pid等属性组成的对象

#### browser.target()

> 返回浏览器相关的目标对象

#### browser.targets()

> 浏览器内所有活动目标组成的数组 Array\<Target>。在多个浏览器上下文的情况下，该方法将返回一个包含所有浏览器上下文的所有目标的数组。

#### browser.userAgent()

> 返回 Promise\<string>，浏览器原始的 user-agent

页面可以使用 page.setUserAgent 覆盖浏览器的 user-agent

#### browser.version()

> 返回 Promise\<string>，版本号，类似 HeadlessChrome/61.0.3153.0(无头) 或 Chrome/61.0.3153.0。

browser.version() 的格式可能在未来版本的 Chromium 中发生变化。

#### browser.wsEndpoint()

> 返回 String，浏览器 websocket 的地址。

## BrowserFetcher

> BrowserFetcher 可以用来下载和管理不同版本的 Chromium。通过 puppeteer.createBrowserFetcher() 创建。

## Page

> Page 提供操作一个 tab 页的方法。一个 Browser 实例可以有多个 Page 实例。

Page会触发多种事件，可以用 `node` 原生的方法来捕获处理，比如 `on`, `once`, `removeListener`。

```
page.on('load', () => {
  console.log('Page loaded!');
})

function logRequest(interceptedRequest) {
  console.log('A request was made:', interceptedRequest.url());
}
page.on('request', logRequest);
page.removeListener('request', logRequest);
```

### Events

#### page.on('error')

> 当页面崩溃时触发。

#### page.on('pageerror')

> 当发生页面 js 代码没有捕获的异常时触发。

#### page.on('metrics')

> 当页面 js 代码调用了 console.timeStamp 方法时触发。

### Methods

#### page.$(selector)

> selector\<string> 选择器，返回 Promise\<ElementHandle>，此方法在页面内执行 `document.querySelector`，page.mainFrame().$(selector) 的简写。

#### page.$$(selector)

> 返回 Promise\<Array\<ElementHandle>>，子方法在页面执行 `document.querySelectorAll`，page.mainFrame().$$(selector) 的简写。

#### page.addScriptTag(options)

> 注入一个指定 src(url) 或者 代码(content) 的 script 标签到当前页面。返回 Promise\<ElementHandle>，即注入完成的 tag 标签。page.mainFrame().addScriptTag(options) 的简写。

- `options` Object
  - `url` string，要添加的 `script` 的 src
  - `path` string，要注入的 `frame` 的 js 文件路径
  - `content` string，要注入页面的 js 代码
  - `type` string，脚本类型。如果要注入 `ES6 module`，值为 `module`

#### page.bringToFront()

> return Promise，相当于多个 tab 时，切换到某个tab

#### page.click(selector[, options])

> 此方法找到一个匹配 selector 选择器的元素，如果需要会把此元素滚动到可视，通过 page.mouse 点击它。如果选择器没有匹配任何元素，此方法将会报错。

如果 `click()` 触发了一个跳转，会有一个独立的 `page.waitForNavigation()` Promise 对象需要等待。

```
const [response] = await Promise.all([
  page.waitForNavigation(waitOptions),
  page.click(selector, clickOptions)
])
```

- `selector` String，要点击的元素选择器，如果有多个匹配的元素，点击第一个
- `options` Object
  - `button` String，left, right 或者 middle，默认 `left`
  - `clickCount` Number，默认是 1
  - `delay` Number，`mousedown` 和 `mouseup` 之间停留的时间，单位是毫秒。默认是 0

#### page.content()

> return Promise\<string>，返回页面的完整 html 代码。包括 doctype。

#### page.emulate(options) 模拟器

> 根据指定的参数和 user agent 生成模拟器。

此方法与下面方法效果相同：

- page.setUserAgent(userAgent)
- page.setViewport(viewport)

#### page.evaluate(pageFunction[, ...args])

> 返回 Promise\<Serializable>，即 pageFunction 的返回值，如果 pageFunction 返回的是 Promise，page.evaluate 将等待 promise 完成，并返回其返回值；如果 pageFunction 返回的是不能序列化的值，则返回 undefined。

#### page.exposeFunction(name, puppeteerFunction)

> 返回 Promise，此方法添加一个命名为 name 的方法到页面的 window 对象，当调用 name 方法时，在 node.js 中执行 puppeteerFunction，并且返回 Promise 对象，解析后返回 puppeteerFunction 的返回值。

- `name` String，挂载到 window 对象的方法名
- `puppeteerFunction` Function，调用 name 方法时实际执行的方法

#### page.isClosed()

> 返回 Boolean，页面是否关闭

#### page.mainFranme()

> 返回 Frame，保证页面一直有一个主 frame

#### page.metrics()

> 返回 Promise\<Object>，包含指标数据的键值对

#### page.pdf([options])

> 返回 Promise\<Buffer>，resolve 后是 pdf buffer

***目前仅支持无头模式(headless=true)的 Chrome***

#### page.select(selector, ...values)

> 返回 Promise\<Array\<String>>，所有符合的元素，认为更多是作为 handler 使用，而非获取返回值。选中 select 的某个值。当提供的选择器完成选中后，触发 `change` 和 `input` 事件，如果没有元素匹配指定选择器，将报错。

- `selector` String，要查找的选择器
- `...values` String，查找的配置项。

#### page.setRequestInterception(Boolean)

> 是否启用请求拦截器，启用会激活 `request.abort`，`request.continue`，`request.respond` 方法。提供了修改页面发出的网络请求的功能。一旦启用请求拦截，每个请求都将终止，继续或相应。

```
const puppeteer = require('puppeteer');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setRequestInterception(true);

page.on('request', interceptedRequest => {
  if (interceptedRequest.url().endWith('.png') || interceptedRequest.url().endWith('.jpg')) {
    interceptedRequest.abort();
  } else {
    interceptedRequest.continue();
  }
})

await page.goto('https:www.baidu.com');
```

***启用请求拦截器会禁用页面缓存***

#### page.type(selector, text[, options])

> 返回 Promise，主要作为 handler 使用，内容的输入。每个字符输入后都会触发 `keydown`，`keypress/input` 和 `keyup` 事件，要点击特殊按键，比如 `control` 或 `arrowDown`，用 `keyboard.press`

- `selector` String，要输入内容的元素选择器。如果有多个匹配的元素，输入到第一个匹配的元素。
- `text` String，要输入的内容
-  `options` Object
  - `delay` Number，每个字符输入的延迟，单位是毫秒。默认 0

```
// 立即输入
page.type('#myInput', 'Hello');

// 输入变慢，模拟用户操作
page.type('#myInput', 'World', { delay: 100 });
```

***page.emulate 支持的更多设备详见 node_modules\puppeteer\lib\cjs\puppeteer\common\DeviceDescriptors.js***

## Keyboard

> keyboard 提供一个接口来管理虚拟键盘。高级接口为 `keyboard.type`，其接收原始字符，然后在页面上生成对应的 keydown, keypress/input 和 keyup 事件。为了更精细的控制虚拟键盘，可以使用 `keyboard.down`, `keyboard.up` 和 `keyboard.sendCharacter` 来手动触发事件，就好像这些事件是由真实的键盘生成的。

***支持的键名详见：node_modules\puppeteer\lib\cjs\puppeteer\common\USKeyboardLayout.js***


### methods

#### keyboard.sendCharacter(char)

- `char` String， 发送到页面的字符

> 返回 Promise，分发一个 `keypress` 和 `input` 事件。该方法不会发送 `keydown` 或 `keyup` 事件。

```
page.keyborad.sendCharacter('Hello World');
```

```
(async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: 1200
  })
  const page = await browser.newPage();
  await page.goto('http://localhost:3001');
  await page.focus('#keyboard');
  await page.keyboard.type('Hello World');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Space');
  await page.keyboard.sendCharacter('keyboard emulate!');
  await page.keyboard.down('Backspace');
})()
```

## Mouse

> Mouse 类在相对于视口左上角的主框架 CSS 像素中运行，每个 page 对象都有它自己的 Mouse 对象。

### Methods

#### mouse.click(x, y[, options])

- x Number
- y Number
- options
  - button String，`left`, `right` 或 `middle`，默认是 `left`
  - clickCount Number，默认是 1，详见 [UIEvent.detail](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  - delay Number，在毫秒内且在 mousedown 和 mouseup 之间等待的时间。默认是 0。
- retrun Promise

*mouse.move, mouse.down 和 mouse.up 的快捷方式。*

#### mouse.down([options])

#### mouse.move(x, y[, options])

#### mouse.up([options])

#### touchscreen.tap(x, y)

## Tracing

> 可以使用 tracing.start 和 tracing.stop 创建一个可以在 Chrome DevTools 或 timeline viewer 中打开的跟踪文件。

```
(async () => {
  try {
    const path = require('path');
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 800
    })
    const page = await browser.newPage();

    await page.tracing.start({
      path: path.resolve(__dirname, './json/trace.json')
    })
    await page.goto('http://localhost:3001');
    await page.tracing.stop();
  } catch (error) {
    throw Error(error);
  }
})()
```

## Dialog

> Dialog 对象通过 `dialog` 事件的页面分发。dialog 类型共包括 `alert`, `beforeunload`, `confirm` 或 `prompt`。

```
const puppeteer = require('puppeteer');
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log(dialog.message(), dialog.type());
    await dialog.dismiss();
    await browser.close();
  });
  page.evaluate(() => alert('1'));
})
```

## ConsoleMessage

> ConsoleMessage 对象由页面通过 `consosle` 事件分发。

## Frame

> 在每一个时间点，页面通过 page.mainFrame() 和 fram.childFrames() 方法暴露当前框架的细节。Frame 对象的生命周期由 3 个事件控制，它们通过 page 对象监听。

- `frameattached` - 当框架被页面加载时触发。一个框架只会被加载一次。
- `framenavigated` - 当框架 URL 改变时触发。
- `framedetached` - 当框架被页面分离时触发。一个框架只会触发一次。

## ExecutionContext

> 该类标识一个 JavaScript 执行的上下文。Page 可能有许多上下文。

- 每个 frame 都有“默认”的执行上下文，它始终在将帧附加到 DOM 后创建。该上下文由 frame.executionContext() 方法返回。
- Extensions 的内容脚本创建了其他执行上下文。

*除了页面，执行上下文可以在 worker 中找到。*

## JSHandle

> JSHandle 标识页面内的 JavaScript 对象。JSHandle 可以使用 page.evaluateHandle 方法创建。

```
const windowHandle = await page.evaluateHandle(() => window);
```

JSHandle 可以防止引用的 JavaScript 对象被垃圾收集，除非是句柄 disposed。当原始框架被导航或父上下文被破坏时，JSHandles 会自动处理。

## ElementHandle

*ElementHandle 类继承自 JSHandle。*

> ElementHandle 标识一个页面内的 DOM 元素。ElementHandles 可以通过 page.$(selector) 方法创建。

### Methods

#### elementHandle.$eval(selector, pageFunction, ...args)

- `selector` String，用于选取页面 DOM 元素的 CSS Selector
- `pageFunction` Funtion，在浏览器上下文中执行的函数
- `...args` Serializable|JSHandle 传递给 pageFunction 的参数
- returns Promise\<Serializable>

> 这个方法在元素中运行 `document.querySelector` 并将它作为第一个参数传递给 `pageFunction`。如果没有与 `selector` 匹配的元素，则该方法将抛出个错误。

```
const tweetHandle = await page.$('.tweet');
expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('1000');
```

#### elementHandle.boundingBox()

- returns Promise\<Object>
  - `x` Number，元素的 x 坐标
  - `y` Number, 元素的 y 坐标
  - `width` Number，元素的像素宽度
  - `height` Number，元素的像素高度

> 此方法返回元素的边界值（相对于主框架），如果元素不可见，则返回 null。

#### elementHandle.boxModel()

> 该方法付慧慧元素的盒模型，如果元素不可见，则返回 null。盒模型被表示为一组点；每个 Point 都是一个对象 `{x,y}`。盒模型的点按顺时针顺序。

```
(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 800
    })
    const page = await browser.newPage();
    await page.goto('http://localhost:3001');
    const keyboard = await page.$('#keyboard');

    const boundingBox = await keyboard.boundingBox();
    console.log(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
    // 输出：
    8 101 177 21

    const boxModel = await keyboard.boxModel();
    console.log(boxModel);
    // 输出：
    {
      content: [
        { x: 12, y: 104 },
        { x: 181, y: 104 },
        { x: 181, y: 119 },
        { x: 12, y: 119 }
      ],
      padding: [
        { x: 10, y: 103 },
        { x: 183, y: 103 },
        { x: 183, y: 120 },
        { x: 10, y: 120 }
      ],
      border: [
        { x: 8, y: 101 },
        { x: 185, y: 101 },
        { x: 185, y: 122 },
        { x: 8, y: 122 }
      ],
      margin: [
        { x: 8, y: 101 },
        { x: 185, y: 101 },
        { x: 185, y: 122 },
        { x: 8, y: 122 }
      ],
      width: 177,
      height: 21
    }
  } catch (error) {
    throw Error(error);
  }
})()
```

#### elementHandle.dispose()

> 该方法用于停止引用元素的句柄。

#### elementHandle.getProperties()

> 该方法返回一个包含属性名称作为键的映射和属性值的 JSHandle 实例。

返回 Promise\<Map>，更多 map 信息，详见[Map](https://es6.ruanyifeng.com/#docs/set-map#Map)

## Request

> 每当页面发送一个请求，可以被 puppeteer 页面监听到。

[Request](http://puppeteerjs.com/#?product=Puppeteer&version=v5.2.1&show=api-class-request)

- `request` 当请求发起后页面会触发这个事件
- `response` 请求收到响应的时候触发
- `requestfinished` 请求完成并且响应下载完成时触发
- `requestfailed` 请求失败时触发

*如果请求得到一个重定向的响应，请求会成功触发 requestfinished 事件，并且对重定向的 url 发起一个新的请求。*

## Response

> Response 类标识页面接收的响应。

[Response](http://puppeteerjs.com/#?product=Puppeteer&version=v5.2.1&show=api-class-response)

## SecurityDetails

> SecurityDetails 类标识通过安全连接，收到响应时的安全性详细信息。

[SecurityDetails](http://puppeteerjs.com/#?product=Puppeteer&version=v5.2.1&show=api-class-securitydetails)

## Target

> 通过 browser 类创建。browser.target()

[Target](http://puppeteerjs.com/#?product=Puppeteer&version=v5.2.1&show=api-class-target)