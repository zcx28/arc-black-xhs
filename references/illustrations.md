# 按文章生成插画

新稿的插画由本篇内容驱动，不先翻旧素材再勉强配文。配图数量由内容和分页决定，纯文字页可以没有插画。

## 选择具体画面

为每张需要的图确定：它表达的论点或情绪、与文章有关的主体、动作与物件、人物是否必要、横竖比例和留白区域。可在制作草稿中记下对应页和提示词，便于复查；不要把这些制作信息放进发布图。

例如，写作主题可表现空白文档、记录灵感、散步、书与笔记之间的联系；旅行主题由文章中的地点与经历决定；项目复盘由真实流程与困难决定。这些是思路，不是固定资产菜单。没有人物或圆桌同样成立。

## 统一画风，不统一场景

同篇沿用细线粗细、黑底、蓝绿比例和人物造型语言；图像之间改变视角、动作或物件，避免每页重复同一构图。同篇已生成的合适素材可复用或作为后续参考。用户提供的真人照片、身份和指定图像优先遵循用户要求。

使用当前环境可用的图像生成能力。只生成插画资产，不把标题、正文、Logo 和主题词混进场景图。需要局部修改时优先针对原资产编辑。不可用时说明哪些配图仍未完成，不将历史素材标成新生成。

## 提示词起点

以下只约束画风，最后补入本篇的具体场景；不要把方括号原样交给工具。

```text
Create an editorial illustration asset, not a poster or a complete page.
Fine, delicate white contour lines on perfectly flat pure black #000000.
Use cobalt blue #1550FF flat fills on a few meaningful objects and one small cyan #00F0D5 accent.
Unfilled areas stay black. Airy, sparse composition with generous negative space.
Keep the main artwork away from the canvas edges.
No 3D modelling, shading, gradients, glow, texture, hatching, thick outlines, frame, typography, logos, signatures, letters or numbers.
Scene: [specific subjects, actions and objects derived from this article].
Composition: [aspect ratio, point of view and negative space needed by this page].
```

不要默认加入“围坐交流”“圆桌”“蓝色椅子”或轨道线；只有文章或构图需要时才出现。若需要透明资产，明确要求真实透明背景并保留 alpha；纯黑底资产在黑色画板中也可直接使用。

## 检查与存放

逐张查看语义是否对应文章、画面是否有不需要的字、细线是否清楚、蓝绿是否过量、构图是否适合排版。不要把艺术化图示写成真实人物、真实现场或研究证据。

使用的文件复制到本篇 `assets/`，设置准确的 `alt`；不要只引用工具缓存路径。导出前核对原始比例和实际截图。
