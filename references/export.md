# 本地预览和导出

需要 Python 3 标准库，以及 Node.js、Playwright 和可用的 Chromium/Chrome。字体和图片都已本地打包，不需要图床、远程字体或固定预览服务器。

## 创建与编辑

```sh
python3 /path/to/arc-black-xhs/scripts/init.py /path/to/output
```

输出目录必须新建或为空；不会覆盖旧项目。复制后替换 `index.html` 的示例内容，增删页面，必要时调整 `styles.css`。模板中没有上一期成员、活动数据或已署名的引语。

浏览器直接打开输出的 `index.html` 即可预览，`viewer.js` 不依赖 fetch。也可以在输出目录运行 `python3 -m http.server 8743 --bind 127.0.0.1`，端口占用时换一个。不要结束用户正在使用的其他预览服务。

## 渲染

```sh
node /path/to/arc-black-xhs/scripts/render.cjs /path/to/output
python3 /path/to/arc-black-xhs/scripts/package.py /path/to/output
```

使用有 Playwright 的 Node 环境。在 Codex 桌面可先调用可用的 `load_workspace_dependencies`，将返回的 Node packages 路径传给 `NODE_PATH`；也可使用输出项目自身已有的 Playwright。脚本不会自动安装依赖或访问外部服务。

找不到浏览器时，把 `CHROME_PATH` 或 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 设置为实际存在的 Chrome/Chromium 可执行文件。脚本会先检查覆盖值，再检查 Playwright 的浏览器路径及常用系统路径；不复制开发者机器上的缓存版本号。

渲染到临时目录，全套检查和截图成功后才替换原有导出。已由本脚本生成的 `exports/` 可以重新渲染，旧页会被替换，避免少页后残留多余 PNG；若目标目录有其他文件且不含本工具的 manifest，会拒绝覆盖。失败时返回非零状态，并把原因写入当前 `review/render-check.json`，已有导出保持原样。

需要独立输出目录时支持 `render.cjs <项目> --out <目录>`，打包对应使用 `package.py <项目> --exports <目录>`。HTML 下载链接默认指向项目内 `exports/1080/`；使用独立目录时相应修改链接或在默认位置制作最终交付。

## 产物

```text
output/
  index.html, styles.css, viewer.js, assets/
  review/render-check.json
  exports/
    manifest.json
    1080/01-cover.png ...       1080×1440，发布版
    2160/01-cover.png ...       2160×2880，实际双倍像素
    contact-sheet.png          按当前页数排列
    preview-desktop.png
    preview-mobile.png
    publish-1080.zip
    publish-2160.zip
    editable-source.zip
```

`data-slug` 决定文件名后缀；页码按 DOM 顺序生成。`package.py` 按 manifest 核对文件数量、真实 PNG 像素和源文件哈希；最近一次渲染失败或源文件已改动时要求重新渲染，避免打包陈旧图片。源码 ZIP 包含 HTML/CSS/JS 和资产，不混入 node_modules、截图或旧版本导出。

## 有限的检查范围

自动检查覆盖画板尺寸、两种字重加载、图片读取与比例、正文区和文本越界、相邻正文块重叠、桌面与窄屏横向滚动，以及实际 PNG 尺寸。画板以外的背景字出血是有意的，不会当作文字溢出。

自动检查不判断装饰图层是否遮住文字。仍需查看联系图和原尺寸页面：检查字号观感、标点断行、留白、引语归属、页间节奏，尤其是结尾实心 Together 与邀请文字的关系。把实际通过的检查写进交付说明，机器通过不代表文案已被用户审核。
