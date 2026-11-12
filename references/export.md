# 预览与导出

需要 Python 3 标准库，以及 Node.js、Playwright 与 Chromium/Chrome。字体本地打包，不使用远程字体或图床。

## 新建与编辑

```sh
python3 /path/to/arc-black-xhs-general/scripts/init.py /path/to/output
```

输出目录必须新建或为空。新模板只带字体、通用 HTML/CSS 与预览脚本；没有品牌、固定字标或旧插画。替换全部示例文字，按实际文章制作插画和可选英文主题词。

浏览器直接打开 `index.html` 可预览，不依赖 fetch。也可运行 `python3 -m http.server 8743 --bind 127.0.0.1`，端口占用就另选，不结束用户正在使用的服务。

## 依赖与渲染

使用已有 Playwright 的 Node 环境。Codex 桌面可调用 `load_workspace_dependencies`，把返回的 Node packages 路径传给 `NODE_PATH`。脚本不绑定某台机器的缓存目录，不自动安装依赖。

```sh
node /path/to/arc-black-xhs-general/scripts/render.cjs /path/to/output
python3 /path/to/arc-black-xhs-general/scripts/package.py /path/to/output
```

找不到浏览器时，将 `CHROME_PATH` 或 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 设置为实际存在的 Chrome/Chromium。英文主题效果工具使用相同的依赖查找方式，见 [wordmarks.md](wordmarks.md)。它必须接收由生图模型创作的字形图片，不能用字体排字代替。

渲染先写临时目录，全套检查和截图成功后才替换已有导出；失败写入 `review/render-check.json`、返回非零状态，旧导出保留。已有 `exports/` 必须含本工具的 manifest，否则拒绝覆盖。少页后重渲染会清理旧页，避免残留。

支持 `render.cjs <项目> --out <目录>` 和 `package.py <项目> --exports <目录>`。HTML 下载链接默认指向项目内 `exports/1080/`，独立输出时相应调整。

## 产物

```text
output/
  index.html, styles.css, viewer.js, assets/
  review/render-check.json
  exports/
    manifest.json
    1080/01-cover.png ...       1080×1440
    2160/01-cover.png ...       2160×2880
    contact-sheet.png
    preview-desktop.png
    preview-mobile.png
    publish-1080.zip
    publish-2160.zip
    editable-source.zip
```

文件名由 DOM 顺序和 `data-slug` 决定。打包时核对文件数量、真实 PNG 像素、最近一次渲染状态和源码哈希，拒绝陈旧图片。源码 ZIP 包含 HTML/CSS/JS 与本项目资产，不包含 node_modules、截图或旧版本导出。

## 检查范围

自动检查：画板尺寸、两种字重加载、图片读取与比例、文字越界、相邻正文块重叠、桌面与 390px 窄屏横向滚动、实际 PNG 尺寸，以及显式提供的主题词是否只含英文字母。默认无品牌不影响检查通过。装饰背景可以出血，正文不能出血。

人工检查：是否按文章生成配图、英文词义与字形、实心/镂空是否同源、装饰遮挡、阅读字号、留白、标点、事实和引语。查看联系图及密集内页、封面和结尾原尺寸。机器检查不代表用户已确认设计。

涉及生成功能的验收还须查看实际生图记录与原始生成文件，至少验证一份英文主题字形和两张不同语义的插画，并确认它们已进入 HTML 和最终 PNG。仅通过字体、SVG 或版式测试，不代表配图或字形生成已验证。

历史成品仍按其原有资源渲染；脚本保留旧 generator 的兼容识别，不自动迁移或修改已交付文件。
