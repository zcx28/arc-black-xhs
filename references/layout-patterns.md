# 内容与版式

复用模板里的容器，按输入自由组合。每页约一条主线；标题说明论点或问题，段落提供背景，原话保留说话者，结论不把有分歧的讨论包装成公认事实。

## 页面容器

复制一整个 `.sheet`，修改属性和正文。`viewer.js` 自动计算页码、总数和进度；无需手写数字。不同页面可复用一个构图，但不要把变化只做成不同的标题。

```html
<figure class="sheet">
  <div class="artboard-wrap">
    <article class="page editorial" data-slug="main-idea"
      data-title="这一页的中文标题" data-topic="A SHORT ENGLISH LINE.">
      <header class="page-header"></header>
      <div class="content">
        <h2>中文标题，<br><span class="cyan">关键部分。</span></h2>
        <!-- 使用下方适合内容的模块 -->
      </div>
      <footer class="page-footer"></footer>
    </article>
  </div>
  <figcaption></figcaption>
</figure>
```

## 图文与结论

```html
<div class="lead-grid">
  <div class="prose">
    <p>从原稿整理出的背景与事实。</p>
    <p>继续交代关键转折，不把整篇塞进一个段落。</p>
  </div>
  <img class="lead-art" src="assets/cost-discussion.png"
    width="1280" height="1280" alt="空圆桌与白板">
</div>
<p class="takeaway">这一页的核心判断，<br><span class="cyan">留在这里。</span></p>
```

`.takeaway` 的自动上留白让结论对齐底部。内容不够时保留空白；内容过多时增页，不把正文和结论顶到一起。引用的图片应与实际论点相关，也可以没有图片。

## 观点对照

仅当输入确有原话时使用引语，不把下面的结构说明当作真实发言。`page dialogue` 为观点对照提供细线。

```html
<div class="exchange">
  <div class="exchange-row">
    <span class="speaker">说话者</span>
    <blockquote class="quote">来源中完整保留的原话。</blockquote>
  </div>
  <div class="exchange-row">
    <span class="speaker">另一位说话者</span>
    <blockquote class="quote">另一段可核对的原话。</blockquote>
  </div>
</div>
```

对照之间可加简短过渡，但不要误配名字、把编辑改写放进引号或把多人的观点拼成一段引语。长引语可以占整页，减少插画面积。

## 问题索引

`page agenda`、`.questions`、`.question-row` 适合讨论提纲或三四个并列要点。每行一个编号、一句主问题、可选一行补充。数量由内容决定；别为了结构齐整虚构问题。

## 人物介绍（输入有身份材料时）

`page team` 有无卡片的两列成员布局：`.team-title`、`.people-grid`、`.person`。两列间距 72px，行距 56px，头像 180px、账号 46px、领域 27px。

```html
<div class="people-grid">
  <section class="person">
    <div class="person-top">
      <img class="person-avatar" src="assets/provided-avatar.png"
        width="180" height="180" alt="用户提供的成员头像">
      <span class="person-index">01</span>
    </div>
    <h3>@用户提供的名字</h3>
    <p class="person-tags">领域一 / 领域二</p>
  </section>
</div>
```

保留提供的头像身份，做圆形裁切即可。长标签允许换行，必要时覆盖 `.person-tags { white-space:normal }`；不缩窄字体。人数较多可拆页，不固定四人，也不默认加入上一期的成员。

## 自定义品牌

默认无需配置。替换时可在 `<body>` 设置 `data-logo-one`、`data-logo-two`、`data-name-one`、`data-name-two`、`data-backdrop`。只有一个品牌时直接调整 `viewer.js` 的品牌插入部分。Together 实心图与背景轮廓要同时检查，避免旧品牌残留；保留原始图形比例。

仅个别页不需要背景字时，可设置 `data-backdrop="off"`。默认正文页保持半透明镂空字；封尾通过自身构图使用实心字标。
