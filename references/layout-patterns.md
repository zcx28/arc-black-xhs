# 内容与版式

按文章选择叙事、图文、对照、清单或引语，不把案例的活动结构当通用模板。一页一条主线；留白不够时拆页，不不断缩小正文。

## 页面容器

```html
<figure class="sheet">
  <div class="artboard-wrap">
    <article class="page editorial" data-slug="main-idea"
      data-title="本页中文标题" data-topic="A SHORT TOPIC.">
      <header class="page-header"></header>
      <div class="content">
        <h2>本页主张，<br><span class="cyan">关键部分。</span></h2>
        <!-- 按文章添加正文和本篇生成的插画。 -->
      </div>
      <footer class="page-footer"></footer>
    </article>
  </div>
  <figcaption></figcaption>
</figure>
```

`viewer.js` 自动计算页码和进度。默认页头只有页码，不需要品牌节点。

## 图文与结论

```html
<div class="lead-grid">
  <div class="prose">
    <p>从本篇整理出的背景。</p>
    <p>这一页的具体经历、论据或转折。</p>
  </div>
  <img class="lead-art" src="assets/article-scene.png"
       alt="本篇新生成的画面内容">
</div>
<p class="takeaway">这一页的核心判断，<br><span class="cyan">留在这里。</span></p>
```

`article-scene.png` 指已经为本篇生成并保存的实际文件，不是模板自带素材。按真实图片比例设置尺寸。无需插画的页面直接使用段落、留白与细线。

## 对照与引语

`.exchange`、`.exchange-row` 提供 115px / 剩余宽度的说话者双栏；`.quote` 为原话字号。只有输入中确有原话时才用引语，不把改述加引号，不误配说话者。

```html
<div class="exchange">
  <div class="exchange-row">
    <span class="speaker">原文说话者</span>
    <blockquote class="quote">原文完整引语。</blockquote>
  </div>
</div>
```

不需要说话者的观点比较，可自行使用两列与细分隔线，避免虚构“原话”。

## 清单与步骤

`.questions`、`.question-row` 适合并列要点，数量跟随文章；不固定三条或四条。

```html
<div class="questions">
  <section class="question-row">
    <span class="question-num">01</span>
    <div><h3>本篇要点</h3><p>解释、依据或行动。</p></div>
  </section>
</div>
```

## 人物介绍

仅在本篇有身份材料时用 `.people-grid` 与 `.person`，保留用户提供的头像与身份，不生成不实身份。长标签允许换行，人数多时拆页。

## 可选品牌与主题装饰

默认不配置品牌或背景图。用户指定品牌后才在 `body` 配置 `data-logo-one`、`data-logo-two` 和对应的 `data-name-one`、`data-name-two`，单 Logo 无乘号，双 Logo 才出现联名分隔符。

本篇英文短词的制作见 [wordmarks.md](wordmarks.md)。设置 `data-theme-word="WRITE"` 与 `data-backdrop="assets/theme-outline.svg"` 后，有正文的页面才自动加入背景；单页 `data-backdrop="off"` 可关闭。封尾实心主题词使用 `.theme-mark` 图像显式插入，位置随字形调整。
