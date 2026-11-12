# 生图生成的英文主题字形

主题词只用一个英文短词，按本篇的核心动作、状态或主张选择，避免无关英文与长句，不固定为 Together。字形必须用生图模型生成，不能用本地字体、CSS 文字或 SVG text 替代。中文标题与正文继续使用真实 HTML。

## 生成母版

明确调用当前可用的生图工具，单独生成“英文短词的实心字形资产”，与场景插画分开。把准确拼写写进提示词，依据文章语气选择手写笔势、连笔、几何构成或其他字形语言；不要只提供一个字体名让程序排字。

要求真透明背景、统一青绿实心笔画、完整字形与安全边距，不带其他文字、插画、阴影或背景。只生成一份字形母版，后续效果都从它派生。提示词示意：

```text
Create one original custom hand-lettered English word as an isolated graphic.
Exact text: "[chosen English word]" — verify every letter.
The word expresses [the core idea of this article].
Lettering direction: [the specific gesture, rhythm and character suited to the article].
Solid cyan #00F0D5 strokes, genuinely transparent background.
Keep all strokes and flourishes inside generous transparent margins.
No other text, logos, illustrations, border, watermark, shadow, glow or background.
Produce only the solid lettering master, not a solid/outline comparison sheet.
```

透明模式使用工具的真实透明选项。若透明输出有残留或杂点，可改用生图模型生成纯白字、纯黑底的干净母版，再按亮度派生透明；不能用程序字体替换它。生成后查看拼写、可读性、笔画连接、边缘和背景。不合格时使用生图编辑修正或重新生成；生图失败或不可用时明确标记未完成。

把原始生成 PNG 复制到本篇 `assets/theme-generated.png`，保留生成工具、提示词、用途与文件路径的记录。不要只引用缓存。

## 从生成图片派生实心与镂空

```sh
node /path/to/arc-black-xhs-general/scripts/make_wordmark.cjs Write /path/to/project/assets \
  --image /path/to/project/assets/theme-generated.png
```

纯白字/纯黑底母版使用相同命令加 `--mask luminance`。脚本必须接收由生图模型生成的 PNG，没有字体或自动排字入口。它通过图片的 alpha 或亮度形状构造 SVG 滤镜，输出：

- `theme-solid.svg`：用母版的形状蒙版显示完整实心笔画，背景透明；
- `theme-outline.svg`：同一蒙版的膨胀轮廓减去收缩内区，留下透明镂空；
- `theme-wordmark.json`：英文词、母版哈希、尺寸、颜色和效果参数。

两版嵌入相同的原始生成图片，使用相同 viewBox 与边距。亮度模式先将近白/近黑的蒙版值归一为实心/透明，避免生成图片中轻微明暗变化在镂空内部留下雾状残影。输出内部透明，不把黑色当成透明。它们是图像效果容器，不含 SVG text 或字体。已有同名输出时拒绝覆盖，可用新目录或 `--prefix` 区分方案。

可用 `--color '#00f0d5'` 和 `--stroke 4` 调整呈现。脚本需要 Playwright 与 Chromium，依赖方式见 [export.md](export.md)。它不生成字形、不替代生图，也不自动修复有杂物或复杂背景的母版。

## 放入 HTML

```html
<body data-theme-word="Write" data-backdrop="assets/theme-outline.svg">
  <img class="theme-mark" src="assets/theme-solid.svg"
       alt="Write" data-decorative="true">
</body>
```

有正文的页面按配置加入镂空背景；单页可设 `data-backdrop="off"`。实心图由 HTML 显式放在封面或结尾，不自动铺满全篇。

调整 `--theme-left`、`--theme-top`、`--theme-width`、`--theme-rotate`、`--theme-opacity`，使轮廓不妨碍阅读。实心字形与结尾行动文案留出距离。

## 验证

查看原始生成图及两版实际渲染，核对英文拼写、字形同源、镂空内部透明与完整边缘。涉及生成功能验证时，实际生成并嵌入字形和文章配图；没有调用生图的样张只能算排版或效果测试。
