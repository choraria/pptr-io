<div align="center" >

<h1>pptr.io</h1>

a free and open-source api that runs [puppeteer](https://developers.google.com/web/tools/puppeteer) as a service.

[![License](https://img.shields.io/github/license/choraria/pptr-io)](https://github.com/choraria/pptr-io/blob/main/LICENSE) [![vercel](https://img.shields.io/github/deployments/choraria/pptr-io/production?label=vercel&logo=vercel)](https://github.com/choraria/pptr-io/deployments/activity_log?environment=Production) [![puppeteer-core](https://img.shields.io/github/package-json/dependency-version/choraria/pptr-io/puppeteer-core)](https://www.npmjs.com/package/puppeteer-core) [![chrome-aws-lambda](https://img.shields.io/github/package-json/dependency-version/choraria/pptr-io/chrome-aws-lambda)](https://www.npmjs.com/package/chrome-aws-lambda) [![twitter](https://img.shields.io/twitter/follow/schoraria911?label=%40schoraria911&style=social)](https://twitter.com/intent/user?screen_name=schoraria911)

[![powered by vercel](https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg)](https://vercel.com?utm_source=pptr-io&utm_campaign=oss)

</div>

# table of contents

- [usage](#usage)
    1. [screenshot](#screenshot)
    2. [metrics](#metrics)
    3. [trace](#trace)
- [contributing](#contributing)
- [credits](#credits)
- [license](#license)
- [host your own](#host-your-own)

# usage

- base url: `https://pptr.io/`
- default path: `api/`
- endpoint: any one of the individual `.js` files in the [api](/api) folder
    - ignore the `index.js` file inside the `api` folder

## endpoints

### screenshot

- task: takes a screenshot of the input url
- class: [page.screenshot](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagescreenshotoptions)
- method: `GET`
- api: `https://pptr.io/api/screenshot?url=https://google.com/`
- source: [screenshot.js](/api/screenshot.js)

| optional params | type | description | default |
| --- | --- | --- | --- |
| `width` | number | width of the screenshot. | `1920` |
| `height` | number | height of the screenshot. | `1080` |
| `deviceScaleFactor` | number | device scale factor (can be thought of as DPR). | `1` |
| `fullPage` | boolean | when `true`, takes a screenshot of the full scrollable page. | `false` |
| `type` | string | can be either `jpeg`, `png` or `webp`. | `png` |

<details>
<summary>sample output of the screenshot endpoint</summary>

![screenshot](https://pptr.io/api/screenshot?url=https://google.com/)

</details>

### metrics

- task: fetch metrics of the page
- class: [page.metrics](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagemetrics)
- method: `GET`
- api: `https://pptr.io/api/metrics?url=https://google.com/`
- source: [metrics.js](/api/metrics.js)

<details>
<summary>sample output of the metrics endpoint</summary>

```json
{
    "Timestamp": 2469.885878,
    "Documents": 5,
    "Frames": 2,
    "JSEventListeners": 150,
    "Nodes": 391,
    "LayoutCount": 4,
    "RecalcStyleCount": 9,
    "LayoutDuration": 0.038393,
    "RecalcStyleDuration": 0.018054,
    "ScriptDuration": 0.316212,
    "TaskDuration": 0.745999,
    "JSHeapUsedSize": 8158228,
    "JSHeapTotalSize": 10993664
}
```

</details>

### trace

- task: get a timeline trace
- class: [page.tracing](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagetracing)
- method: `GET`
- api: `https://pptr.io/api/trace?url=https://netflix.com/`
- source: [trace.js](/api/trace.js)

View the trace in [timeline-viewer](https://github.com/ChromeDevTools/timeline-viewer) — https://chromedevtools.github.io/timeline-viewer/ (drag and drop the `trace.json` file on the browser)

# contributing

1. create a new issue describing what you have in mind.
    - challenge / problem statement
    - proposed approach on solution
2. repo owner will engage you and help validate the idea
3. once everything is agreed upon, feel free to frok the repo and start building your solution
4. finally, create a new pull request with the accepted, proposed changes

# credits

0. if it weren't for jarrod overson's [videos](https://www.youtube.com/channel/UCJbZGfomrHtwpdjrARoMVaA/search?query=Puppeteer), i might've probably not gotten the courage to start working with puppeteer.
1. props to the original idea via [pptraas.com](https://github.com/GoogleChromeLabs/pptraas.com) — although, i like my current domain name just the same ;)
2. huge thanks to [Salma | @whitep4nth3r](https://twitter.com/whitep4nth3r) for sharing insights on the [puppeteer <> vercel](https://www.contentful.com/blog/2021/03/17/puppeteer-node-open-graph-screenshot-for-socials/) blog post.

# license

```
MIT License

Copyright (c) 2021 Sourabh Choraria

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

# host your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchoraria%2Fpptr-io)