# arc-black-xhs

黑底、细白线、钴蓝与青绿强调的小红书 HTML 图文 Skill。适用于活动回顾、项目分享和访谈，按内容决定页数。

默认包含 tinuehub 续作 × RIFT、固定 Together 字标、半透明镂空背景字、本地 MiSans 字体及讨论场景插画。支持可编辑 HTML、1080×1440 发布图、2160×2880 高清图和 ZIP 打包。

## 下载与使用

从 [Releases](https://github.com/zcx28/arc-black-xhs/releases/latest) 下载 `arc-black-xhs.zip`，解压后将 `arc-black-xhs` 文件夹放入 `~/.codex/skills/`。

在 Codex 中调用：

```text
用 $arc-black-xhs 排版以下内容：……
```

完整制作规则见 [SKILL.md](SKILL.md)。

## 模板与导出

```sh
python3 scripts/init.py /path/to/output
```

编辑输出目录中的 `index.html`，替换示例文字并增删页面。浏览器直接打开 HTML 即可预览。

```sh
node scripts/render.cjs /path/to/output
python3 scripts/package.py /path/to/output
```

渲染需要 Node.js、Playwright 和 Chrome/Chromium；初始化及打包使用 Python 3 标准库。依赖配置和产物说明见 [导出文档](references/export.md)。

## 风格参考

下图是本套风格的原始圆桌案例，页数、成员和活动信息不作为后续稿件的默认内容。

![已确认的黑底图文风格](references/approved-carousel.png)
