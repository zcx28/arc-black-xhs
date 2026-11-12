# arc-black-xhs-general

把中文文章制作成黑底、细白线、钴蓝与青绿强调的小红书图文。分页、插画和英文主题词随文章而定，默认无品牌。插画与英文主题字形由生图模型创作，实心和镂空效果来自同一张字形母版。

## 下载与使用

从 [Releases](https://github.com/zcx28/arc-black-xhs/releases/latest) 下载 `arc-black-xhs-general.zip`。解压后，将 `arc-black-xhs-general` 文件夹放入 `~/.codex/skills/`，然后在 Codex 中调用：

```text
用 $arc-black-xhs-general 把这篇文章做成黑底白线的小红书图文：……
```

完整制作规则见 [SKILL.md](SKILL.md)。

## 模板与导出

在 Skill 目录下运行：

```sh
python3 scripts/init.py /path/to/output
```

编辑输出目录中的 `index.html`，按文章调整页数和图文。可在浏览器中直接预览。完成后运行：

```sh
node scripts/render.cjs /path/to/output
python3 scripts/package.py /path/to/output
```

产物包括 1080×1440 发布图、2160×2880 高清图、联系图和可编辑源码 ZIP。初始化与打包需要 Python 3，渲染需要 Node.js、Playwright 和 Chrome 或 Chromium。配置见 [导出说明](references/export.md)。

## 风格参考

原始圆桌案例供观察线条、对比度和留白。新版模板默认无品牌，配图和主题词按文章重新创作。

![黑底白线图文参考](references/approved-carousel.png)
