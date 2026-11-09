# 插画资产

先查看对应 PNG 再使用，避免重复同一场景。素材表达讨论氛围，不代表新稿件中的真实人物或现场照片。

| 文件（在模板 assets 内） | 适合的场景 |
| --- | --- |
| `roundtable.png` | 横向四人圆桌交流；封面世界观 |
| `ai-market.png` | 两人围绕电脑讨论，产品与用户 |
| `cost-discussion.png` | 无人圆桌、两把蓝椅、白板和声波；讨论空间 |
| `process-discussion.png` | 团队围绕白板交流；协作与流程 |
| `growth-discussion.png` | 两人面对面谈话；反思、经验与成长 |
| `next-round.png` | 无人圆桌与空蓝椅；邀请、结尾、留白 |

头像和身份信息从本次输入获得，不包含在默认素材库。成员页面可以保留原头像色彩，周围的网格、文字、品牌和装饰仍对齐本套风格。

## 新场景提示词基准

把视觉参考图或已有场景作为风格参考，按本次主题替换最后一段场景描述。人物可有可无，不默认性别、人数或真实相貌；需要还原特定成员时使用其提供的照片。

```text
Create a refined editorial illustration asset, not a poster. Match the supplied visual references: very fine white contour lines on perfectly flat pure black #000000, cobalt blue #1550FF flat fills on a few chairs or garments, and one small cyan #00F0D5 accent. Unfilled objects and faces remain black with thin white outlines. Airy, sparse, thoughtful discussion atmosphere. One delicate orbit arc or a small speech bubble with an abstract audio waveform may connect the composition.

No 3D modelling, shading, grey gradients, glow, texture, sketch hatching, heavy outlines, framing rectangle, typography, logos, signatures, letters or numbers. Keep all artwork within the central 82% with generous black margins. Square canvas for an interior asset; adapt aspect ratio if the actual layout needs a wide scene.

Scene: [describe the conversation or a quiet discussion space relevant to the current content].
```

生成时填入具体场景，不把方括号留给工具。需要无人场景时明确 `NO PEOPLE`，例如空圆桌、蓝椅、薄白线白板、未写字的便签和电脑。不要把洗鞋、运送、箱子、小推车变成这个品牌的固定意象。

品牌、Together、标题和正文由既有资产和 HTML 实现，禁止夹在插画生成请求里。使用当前环境可用的图像工具并遵循其要求；这个 Skill 不绑定某个用户缓存路径，也不为普通文字排版强制重新生图。
