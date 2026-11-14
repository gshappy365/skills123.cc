# -*- coding: utf-8 -*-
"""How-to 十七篇（四组）+ 常见问题。每篇一个场景、一段能照抄的话、一句判断标准。"""

HOWTO = [
    # ---------- A 看懂一个应用 ----------
    dict(
        slug="electron-app", title="看一个 Electron 应用", nav="看 Electron 应用", group="A · 看懂一个应用",
        minutes=8, order=1,
        desc="最常见也最容易上手的入口：不用装引擎，静态就能看清模块、主进程边界和 IPC 通道。",
        body=r"""
## 什么时候用

你只有一个 `.app` / `.exe` / 解包出来的目录，想知道它的界面逻辑和功能实现。八成情况下这就是最好的起点。

## 照抄这段话

```
用 rea 分析 <路径>。先只做三件事：
1. 告诉我它是不是 Electron、入口在哪、有哪些模块；
2. 分清主进程、渲染进程、preload 各自的文件；
3. 列出渲染进程到主进程的 IPC 通道名。
先不要解释业务，也不要猜。
```

## 你会看到什么

| 内容 | 形状 |
| --- | --- |
| 应用类型 | Electron / 纯 Node / 其它 |
| 模块清单 | 每个模块的文件、依赖、被谁引用 |
| 边界 | 谁在 Node 环境里、谁在浏览器沙箱里 |
| IPC 通道 | 通道名 + 两端各自的引用位置 |

## 三个判断点

- **有没有 preload。** 有，说明它做了桥接控制；没有，可能开了 `nodeIntegration`，那整个渲染进程都能直接调 Node。
- **通道名是不是字符串常量。** 是，你能直接搜到；是变量拼的，就得顺着赋值追。
- **`app.asar` 有没有 unpack。** 有 `app.asar.unpacked` 说明有原生模块或者要外部读取的文件。

## 不对怎么办

| 现象 | 处理 |
| --- | --- |
| 说不是 Electron | 看 `Contents/MacOS/` 下的可执行文件类型，可能是 Tauri / 原生 / Qt |
| 只有一个大 bundle | 走 [看打包过的前端](/howto/js-bundle/) |
| 模块名全是数字 | 没开 source map，只能看结构 |

## 下一步

拿到通道名之后，去 [追一条完整功能链](/guide/4-first-case/)。
""",
    ),
    dict(
        slug="js-bundle", title="看打包过的前端", nav="看打包过的前端", group="A · 看懂一个应用",
        minutes=7, order=2,
        desc="webpack/vite 打成一坨的产物怎么看：模块图、导出形状、source map 有没有。",
        body=r"""
## 什么时候用

你手上是一个 `dist/` 目录、一个 `bundle.js`、或者网页里加载的某个 `chunk`，想知道它由哪些模块组成。

## 照抄这段话

```
分析 <目录或文件>。我要知道：
1. 打成几个 chunk，每个 chunk 里的模块清单和大小；
2. 模块之间的引用关系（谁 import 谁）；
3. 有没有 source map，能还原到什么程度；
4. 有哪些导出（export）和它们的形状。
不要尝试反混淆，先给我结构。
```

## 你会看到什么

- 模块粒度：`node_modules` 的第三方包通常是一整个模块，业务代码按文件切。
- 引用关系：一株从入口出发的树，能看出哪个功能落在哪个 chunk。
- 导出形状：`compare_javascript_export_shapes` 专门干这个，比较两个版本很有用。

## 三个判断点

- **有没有 `//# sourceMappingURL`。** 有且文件在，就能还原到接近源码。
- **压缩后还有没有可读字符串。** 有，说明只做了压缩没做混淆。
- **vendor 和业务代码分开了吗。** 分开了，你只需要看业务那部分。

## 不对怎么办

| 现象 | 处理 |
| --- | --- |
| 说「没有模块结构」 | 可能是单文件 IIFE，只能按函数切 |
| 全是 `a.b.c` 这种短名 | 混淆过，先看字符串和常量 |
| source map 指向远程地址 | 拿不到，改看结构 |

## 下一步

结构清楚了，去看 [从字符串切进去](/howto/strings/)。
""",
    ),
    dict(
        slug="dotnet", title="看一个 .NET 程序集", nav="看 .NET 程序集", group="A · 看懂一个应用",
        minutes=6, order=3,
        desc="不用引擎、不用运行：读程序集身份、成员清单，按类型钻进去。",
        body=r"""
## 什么时候用

目标是 `.dll` / `.exe`，加壳不重，你想知道它有哪些类型、哪些方法、部署成什么形式（单文件？AOT？）。

## 照抄这段话

```
检查 <程序集路径>：
1. 它的身份（名字、版本、目标框架）和部署形式；
2. 列出一级类型，按命名空间分组；
3. 我关心 <某个功能>，找出最可能承载它的类型，并列出它的成员。
```

## 命令行等价物

```
rea inspect-managed-artifact /绝对路径/Assembly.dll --json
rea inspect-managed-members /绝对路径/Assembly.dll --json
rea inspect-managed-members /绝对路径/Assembly.dll --type Example.Parser --json
```

## 你会看到什么

| 层次 | 内容 |
| --- | --- |
| 身份 | 程序集名、版本、目标运行时 |
| 部署形式 | 普通 DLL / 单文件 bundle / NativeAOT |
| 类型 | 命名空间 + 类型名 + 基类 |
| 成员 | 方法签名、字段、属性 |

## 判断点

- **单文件 bundle。** 成员能列，但要拆出内部程序集才能逐个看。
- **NativeAOT。** 元数据大部分没了，得走原生分析那一路。
- **混淆过。** 类型名是 `A.B.C`，靠字符串和调用来找。

## 下一步

要比较两个版本，去 [比较两个版本](/howto/compare-versions/)。
""",
    ),
    dict(
        slug="apk", title="看一个安卓 APK", nav="看安卓 APK", group="A · 看懂一个应用",
        minutes=8, order=4,
        desc="清单、资源、界面文案、代码四条线；哪些不用真机，哪些必须真机。",
        body=r"""
## 什么时候用

你有一个 `.apk` / `.xapk`，想知道它的界面结构、权限、用到的服务，或者某个界面是怎么拼出来的。

## 照抄这段话

```
分析 <apk 路径>：
1. 包名、版本、权限、声明的组件（activity/service/receiver/provider）；
2. 资源里有没有可疑的硬编码地址或密钥；
3. 按界面文案找 <某个功能> 落在哪个 activity；
4. 告诉我哪些结论需要真机验证。
先不要脱壳，也不要跑它。
```

## 不需要真机能拿到什么

| 内容 | 怎么拿 |
| --- | --- |
| 清单 | `inspect_artifact` / Apktool 解出来的 `AndroidManifest.xml` |
| 资源 | Apktool 还原的 `res/` |
| 代码结构 | JADX（要 `REA_JADX_MCP_JAR`） |
| 原生库 | 解出来的 `lib/<abi>/*.so`，再走原生分析 |

## 需要真机 / 模拟器的

- 运行时才决定的逻辑（动态加载的 dex、服务端下发的配置）；
- 加固 / 脱壳后的真实代码；
- 真实网络请求与证书固定行为。

工具：`inspect_adb_client`、`inspect_apktool_client`、`capture_process_scenario`。

## 判断点

- **有没有 `lib/` 目录。** 有 `.so`，核心逻辑可能在原生层。
- **Flutter / RN / Unity。** 目录结构会露馅，纯 Java 逆向收益很低。
- **加固壳。** `assets/` 里通常有明显特征，先判断值不值得继续。

## 下一步

原生库那部分，看 [定位一个功能](/howto/native-feature/)。
""",
    ),
    dict(
        slug="website", title="看一个网站", nav="看一个网站", group="A · 看懂一个应用",
        minutes=8, order=5,
        desc="浏览器抓取怎么用、能拿到什么、为什么它比静态分析更接近真相但也更吵。",
        body=r"""
## 什么时候用

你想知道一个网页应用的接口、脚本来源、某个交互发了什么请求——而这些只有跑起来才看得见。

## 照抄这段话

```
用 rea 打开 <url>，然后：
1. 只做被动观察，不要提交表单、不要点购买；
2. 列出页面加载的脚本和它们的来源；
3. 点一次 <某个安全操作>，把触发的请求列出来（方法、路径、参数名，值可以打码）；
4. 告诉我哪些结论来自静态脚本、哪些来自运行时。
```

## 你会看到什么

| 内容 | 来源 |
| --- | --- |
| 脚本清单与归属 | 运行时抓取 |
| 请求/响应 | 运行时抓取（HAR） |
| 接口形状 | 静态脚本 + 运行时对照 |
| 前后端边界 | 两者对照才准 |

## 三条纪律

1. **只碰你有权碰的站点。** 自己的、测试环境、明确授权的。
2. **不要触发有副作用的操作。** 下单、删除、发消息，一律不点。
3. **值要打码。** token、手机号、地址，写报告时去掉。

<div class="tu-note tu-note--warn">
<strong>抓取会真的发出请求</strong><p>它用的是你的网络和你的身份。别对第三方生产环境做压力式操作，也别把抓到的凭证贴进任何文档。</p>
</div>

## 静态和运行时的差别

| | 静态 | 运行时 |
| --- | --- | --- |
| 能看到什么 | 代码里写了什么 | 实际发了什么 |
| 会漏什么 | 动态拼接的 URL | 没走到的分支 |
| 噪声 | 低 | 高 |

两者对不上是常态。`compare_static_and_observed_endpoints` 就是干这个的——它会告诉你「代码里声明了这个接口，但这次没调用」。

## 下一步

要留存，导出成 bundle，见 [命令行](/guide/7-cli/)。
""",
    ),
    dict(
        slug="native-feature", title="定位一个原生功能", nav="定位一个原生功能", group="A · 看懂一个应用",
        minutes=10, order=6,
        desc="有引擎之后怎么找：从字符串、导入符号、调用链三条路收敛到那个函数。",
        body=r"""
## 什么时候用

目标是 Mach-O / ELF / PE，功能在原生代码里，你装了 Hopper 或 Ghidra。

## 照抄这段话

```
用 <hopper|ghidra> 打开 <路径>。
我要找处理 <某个功能> 的函数。按这个顺序来：
1. 先搜相关字符串，列出引用它们的函数；
2. 再看导入符号里跟 <功能域> 相关的（比如音视频、加密、网络）；
3. 从入口往下追调用链，只保留真正做判断的那几层。
每一步告诉我你排除了什么、为什么。
```

## 三条路，哪条先走

| 起点 | 什么时候最有效 | 工具 |
| --- | --- | --- |
| 字符串 | 有界面文案、错误提示、格式名 | `search_strings` → `resolve_containing_procedure` |
| 导入符号 | 用了系统/第三方库（`av_*`、`SSL_*`、`sqlite3_*`） | `procedure_references` / `xrefs` |
| 调用链 | 知道入口（按钮回调、HTTP 处理） | `get_call_graph` / `trace_call_path` |

## 你会看到什么

- 一个或几个候选函数，带地址和伪代码；
- 每个候选的可信度（直接看到 vs 推断）；
- 被排除的路径和理由——这一段最值钱。

## 判断点

- **函数名是 `FUN_0010a3c0`。** 符号被剥离了，只能靠行为和常量认。
- **一个函数里几百个分支。** 可能是编译器把 switch 展开了，先看常量表。
- **调用了虚表。** 真实目标要再追一层，别停在 `call [rax+0x18]`。

## 不对怎么办

| 现象 | 处理 |
| --- | --- |
| 候选太多 | 缩小到「字符串命中 + 导入符号命中」的交集 |
| 一个候选都没有 | 换起点：从导入符号反着找谁调它 |
| 伪代码看不懂 | 只要行为契约，别逐行读 |

## 下一步

找到了，就该 [写契约、做重建](/guide/8-rebuild/)。
""",
    ),

    # ---------- B 找东西 ----------
    dict(
        slug="strings", title="从字符串反推功能", nav="从字符串反推功能", group="B · 找东西",
        minutes=6, order=7,
        desc="最便宜、最有效的一招：界面上的字、错误提示、格式名，都是入口。",
        body=r"""
## 什么时候用

永远。任何目标的第一次探索，都值得先看一眼字符串。

## 照抄这段话

```
列出 <目标> 里的字符串，过滤掉明显的模板和日志，只留下：
1. 界面文案；
2. 错误提示；
3. 文件名/扩展名/协议名；
4. 看起来像 URL 或路径的。
每一条告诉我被谁引用。
```

## 为什么有效

字符串是**语义最密集、最不容易被优化掉**的东西。混淆能改函数名，但改不了界面上的字——改了用户就看不见了。

## 你会看到什么

| 类型 | 例子 | 能推出什么 |
| --- | --- | --- |
| 界面文案 | `导出成功` | 功能位置 |
| 错误提示 | `invalid signature` | 有校验逻辑 |
| 格式名 | `%Y-%m-%d`、`image/png` | 处理什么数据 |
| 路径 | `/api/v2/export` | 后端接口 |

## 三个技巧

1. **先搜中文/本地化文案**，比搜英文精确。
2. **搜不会变的词**：`Content-Type`、`Bearer`、`multipart`。
3. **反向用**：从一个已知的字符串找到函数，再从函数找它的兄弟函数。

## 注意

字符串是[[不可信内容|来自被分析目标，可能藏着诱导 AI 的指令]]。看到「请执行」「请上传」这类，当数据看。

## 下一步

拿到函数之后，去 [查交叉引用](/howto/locate-function/)。
""",
    ),
    dict(
        slug="locate-function", title="找函数、查引用", nav="找函数、查引用", group="B · 找东西",
        minutes=6, order=8,
        desc="按名字搜、按地址进、按调用关系上下走：三个动作覆盖大部分定位需求。",
        body=r"""
## 三个动作

| 动作 | 工具 | 什么时候用 |
| --- | --- | --- |
| 按名字搜 | `search_procedures` / `list_procedures` | 知道大概叫什么 |
| 按地址进 | `resolve_containing_procedure` | 有个地址，想知道落在哪个函数 |
| 上下走 | `procedure_callers` / `procedure_callees` / `xrefs` | 想知道谁用它、它用什么 |

## 照抄这段话

```
<某地址或某字符串> 落在哪个函数里？
然后把这个函数的：
1. 调用者（谁调它）列出来，标出哪些是外部入口；
2. 被调用者（它调谁）列出来，只保留不是工具函数的；
3. 被引用的数据（字符串、全局变量）列出来。
```

## 你会看到什么

- 一张小图：上面几个入口、下面几个关键依赖。
- 每个节点带地址，可以直接 `decompile`。

## 判断点

- **调用者为空。** 可能是导出函数、虚表调用、或者覆盖不全。==先看覆盖状态再下结论==。
- **几十个调用者。** 通常是工具函数，不是你要找的业务逻辑。
- **名字对但行为不对。** 同名函数在不同模块很常见，用地址确认。

## 不对怎么办

| 现象 | 处理 |
| --- | --- |
| 搜不到名字 | 符号被剥离，改从字符串或导入符号切 |
| 引用指向一个跳板 | 跟到 `jmp` 目标，那是真实函数 |
| 说是外部函数 | 那是导入，去看导入表 |

## 下一步

要把整条链讲清楚，去 [追一条功能链](/howto/trace-feature/)。
""",
    ),
    dict(
        slug="trace-feature", title="追一条功能链", nav="追一条功能链", group="B · 找东西",
        minutes=8, order=9,
        desc="trace_application_feature 怎么用：给它一个功能，拿回一条带证据的路径。",
        body=r"""
## 什么时候用

你已经知道几个点（字符串、函数、接口），想把它们串成一条「从触发到结果」的链路。

## 照抄这段话

```
用 trace_application_feature 追 <功能名>。
起点是 <字符串或函数>，终点应该是 <写文件 / 发请求 / 弹窗>。
要求：
1. 每跳标出依据（字符串引用、调用关系、数据流）；
2. 明确哪几跳是推断；
3. 没追到的地方记成 unknown。
```

## 你会看到什么

一个 `feature-trace` 视图：

| 列 | 内容 |
| --- | --- |
| 跳 | 序号 |
| 位置 | 模块 / 函数 / 地址 |
| 依据 | 调用、引用、数据流 |
| 可信度 | 直接看到 / 推断 |
| 备注 | 为什么排除别的分支 |

## 判断点

- **路径是「观察图内最短」。** 官方文档明确说过：没被发现的调用可能产生更短的路径。所以别把它当唯一真相。
- **有没有 `coverage`。** `partial` 下的路径只能当参考。
- **有没有分叉。** 真功能通常有错误分支，一条直线往往是漏了。

## 用它的三种姿势

1. **正向**：从 UI 事件追到副作用。
2. **反向**：从副作用（写文件、发请求）追到触发点。
3. **对照**：两个版本各追一次，看链路在哪断。

## 下一步

想比较版本，去 [比较两个版本](/howto/compare-versions/)。
""",
    ),
    dict(
        slug="compare-versions", title="比较两个版本", nav="比较两个版本", group="B · 找东西",
        minutes=7, order=10,
        desc="「这次更新改了什么」：产物比对、函数匹配、导出形状比对，三种粒度。",
        body=r"""
## 三种粒度，先选一种

| 你想知道 | 用什么 | 粒度 |
| --- | --- | --- |
| 多了/少了哪些文件 | `compare_artifacts` | 产物 |
| 哪些函数变了 | `match_native_functions` / `compare_functions` | 函数 |
| 接口/导出变了没 | `compare_javascript_export_shapes` | 形状 |
| 整体行为变了吗 | `compare_application_versions` / `find_changed_behavior` | 行为 |

## 照抄这段话

```
比较 <旧版本> 和 <新版本>：
1. 先做产物级比对，列出新增/删除/改动的文件；
2. 在 <某个模块> 上做函数级匹配，列出新增、删除、改签名的函数；
3. 只把「可能影响行为」的改动挑出来，其余归到「结构性变化」。
最后告诉我：这次更新像是在修 bug、加功能，还是只改了资源。
```

## 你会看到什么

- 一张差异表，带匹配依据（哈希、签名、调用图相似度）。
- 明确标出「匹配不上」的部分——那通常是真正变化最大的地方。

## 判断点

- **函数匹配是启发式的。** 匹配不上 ≠ 新增，可能是重排或内联。
- **改资源不算改行为。** 图片、文案变了，逻辑可能一模一样。
- **版本号变了但代码没变**：可能是重新打包。

## 命令行做法

```
rea compare old.json new.json --json
rea compare-artifacts '{"left":{"kind":"evidence-file","path":"old.json"},"right":{"kind":"evidence-file","path":"new.json"}}' --json
```

## 下一步

如果差异落在发布配置上，去看 [发布暴露审计](/howto/release-exposure/)。
""",
    ),

    # ---------- C 发布与自动化 ----------
    dict(
        slug="release-exposure", title="发布前暴露审计", nav="发布暴露审计", group="C · 发布与自动化",
        minutes=7, order=11,
        desc="你打包出去的东西，把什么留给了别人：source map、调试符号、fuse 配置、凭证。",
        body=r"""
## 什么时候用

你要把一个桌面应用发出去之前。这是少数**不需要看别人代码、纯粹为自己好**的用法。

## 一条命令

```
rea audit-release-exposure ./dist/你的应用.app --json
```

带阈值（达到 high 就退出码 3，能直接卡住流水线）：

```
rea audit-release-exposure ./dist/你的应用.app --fail_on high --json
```

## 它会看什么

| 类别 | 例子 |
| --- | --- |
| 源码与映射 | 打包进去的 source map、未压缩源码 |
| 符号与调试 | 调试符号、断言、详细的错误堆栈 |
| Electron 配置 | fuse 是否还允许调试、`nodeIntegration` |
| 凭证 | 硬编码的 key、token、内网地址 |
| 元数据 | 内部版本号、构建路径、注释 |

## 结果怎么读

每条检查有严重级别。`--fail_on` 只影响退出码，不改变结果内容：

| 退出码 | 意思 |
| --- | --- |
| 0 | 跑完了 |
| 3 | 至少一条达到你设的阈值 |
| 1 | 没跑成 |

==未知或没评估的检查不会让退出码变 3==——它们是「没看」，不是「看了没问题」。

## 常见的四条修复

1. 生产构建关掉 source map（或者只上传到错误监控，不发包）。
2. 剥符号（`strip`），关掉断言。
3. Electron：把 `EnableNodeCliInspectArguments`、`RunAsNode` 这类 fuse 关掉。
4. 密钥全部移到运行时注入，不要编进 bundle。

## 放进 CI

```
- run: npx -y rea-agents@latest audit-release-exposure ./dist --fail_on high --json > exposure.json
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: exposure, path: exposure.json }
```

## 下一步

顺带看看 [二进制加固](/howto/hardening/)。
""",
    ),
    dict(
        slug="hardening", title="检查二进制加固", nav="检查二进制加固", group="C · 发布与自动化",
        minutes=5, order=12,
        desc="ELF/PE/Mach-O 的加固项一次看全：栈保护、PIE、RELRO、签名、ASLR 相关位。",
        body=r"""
## 什么时候用

你在发一个原生二进制，或者评估别人的二进制做得扎不扎实。

## 一条命令

```
rea inspect-binary-hardening /绝对路径/程序 --json
```

大文件可以设上限：`--max-file-bytes`。

## 你会看到什么

| 平台 | 常见项 |
| --- | --- |
| ELF | PIE、NX、栈保护、RELRO、Fortify |
| PE | ASLR（DYNAMICBASE）、DEP（NXCOMPAT）、CFG、签名 |
| Mach-O | PIE、栈保护、 hardened runtime、签名与公证状态 |

## 怎么用这份清单

- **给自己**：把它当成发布前的一张勾选表，缺哪项补哪项。
- **给别人**：这是「这个程序工程上做得好不好」的快速信号，不是安全性结论。

<div class="tu-note tu-note--warn">
<strong>别过度解读</strong><p>加固项齐全 ≠ 没有漏洞；缺一项 ≠ 能被利用。它只说明编译和打包时的选择。</p>
</div>

## 下一步

要连签名和证书一起看，`inspect-pe-certificates`、`inspect_signature`。
""",
    ),
    dict(
        slug="ci", title="在 CI 里跑", nav="在 CI 里跑", group="C · 发布与自动化",
        minutes=7, order=13,
        desc="静态分析进流水线的三个动作：装对、跑对、把 JSON 留下来。",
        body=r"""
## 最小可用的一条流水线

```
- uses: actions/setup-node@v4
  with: { node-version: '22.23.4' }

- run: sudo apt-get update && sudo apt-get install -y procps   # Linux 必需

- run: npx -y rea-agents@latest analyze-javascript-application ./dist --json > app-graph.json

- run: npx -y rea-agents@latest audit-release-exposure ./dist --fail_on high --json > exposure.json

- uses: actions/upload-artifact@v4
  if: always()
  with: { name: rea-evidence, path: '*.json' }
```

## 三个要点

**一、Node 版本要卡准。** 22.23.4 以下直接不支持。用 `22.23.4` 或更高的 22/24，别写 `22`。

**二、Linux 要 procps。** 缺了 `ps`，Ghidra、JADX、静态 JS 分析会在子进程启动前被拒。

**三、JSON 要留下。** 终端日志会被截断、会过期；JSON 才能事后对比。

## 需要引擎的话

CI 里跑原生分析成本高：

| 方案 | 代价 |
| --- | --- |
| 装 Ghidra + JDK | 镜像大，冷启动慢 |
| 用快照复用 | 第一次贵，之后便宜 |
| 只在需要时跑 | 用路径过滤触发 |

Ghidra 在 Linux 无人值守可以跑 demo 模式；Hopper 在 macOS 需要同一用户会话点掉首次对话框，不适合无人值守。

## 时间预算

按「导入 + 分析」给，不是按「执行一个命令」给。一个 50 MB 的二进制，Ghidra 可能吃掉十几分钟。

```
env:
  REA_GHIDRA_STARTUP_TIMEOUT_MS: '1800000'
```

## 示例仓库

官方仓库里有 `examples/github-actions`，是一个可重复的静态分析例子，可以直接拿去改。

## 下一步

排错看 [没装引擎怎么办](/howto/no-engine/)。
""",
    ),

    # ---------- D 排错与省钱 ----------
    dict(
        slug="no-engine", title="没装引擎怎么办", nav="没装引擎怎么办", group="D · 排错与省钱",
        minutes=6, order=14,
        desc="一个引擎都没有时，你依然能做完的六件事，以及哪一类目标必须等引擎。",
        body=r"""
## 先看你能用什么

```
rea providers --json
```

返回里 `capabilities` 每一项带 `available`。不需要引擎就能用的通常是这几个：

| provider | 能干什么 |
| --- | --- |
| `native-macos` | Mach-O / plist / 签名 / 架构 / 反混淆 Swift 名 |
| `rea-artifact-graph` | 拆归档、container 清单 |
| `rea-dotnet-static` | .NET 程序集与成员 |
| `sqlite` | 读数据库快照 |

## 六件不需要引擎的事

1. 判断一个应用是什么做的（Electron / Tauri / Qt / 原生）；
2. 看前端的模块结构与导出形状；
3. 读 .NET 程序集的类型和成员；
4. 拆 `.asar`、`.zip`、`.pkg`、`app.asar.unpacked`；
5. 读 plist、签名、架构列表；
6. 做发布暴露审计。

## 必须等引擎的

- 反编译（`decompile` / `procedure_pseudo_code`）；
- 原生函数级搜索与调用图；
- 原生二进制里的算法还原。

## 错误长什么样

```
{"error": {"code": "capability_unavailable",
           "details": {"selection_reason": "provider_unavailable",
                       "candidate_ids": ["ghidra", "hopper"]}}}
```

读法：这事需要 provider，但候选的都不可用。修哪一个都行，去 [选引擎](/guide/3-engine/)。

## 临时替代

只看汇编的话，`objdump` / Rizin 这条路不需要装引擎：

```
rea instructions /绝对路径/程序 --json
```
""",
    ),
    dict(
        slug="engine-timeout", title="引擎超时怎么办", nav="引擎超时怎么办", group="D · 排错与省钱",
        minutes=6, order=15,
        desc="分清楚是启动超时、分析超时还是反编译超时，三种改法不一样。",
        body=r"""
## 先分清是哪一种

| 现象 | 阶段 | 改哪个 |
| --- | --- | --- |
| 一直 `starting`，最后失败 | 引擎启动 + 导入 | `REA_*_STARTUP_TIMEOUT_MS` |
| 单个函数反编译很久 | 反编译 | `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` |
| 整个工具调用超时但引擎还活着 | 传输 / 客户端 | 分页、摘要、拆任务 |

## 三个可调项

```
REA_GHIDRA_STARTUP_TIMEOUT_MS=1800000      # 默认 330000
REA_HOPPER_STARTUP_TIMEOUT_MS=300000       # 默认 120000
REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS=600   # 默认不限制
```

MCP 里也能改：`update_analysis_settings` 的 `ghidra.startup_timeout_ms`、`hopper.startup_timeout_ms`。

<div class="tu-note tu-note--warn">
<strong>这些是启动期读的</strong><p>环境变量要在启动 MCP 服务器之前生效，改完要重启客户端。用 <code>update_analysis_settings</code> 改的不受影响。</p>
</div>

## 比调超时更有效的三招

1. **复用到分析结果。** Ghidra 的自动检查点（`REA_GHIDRA_CHECKPOINT_DIR`）第二次跳过导入分析；CLI 用 `--snapshot`。
2. **缩小目标。** 不要一次分析整个 `.app`，先 `open_bundle_resources` 看结构，再挑主二进制。
3. **换引擎。** Hopper 打开大文件通常比 Ghidra 快。

## 超时之后

工具会返回 `recovery.kind: "inspect_timeout_state"`。别急着重试：先看有没有部分证据，以及清理状态（`binary_session` 里的 `cleanup_pending`）。
""",
    ),
    dict(
        slug="context-bloat", title="结果太大怎么办", nav="结果太大怎么办", group="D · 排错与省钱",
        minutes=7, order=16,
        desc="上下文被一次工具返回撑爆：summary、分页、保留引用，三招止血。",
        body=r"""
## 症状

- 客户端报 `resource_constraint`；
- 一次工具调用之后，模型开始忘事、答非所问；
- 一个 `.app` 分析完，上下文只剩一半。

## 第一招：第一次就用 summary

```
用 summary 模式打开 <目标>，先给我轮廓，不要全文。
```

`detail: "summary"` 会返回摘要 + 一个 `parent_evidence_id`，完整记录留在会话里。

## 第二招：分页看

```
按 view: native, facet: pseudocode, offset: 0, limit: 200 分页给我这个函数的伪代码。
```

需要什么看什么，不要一次拉全文。

## 第三招：传引用，不传内容

工具之间传大结果用：

```
{"kind": "retained-evidence", "evidence_id": "ev_..."}
```

不要把它复制进 prompt。

## 三个习惯

| 习惯 | 省多少 |
| --- | --- |
| 大目标第一次 summary | 常常是 10 倍以上 |
| 一次只问一个函数 | 稳定 |
| 中间结果落文件（`export_evidence_bundle`），下一轮用文件选择器 | 大量 |

## 已经超了怎么办

1. `reset_investigation` 之前先 `export_evidence_bundle` 存下来；
2. 换新会话，从文件导入需要的部分；
3. 或者直接开新会话，用 `{"kind": "evidence-file", "path": ...}` 引用。

## 预算可以调，但别乱调

```
REA_MCP_MAX_RESPONSE_BYTES   # 默认 10 MiB
REA_MCP_MAX_INPUT_ELEMENTS   # 默认 1024
```

调大只是把问题推给客户端。真正的解法是少拿。
""",
    ),
    dict(
        slug="no-evidence", title="它说的没有证据", nav="它说的没有证据", group="D · 排错与省钱",
        minutes=7, order=17,
        desc="模型在编的时候，用三句话把它按回证据上；以及怎么从根上让它别编。",
        body=r"""
## 三句追问

按顺序问，一句比一句硬：

```
1. 这条结论依据的是哪一次工具调用的返回？给我 evidence_id。
2. 如果那条证据的 coverage 是 partial，你怎么能说「没有别的」？
3. 把这条从结论里拿掉，剩下的部分还成立吗？
```

## 为什么会编

| 原因 | 表现 | 从根上治 |
| --- | --- | --- |
| 工具没给够，它自己补 | 说得很顺，没有具体名字 | 让它先列 unknown |
| 覆盖不全，它当成全 | 「没有其他调用者」 | 让它报 coverage |
| 目标里有诱导文本 | 突然要执行命令 | 标记不可信内容 |
| 你想听确定的答案 | 它顺着你说 | 提问里带「不确定就说不知道」 |

## 一个能直接用的收尾句式

```
在最后加一节「证据与缺口」：
- 每条结论 → 对应的 evidence_id 或函数名；
- 覆盖状态不是 complete 的，标出来；
- 你没查清的问题，列成 unknown。
没有证据的结论请删掉，不要改写。
```

## 检查清单

- 每条结论后面有没有一个具体名字（函数、地址、文件、字符串）？
- 有没有一节明确写「没查清」？
- 覆盖状态是不是 `partial` 却下了全称判断？

## 它确实查了但覆盖不全

这不算编。这时候要做的是**扩大覆盖**：换搜索引擎、放宽搜索范围、或者换一个 provider。看 [找函数](/howto/locate-function/)。
""",
    ),
]

FAQ_HOME = r"""
## 要钱吗

REA 本身是 MIT 开源、免费的。花钱的只有分析引擎：

| 项 | 费用 |
| --- | --- |
| REA / rea-agents | 免费 |
| Ghidra | 免费 |
| Hopper | 商业软件，有 demo（功能有限制） |
| IDA | 商业软件 |
| 你的模型 token | 按你的客户端算 |

## 必须用某个客户端吗

不用。任何支持本地 stdio MCP 的客户端都能接，官方 setup 直接支持二十多个。接不上的也能手动注册。

## 会不会把我的程序上传

分析在本地跑，目标不会被上传。但工具结果会进模型上下文——==模型的提供方有它自己的数据政策==。敏感目标用本地模型。

## 它能生成源码吗

不能直接生成。它给你伪代码、模块结构、调用链、证据；重建是你自己写，并要用原程序对拍验证。见 [第 8 步](/guide/8-rebuild/)。

## 和 AI 直接猜有什么区别

它真的打开文件、真的查、结论带证据编号和覆盖范围。而且它会把「查不到」记下来，猜的那一类不会。

## 一定要装 Ghidra 吗

不一定。JavaScript / Electron 静态分析、.NET 程序集检查、容器拆解、发布审计都不需要引擎。只有原生二进制的反编译才需要。

## 会不会被目标里的内容骗

会，这是这类工具的真实风险。REA 给来自目标的结果打上不可信标记，你也要把这类内容当数据看，而不是命令。见 [读懂证据](/guide/5-evidence/)。

## 分析别人的商业软件合法吗

看你所在地的法律和那份软件的许可协议。自己的程序、授权范围内的安全评估、开源没文档的项目最稳妥。本教程只讲技术路径，不构成法律意见。

## 为什么 doctor 老是 healthy: false

它是大范围审计，缺任何一个可选组件都会 false。按你的任务缩小范围查（`--provider` / `--client` / `--skill`），别拿总开关当结论。

## 为什么换了个会话就忘了之前查的

证据账本是**按连接**的，不跨会话。要接着用就导出 bundle，下一轮用文件引用。见 [命令行](/guide/7-cli/)。

## 分析好慢

三种慢要分开看：引擎导入（改超时或复用快照）、反编译单个大函数（限制超时或只取契约）、结果太大（summary + 分页）。见 [引擎超时](/howto/engine-timeout/) 和 [结果太大](/howto/context-bloat/)。

## 会不会很贵

会。它比一次对话贵得多，因为要喂大量结构化证据。三个省钱习惯：大目标先 summary、一次只问一件事、中间结果落文件。

## 中文目标支持吗

支持。字符串搜索对中文没问题；界面文案是中文的话，反而更好定位。

## 我能用它做自动化检查吗

能。`audit-release-exposure --fail_on high` 达到阈值退出码 3，可以直接卡流水线。见 [在 CI 里跑](/howto/ci/)。

## 这个站是官方的吗

不是。它是第三方中文入门教程，内容依据官方仓库的公开文档写成，并在本机 rea 6.7.0 上核对过命令与输出。命令和行为以[官方仓库](https://github.com/morluto/rea)为准。
"""
