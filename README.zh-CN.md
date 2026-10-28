<p align="center">
  <img src="assets/readme/hero.svg" width="100%" alt="Teachable figures：通过预测、操作与解释来学习的交互教学技能。">
</p>

# Teachable figures · 交互教学图解

[English](README.md) · [简体中文](README.zh-CN.md) · **[在线体验 →](https://ywedai.github.io/teachable-figures/)**

把课文中的一个结论变成学习者可以操作的实验：先预测，改变一个条件，观察结果，再解释一个新情境。

这是一个 **agent skill（智能体技能）**，包含渲染示例与验证工具。既能生成独立 HTML 图解，也能适配已有应用的课程结构。

## 在线体验六个完整示例

![六个示例的实际截图：圆锥截面、胸腔示意、火箭发射、Transformer 数据流、明代曳撒与齿轮传动](assets/readme/examples.png)

**[打开示例目录 →](https://ywedai.github.io/teachable-figures/)** 无需安装。每页都有预测、操作、读数、重置、解释与迁移问题；下载 [examples 目录](examples/) 后，也可以直接打开 HTML 离线运行。

| 在线示例 | 可以探索什么 |
| --- | --- |
| [圆锥截面 · 3D](https://ywedai.github.io/teachable-figures/geometry-slices.html) | 旋转立体、调整截面高度，比较半径的线性变化与面积的平方变化。 |
| [人体胸腔 · 3D](https://ywedai.github.io/teachable-figures/human-anatomy.html) | 旋转图谱来源的人体网格、打开胸腔观察窗，检查肺、心脏、气道与单独标注的示意膈肌。 |
| [火箭发射模拟](https://ywedai.github.io/teachable-figures/rocket-launch.html) | 检查有实体结构的火箭剖面与组件拆解，再比较推力、起飞、燃尽与滑行。 |
| [Transformer 数据流](https://ywedai.github.io/teachable-figures/transformer-flow.html) | 逐步查看示例向量、Q/K/V、因果遮罩、注意力、残差归一化与 FFN。 |
| [明代曳撒结构](https://ywedai.github.io/teachable-figures/chinese-clothing.html) | 依据一件博物馆藏品，检查交叠衣襟、有明暗面的褶层与折返剖面。 |
| [齿轮传动比](https://ywedai.github.io/teachable-figures/gear-ratio.html) | 加入惰轮，区分输出转数的大小与旋转方向。 |

圆锥与胸腔使用空间坐标、旋转、投影和深度排序。胸腔采用 Human Reference Atlas 网格，另有明确标注的示意膈肌与检查用观察窗；火箭是一维理想模型；Transformer 使用公开说明的简化参数；服饰图把史料事实与示意重建分开标注。示例保留各自的教学语言，并非所有页面都有双语切换。

<details>
<summary>查看最初的齿轮教学实验</summary>

加入一个惰轮，输出就会变慢吗？在 12 齿主动轮与 24 齿输出轮的例子中，输入一圈，输出仍为半圈；惰轮改变旋转方向，不改变传动比的大小。

![两次齿轮实验的截图：输出都是半圈，惰轮改变方向；原生控件和计数器展示结果](assets/readme/gear-ratio.png)

这是理想模型的示意图，不模拟真实齿面接触。

</details>

## 安装与使用

把仓库克隆到智能体的技能目录。以本地 Codex 为例：

```sh
git clone https://github.com/ywEdAi/teachable-figures.git ~/.codex/skills/teachable-figures
```

也可以从 [最新 Release](https://github.com/ywEdAi/teachable-figures/releases/latest) 下载便携的 `.skill` 文件。

然后提出具体的教学任务：

```text
用 $teachable-figures 解释为什么加入惰轮不会改变最终传动比的大小。
我的误解是：每多一个齿轮，输出就一定更慢。
请生成独立 HTML，包含预测、一圈输入的计数、原生控件、重置与解释问题。
```

使用其他智能体时，让它读取 [SKILL.md](SKILL.md)，并提供课文、目标学习者和宿主项目。技能会先检查已有数据与组件约定，再决定如何接入。

## 先明确机制，再选择画法

教学规格先写清结论、误解、可改变的原因、可观察的结果与计算依据。一份模型共同驱动画面、读数、无障碍摘要和解释。

| 模式 | 适合表达 |
| --- | --- |
| 2D SVG | 分布、曲线、状态变化与短流程。 |
| 轻量等轴 SVG | 可以操作的按键、开关、抽屉与屏幕。 |
| 机械 SVG | 支架、关节、管线、剖面与拆解结构。 |
| 可旋转 3D | 需要通过旋转和遮挡变化理解的空间关系。 |
| 可选 WebGL | 确实需要它的波、热、光等场景。 |

先确定主体形态和用户要求的细节，再选能完成交互的渲染器。[渲染选择指南](references/rendering-selection.md) 将功能设备交给 iso-figure，将刚性机械结构交给 Anatomy，将有机形态和布料交给合适的参考网格或插图。画法仍服务于教学机制，例如解释传动比并不需要强制使用 3D。

## 评审与验证

[渲染融合评审](reviews/rendering-fusion-audit.md) 记录了最初示例的视觉缺陷，以及 v0.3.0 如何分别验收主体形态与教学交互。[v0.2.0 迭代报告](reviews/v0.2.0.md) 保留此前的几何修复、五个新增示例与检查结果。此前的 [UI/UX 评审](reviews/uiux.md) 和 [教学设计评审](reviews/pedagogy.md) 也保留供追溯。

轻量示例已修复输入框被快捷键拦截的问题，并加入原生控件与实时读数。合成器还增加了重置、静音、输入归属管理，以及闲置、页面隐藏、离屏或减少动态效果时停止的示波器。

turning-dial 的四项 3D 拥挤问题通过调整真实端子、连接点与插座盖几何修复。完整配置的 3D 审计中，各失败类别均为零；渲染引擎、审计阈值与排除规则保持不变。见 [完整原始输出](reviews/turning-dial-full-audit-v0.2.0.txt)。

```sh
npm ci
npm test
npm run test:browser
```

v0.3.0 的 4 项模型/规格检查与 21 项浏览器用例均通过；两个新几何准备脚本也已重建验证。此前 12 项上游明暗主题构建结果保留在 v0.2.0 报告中。浏览器检查使用已安装的 Google Chrome；如已安装 Playwright Chromium，可设置 `BROWSER_CHANNEL=chromium`。构建在临时副本中运行，不修改内置源文件。

较慢的完整 turning-dial 几何审计：

```sh
npm run audit:3d
```

检查范围包括模型、明暗主题构建、键盘输入隔离、原生控件、重置、移动端布局、减少动态效果及新增课程的交互。具体范围与缺口见 [当前评审](reviews/v0.2.0.md)。

## 来源、融合方式与许可证

这个技能以原有 **teachable-figures** 为教学基础，融合了两个上游渲染技能。原有部分提供结论与误解分析、预测 → 操作 → 解释流程、可复用配置、语言框架和 AI English Shift 宿主适配。

| 上游技能 | 融合的内容 | 固定版本 | 许可证 |
| --- | --- | --- | --- |
| [Anatomy · wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) | 机械实体、关节与管线、剖面与爆炸图、相机控制、3D/WebGL 技术及几何验证工具。内置于 `assets/anatomy/`。 | [`454a0ef`](https://github.com/wheresryan22/anatomy/tree/454a0ef801b6d9b905f08309d094491c7085b3dd) | [MIT · Ryan](assets/anatomy/LICENSE) |
| [iso-figure · MrBongoC/ai-iso-skill](https://github.com/MrBongoC/ai-iso-skill) | 等轴 SVG 投影、可用的按键/开关/显示屏、共享状态与渲染流程、便携 HTML 示例。内置于 `assets/iso-figure/`，工作流适配见 `references/simple-iso.md`。 | [`44b4da7`](https://github.com/MrBongoC/ai-iso-skill/tree/44b4da7714148eef547cc1b102e433472dfe3531) | [MIT · Tolga Cohce](assets/iso-figure/LICENSE) |

上游实际名称是 **Anatomy**；这里指解释性物体的渲染工具包，不是医学解剖图谱。本项目根据教学需要调整了上游约定：不强制零件数量，预测前不自动巡游，允许清晰的标签，提供原生控件与减少动态效果支持，并让画面与解释共用同一份模型。仓库还包含本地几何修复、无障碍改进、六个完整课程示例和评审工具。

[来源与融合决策](references/sources-and-fusion.md) 说明各部分的贡献边界；[来源清单](references/source-manifest.json) 记录完整提交号与本地改动。每个课程页面另列其科学或历史依据。

README 的设计工作流使用了 [oil-oil/beautify-github-readme](https://github.com/oil-oil/beautify-github-readme)。它用于文档呈现，与上述内置渲染技能分别列示。

人体胸腔还使用了 **[Human Reference Atlas / HuBMAP 参考网格](https://humanatlas.io/3d-reference-library)**，许可证为 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。它是领域数据来源，与渲染技能分别列示。[数据来源记录](assets/hra/provenance.json) 包含固定版本、原文件哈希、裁切、压缩与改色说明；另附 [重建方法](assets/hra/README.md)。

两个上游的完整 MIT 声明保留在 [Anatomy LICENSE](assets/anatomy/LICENSE) 和 [iso-figure LICENSE](assets/iso-figure/LICENSE)。这些许可适用于对应的上游贡献；本仓库未对原有课程材料、应用参考或截图额外授予新的许可证。

## 使用边界

- 上游 Anatomy 示例主要展示渲染技术。接入课程前，需要关闭启动及闲置后恢复的自动巡游；六个完整课程不自动播放。
- AI English Shift 适配面向特定宿主，使用前应核对宿主当前代码、注册结构与语言要求。
- 模型和浏览器检查通过，不等同于已证明学习效果。本次评审没有开展新手学习者实验或屏幕阅读器实测。
- 完整机械审计覆盖配置的 turning-dial 场景。圆锥和胸腔使用独立检查与选定视角检查，没有进行穷尽的网格相交证明。

## 示例部署

[GitHub Pages](https://ywedai.github.io/teachable-figures/) 发布 `gh-pages` 分支。从干净的 `main` 工作区更新在线示例：

```sh
git subtree push --prefix examples origin gh-pages
```

该命令把当前 `examples/` 目录发布到 `gh-pages`，分支更新后 Pages 会重新部署。示例没有运行时包依赖；`.nojekyll` 让 HTML 按原样发布。
