# 脚本开发指南

librime-lua 是 RIME 输入法引擎的一个插件，它为用户提供了使用 lua 脚本语言扩展输入法的能力。通过 lua，您可以实现输入任意动态短语（如日期时间、大写数字、计算器）、自由重排/过滤候选词，甚至云输入等，单纯使用配置文件难以做到的，灵活多样的功能。本文将介绍本项目的配置和编程方法。

要理解本项目的工作原理，需先了解 RIME 功能组件的基本概念与工作流程，见[RIME文档](https://github.com/rime/home/wiki/RimeWithSchemata#%E8%BC%B8%E5%85%A5%E6%B3%95%E5%BC%95%E6%93%8E%E8%88%87%E5%8A%9F%E8%83%BD%E7%B5%84%E4%BB%B6)。简而言之，librime-lua 提供了 processor、segmentor、translator 和 filter 这四个功能组件的开发接口。下面首先通过一个例子来说明完整的流程，然后再详细介绍各个组件的编程接口。

## 例子：输入今天的日期
我们通过“输入今天的日期”这个例子，来说明开发定制的流程。一共分三步：编写代码、配置方案、重新部署。

### 编写代码
输入日期，需要用到 translator。我们希望在输入“date”之后，在输入法候选框中得到今天日期。我们在 RIME 的用户目录下新建一个 `rime.lua` 文件，这是整个 lua 脚本的总入口。在文件中录入以下内容：
```lua
function date_translator(input, seg)
   if (input == "date") then
      --- Candidate(type, start, end, text, comment)
      yield(Candidate("date", seg.start, seg._end, os.date("%Y年%m月%d日"), " 日期"))
   end
end
```

上面实现了一个叫做 `date_translator` 的函数。它的输入是 `input` 和 `seg`，分别记录了 translator 需要翻译的内容和它在输入串中的位置。这个函数会判断输入的是否是“date”。如是则生成一个内容为今天日期的候选项。候选项的构造函数是 `Candidate`。这个函数如注释所说有五个参数：类型、开始位置、结束位置、候选内容和候选注释。类型可以是任意字符串，这里用了`"date"`；开始、结束位置一般用 `seg.start` 和 `seg._end` 就可以，它表示了我们要将整个待翻译的输入串替换为候选内容；候选内容是使用 lua 的库函数生成的日期；候选注释一般会在输入候选框中以灰色展示在候选内容旁边。候选项生成以后是通过 `yield` 发出的。`yield` 在这里可以简单理解为“发送一个候选项到候选框中”。一个函数可以 `yield` 任意次，这里我们只有一个候选项所以只有一个 `yield`。

### 配置方案
我们已经编写了输入日期的 translator，为了让它生效，需要修改输入方案的配置文件。以明月拼音为例，找到 `luna_pinyin.schema.yaml`，在 `engine/translators` 中加入一项 `lua_translator@date_translator`，如下：
```
engine:
  ...
  translators:
    - lua_translator@date_translator
    ...
```
这样就完成了配置。它表示从 lua 执行环境中找到名为 `date_translator` 的全局实例，将它作为一种 translator 安装到引擎之中。其他类型的组件配置类推，分别叫做 `lua_processor` `lua_segmentor` `lua_filter`。

### 重新部署
以上完成了所有开发和配置。点击“重新部署”，输入"date"，就可以看到候选框中出现了今天的日期。

在本项目的 `sample` 目录下，还有更多的例子。配合其中的注释并稍加修改，就可以满足大部分的日常需求。

### 模块化
到目前为止，我们的代码完全集中在 `rime.lua` 中。本节说明 librime-lua 对模块化的支持。模块化是指把脚本分门别类，放到独立的文件中，避免各自的修改互相干扰，也方便把自己的作品分享给他人使用。仍然以 `date_translator` 为例。

#### 分离脚本内容
首先需要把原来写在 `rime.lua` 的脚本搬运到独立的文件中。删掉 `rime.lua` 原有的内容后，在 RIME 的用户目录下新建一个 `lua` 目录，在 `lua` 下再建立一个 `date_translator.lua` 文件，录入以下内容：

```lua
local function translator(input, seg)
   if (input == "date") then
      --- Candidate(type, start, end, text, comment)
      yield(Candidate("date", seg.start, seg._end, os.date("%Y年%m月%d日"), " 日期"))
   end
end

return translator
```

可以看到主要内容与之前一致，但有两点不同：
- 使用 `local`。lua 脚本的变量作用域默认是全局的。如果不同模块的变量或函数正好用了相同的名字，就会导致互相干扰，出现难以排查的问题。因此，尽量使用 `local` 把变量作用域限制在局部。
- 新增 `return`。librime-lua 是借助 lua 的 require 机制实现模块加载。引用模块时，整个文件被当作一个函数执行，返回模块内容。在这里返回的是一个 translator 组件。

#### 引用模块
我们已经建立了一个名叫 `date_translator` 的模块。接下来是引用。

##### 旧版 librime-lua
如果使用的是较旧的 librime-lua，仍然需要在 `rime.lua` 内输入以下内容：

```lua
date_translator = require("date_translator")
```

前一个 `date_translator` 是全局变量名，后一个是模块名。librime-lua 将 RIME 的用户目录和 RIME 共享目录下的 `lua` 目录加入了模块搜索路径，因此本句的意义是搜索 `date_translator` 模块，并将返回的组件绑定到同名的全局变量上。这样就可以在输入方案配置文件中使用了，方法与之前一致。

##### 新版 librime-lua
如果使用的是最新的 librime-lua，则可以进一步避免修改 `rime.lua`，达到真正的模块化。

方法是将输入方案配置文件中直接写入以下内容：

```
engine:
  ...
  translators:
    - lua_translator@*date_translator
  ...
```

与之前的区别是第一个 `@` 之后多了一个 `*`。这个星号表示后面的名字是模块名而不是全局变量名。当遇到星号时，librime-lua 会在内部先使用 require 机制加载模块，然后将其返回值作为 RIME 组件加载到输入法框架中。

#### 配方补丁
以上我们实现了 lua 脚本的模块化。但为引用组件，仍需修改输入配方。为使对配方文件修改的模块化，请见[RIME配方补丁](https://github.com/rime/home/wiki/Configuration#%E8%A3%9C%E9%9D%AA)。

## 编程接口
本节详细介绍编程接口。需注意随着项目的开发，以下文档可能是不完整或过时的，敬请各位参与贡献文档。

### `lua_translator`
`lua_translator` 提供了 translator 的开发接口。它在配置文件中的配置语法有两种，分别是：
```
engine:
  translators:
    - lua_translator@lua_object_name
    - lua_translator@lua_object_name@name_space
```

其中 `lua_object_name` 是 lua 环境中的一个全局对象，可能是一个 lua function 或者一个 lua table。后面的 `name_space` 当出现时是 translator 名字，与 RIME 组件配置中出现的 `@` 意义一致。

`lua_object_name` 所指对象有多种形式：

```lua
--- 简化形式1
function translator(input, seg)
...
end

--- 简化形式2
function translator(input, seg, env)
...
end

--- 完整形式
{
   init = function (env) ... end,
   func = function (input, seg, env) ... end,
   fini = function (env) ... end
}

```

简化形式是 lua function，此函数即为 translator 的工作函数。无返回值。可以通过 `yield` 发送 `Candidate` 对象。
参数：
- `input`：字符串，为待翻译串。
- `seg`：`Segment` 对象。
- `env`：lua table 对象。预设 `engine` 和 `name_space` 两个成员，分别是 `Engine` 对象和前述 `name_space` 配置字符串。

完整形式是 lua table，其中 `func` 与简化形式意义相同。`init` 与 `fini` 分别在 `lua_translator` 构造与析构时调用。


### `lua_filter`
`lua_filter` 提供了 filter 的开发接口。它在配置文件中的配置语法有两种，分别是：
```
engine:
  filters:
    - lua_filter@lua_object_name
    - lua_filter@lua_object_name@name_space
```

其中 `lua_object_name` 是 lua 环境中的一个全局对象，可能是一个 lua function 或者一个 lua table。后面的 `name_space` 当出现时是 filter 名字，与 RIME 组件配置中出现的 `@` 意义一致。

`lua_object_name` 所指对象有多种形式：

```lua
--- 简化形式1
function filter(input)
...
end

--- 简化形式2
function filter(input, env)
...
end

--- 简化形式3
function filter(input, env, cands)
...
end

--- 完整形式
{
   init = function (env) ... end,
   func = function (input, env) ... end,
   fini = function (env) ... end,
   tags_match = function (segment, env) ... end  --- 可选
}

```

简化形式是 lua function，此函数即为 filter 的工作函数。无返回值。可以通过 `yield` 发送 `Candidate` 对象。
参数：
- `input`：`Translation` 对象，为待过滤的 `Candidate` 流。
- `env`：lua table 对象。预设 `engine` 和 `name_space` 两个成员，分别是 `Engine` 对象和前述 `name_space` 配置字符串。

完整形式是 lua table，其中 `func` 与简化形式意义相同。`init` 与 `fini` 分别在 `lua_filter` 构造与析构时调用。`tags_match` 出现时覆盖 filter 的 `TagsMatch` 方法。


### `lua_processor`
`lua_processor` 提供了 processor 的开发接口。它在配置文件中的配置语法有两种，分别是：
```
engine:
  processors:
    - lua_processor@lua_object_name
    - lua_processor@lua_object_name@name_space
```

其中 `lua_object_name` 是 lua 环境中的一个全局对象，可能是一个 lua function 或者一个 lua table。后面的 `name_space` 当出现时是 processor 名字，与 RIME 组件配置中出现的 `@` 意义一致。

`lua_object_name` 所指对象有多种形式：

```lua
--- 简化形式1
function processor(key_event)
...
end

--- 简化形式2
function processor(key_event, env)
...
end

--- 完整形式
{
   init = function (env) ... end,
   func = function (key_event, env) ... end,
   fini = function (env) ... end
}

```

简化形式是 lua function，此函数即为 processor 的工作函数。返回值为整数：
- 0 表示 `kRejected` 字符上屏，结束 processors 流程
- 1 表示 `kAccepted` 字符不上屏，结束 processors 流程
- 2 表示 `kNoop` 字符不上屏，交给下一个 processor

参数：
- `key_event`：`KeyEvent` 对象，为待处理的按键。
- `env`：lua table 对象。预设 `engine` 和 `name_space` 两个成员，分别是 `Engine` 对象和前述 `name_space` 配置字符串。

完整形式是 lua table，其中 `func` 与简化形式意义相同。`init` 与 `fini` 分别在 `lua_processor` 构造与析构时调用。


### `lua_segmentor`
`lua_segmentor` 提供了 segmentor 的开发接口。它在配置文件中的配置语法有两种，分别是：
```
engine:
  segmentors:
    - lua_segmentor@lua_object_name
    - lua_segmentor@lua_object_name@name_space
```

其中 `lua_object_name` 是 lua 环境中的一个全局对象，可能是一个 lua function 或者一个 lua table。后面的 `name_space` 当出现时是 segmentor 名字，与 RIME 组件配置中出现的 `@` 意义一致。

`lua_object_name` 所指对象有多种形式：

```lua
--- 简化形式1
function segmentor(segmentation)
...
end

--- 简化形式2
function segmentor(segmentation, env)
...
end

--- 完整形式
{
   init = function (env) ... end,
   func = function (segmentation, env) ... end,
   fini = function (env) ... end
}

```

简化形式是 lua function，此函数即为 segmentor 的工作函数。返回值为bool（true: 交由下一个segmentor处理；false: 终止segmentors处理流程）。
参数：
- `segmentation`：`Segmentation` 对象。
- `env`：lua table 对象。预设 `engine` 和 `name_space` 两个成员，分别是 `Engine` 对象和前述 `name_space` 配置字符串。

完整形式是 lua table，其中 `func` 与简化形式意义相同。`init` 与 `fini` 分别在 `lua_segmentor` 构造与析构时调用。

## 对象接口
librime-lua 封装了 librime C++ 对象到 lua 中供脚本访问。此部分文档待整理。

### Engine

可通过 `env.engine` 获得。

属性：

属性名 | 类型 | 解释
--- | --- | --- 
schema | 
context | Context | 
active_engine | 

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
process_key
compose
commit_text(text) | text: string | | 上屏 text 字符串
apply_schema

### Context

输入编码上下文。

可通过 `env.engine.context` 获得。

属性：

属性名 | 类型 | 解释
--- | --- | --- 
composition | Composition | 
input | string | 正在输入的编码字符串
caret_pos | number | 脱字符位置
commit_notifier | Notifier | 
select_notifier | Notifier | 
update_notifier | Notifier | 
delete_notifier | Notifier | 
option_update_notifier | OptionUpdateNotifier | 选项改变通知，使用 connect 方法接收通知
property_update_notifier | PropertyUpdateNotifier | 
unhandled_key_notifier | KeyEventNotifier | 

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
commit | | | 上屏选中的候选词
get_commit_text | | string |
get_script_text | | string | 按音节分割
get_preedit | | Preedit | 
is_composing | | boolean | 是否有未上屏的编码
has_menu | | boolean | 是否有候选词（选项菜单）
get_selected_candidate | | Candidate | 返回选中的候选词
push_input(text) | text: string | | 插入指定的text编码字符串
pop_input(num) | num: number | boolean | 删除num指定数量的编码字符串
delete_input
clear | | | 清空正在输入的编码字符串
select(index) | index: number | boolean | 选择下标候选词（下标0开始）
confirm_current_selection
delete_current_selection | | boolean | 是否有候选词（this doesn't mean anything is deleted for sure） <br> [https://github.com/rime/librime/.../src/context.cc#L125-L137](https://github.com/rime/librime/blob/fbe492eefccfcadf04cf72512d8548f3ff778bf4/src/context.cc#L125-L137)
confirm_previous_selection
reopen_previous_selection
clear_previous_segment
reopen_previous_segment
clear_non_confirmed_composition
refresh_non_confirmed_composition
set_option
get_option
set_property(key, value) | key: string <br> value: string | | 可以用于存储上下文信息（可配合 `property_update_notifier` 使用）
get_property(key) | key: string | string | 
clear_transient_options

### Preedit

属性：

属性名 | 类型 | 解释
--- | --- | ---
text
caret_pos
sel_start
sel_end

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---

### Composition

上下文组成的“作品”。（通过此对象，可间接获得“菜单menu”、“候选词candidate”、“片段segment”相关信息）

可通过 `env.engine.context.composition` 获得。

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
empty | | boolean | 是否有候选词（是否有menu）
back | | Segment | 获得 Segment 对象
pop_back
push_back
has_finished_composition
get_prompt | | string | 获得 Segment 的 prompt 字符串（prompt 为活动编码左边的字符串提示）
toSegmentation


e.g.
```lua
local composition = env.engine.context.composition

if(not composition:empty()) then
  -- 获得 Segment 对象
  local segment = composition:back()

  -- 获得选中的候选词下标
  local selected_candidate_index = segment.selected_index

  -- 获取 Menu 对象
  local menu = segment.menu

  -- 获得（已加载）候选词数量
  local loaded_candidate_count = menu:candidate_count()
end
```

### Segmentation

在分词处理流程 Segmentor 中存储 Segment 并把其传递给 Translator 进行下一步翻译处理。

作为第一个参数传入以注册的 lua_segmentor。

或通过以下方法获得：

```lua
local composition = env.engine.context.composition
local segmentation = composition:toSegmentation()
```

> librime 定义 - https://github.com/rime/librime/blob/5c36fb74ccdff8c91ac47b1c221bd7e559ae9688/src/segmentation.cc#L28

属性：

属性名 | 类型 | 解释
--- | --- | ---
input | string | 活动中的原始（未preedit）输入编码

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
empty | | boolean | 是否包含 Segment
back | | Segment | 查看添加的 Segment 
pop_back | | Segment | 查看最近添加的 Segment，并将其从 Segmentation 中移除
reset_length
add_segment(seg) | seg: Segment | | 添加 Segment <br>（librime v1.7.3：如果已包含 Segment，仅将新 Segment.tags 合并入旧 Segment.tags）
forward 
trim | | | 清空其中的 Segment
has_finished_segmentation | | boolean |
get_current_start_position | | number | 
get_current_end_position | | number | 
get_current_segment_length | | number | 
get_confirmed_position | | number | 属性 input 中已经确认（处理完）的长度 <br> （通过判断 status 为 "kSelected" 以上的 Segment 的 _end 来判断 confirmed_position） <br> [https://github.com/rime/librime/.../src/segmentation.cc#L127](https://github.com/rime/librime/blob/cea389e6eb5e90f5cd5b9ca1c6aae7a035756405/src/segmentation.cc#L127)

e.g.
```txt
                         | 你hao‸a
env.engine.context.input | "nihaoa"
Segmentation.input       | "nihao"
get_confirmed_position   | 2
```

### Segment

分词片段。触发 translator 时作为第二个参数传递给注册好的 lua_translator。

或者以下方法获得: （在 filter 以外的场景使用）

```lua
local composition =  env.engine.context.composition
if(not composition:empty()) then
  local segment = composition:back()
end
```

构造方法：`Segment(start_pos, end_pos)`
1. start_pos: 开始下标
2. end_pos: 结束下标

属性：

属性名 | 类型 | 解释
--- | --- | ---
status | string | 1. `kVoid` - （默认） <br> 2. `kGuess` <br> 3. `kSelected` - 大于此状态才会被视为选中 <br> 4. `kConfirmed`
start
_start
_end
length
tags | Set | 标签
menu
selected_index
prompt | string | 输入编码旁的提示字符串 <br> ![image](https://user-images.githubusercontent.com/18041500/190980054-7e944f5f-a381-4c73-ad6a-254a00c09e44.png)

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
clear
close
reopen
has_tag
get_candidate_at(index) | index: number 下标0开始 | Candidate | 
get_selected_candidate | | Candidate | 

### Schema

方案。可以通过 `env.engine.schema` 获得。

构造方法：`Schema(schema_id)`
1. schema_id: string

属性：

属性名 | 类型 | 解释
--- | --- | --- 
schema_id | string | 方案编号
schema_name | string | 方案名称
config | Config | 方案配置
page_size | number | 每页候选词数
select_keys | 

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---

### Config

（方案的）配置。可以通过 `env.engine.schema.config` 获得

属性：

属性名 | 类型 | 解释
--- | --- | --- 

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
load_from_file
save_to_file
is_null(conf_path) | conf_path: string | 
is_value
is_list(conf_path) | conf_path: string | boolean | 1. 存在且为 ConfigList 返回 true <br> 2. 存在且不为 ConfigList 返回 false <br> 3. 不存在返回 true ⚠️
is_map
get_bool
get_int
get_double
get_string(conf_path) | conf_path: string |  string | 根据配置路径 conf_path 获取配置的字符串值
set_bool
set_int
set_double
set_string(path, str) | path: string <br> str: string | 
get_item
set_item(path, item) | path: string <br> item: ConfigItem | 
get_value
get_list(conf_path) | conf_path: string | ConfigList | 不存在或不为 ConfigList 时返回 nil
get_map(conf_path) | conf_path: string | ConfigMap | 不存在或不为 ConfigMap 时返回 nil
set_value(path, value) | path: string <br> value: ConfigValue | 
set_list
set_map
get_list_size

### ConfigMap

属性：

属性名 | 类型 | 解释
--- | --- | --- 
size | number | 
type | string | 如：“kMap”
element |  | 轉換成ConfigItem

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
set
get(key) | key: string | ConfigItem |
get_value(key) | key: string | ConfigValue | 
has_key | | boolean | 
clear
empty | | boolean | 
keys | | table | 

### ConfigList

属性：

属性名 | 类型 | 解释
--- | --- | --- 
size | number |
type | string | 如：“kList”
element |  |轉換成ConfigItem

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get_at(index) | index: number <br> （下标从0开始）| ConfigItem |
get_value_at(index) | index: number <br> （下标从0开始）| ConfigValue | 
set_at
append
insert
clear
empty
resize

### ConfigValue

继承 ConfigItem

构造方法：`ConfigValue(str)`
1. str: 值（可通过 get_string 获得）

属性：

属性名 | 类型 | 解释
--- | --- | --- 
value | string | 
type | string | 如：“kScalar”
element| |轉換成ConfigItem

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get_bool
get_int
get_double
set_bool
set_int
set_double
get_string
set_string

### ConfigItem

属性：

属性名 | 类型 | 解释
--- | --- | --- 
type | string | 1. "kNull" <br> 2. "kScalar" <br> 3. "kList" <br> 4. "kMap"
empty

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get_value | | | 当 type == "kScalar" 时使用
get_list | | | 当 type == "kList" 时使用
get_map | | | 当 type == "kMap" 时使用

### KeyEvent

按键事件对象。

> 当按键被按下、释放（release）、保持时均会产生按键事件（KeyEvent），触发 processor，此时 KeyEvent 会被作为第一个参数传递给已注册的 lua_processor。

属性：

属性名 | 类型 | 解释
--- | --- | ---
keycode | number | 按键值
modifier | | 

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
shift | | boolean | 触发事件时，是否被按压
ctrl | | boolean | 触发事件时，是否被按压
alt | | boolean | 触发事件时，是否被按压
caps <br> （CapsLk） | | boolean |
super | | boolean |
release | | boolean | 当事件为“release”时为 true，否则为 false
repr <br> （representation） | | string | 当非 release 时，为按键字符，如：“1”、“a”、“space”、“Shift_L” <br> 当 release 时，为Releas+按键字符，如：“Release+space”
eq(key) <br> （equal） | key: KeyEvent | boolean | 两个 KeyEvent 是否“相等”
lt(key) <br> （less than） | key: KeyEvent | boolean | 对象小于参数时为 true

### KeySequence

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
parse
repr
toKeyEvent

### Candidate

（简单的）候选词。（选中后不会更新用户字典）

构造方法：`Candidate(type, start, end, text, comment)`
1. type: 标识
1. start: 分词开始
1. end: 分词结束
1. text: 候选词内容
1. comment: 註解

属性：

属性名 | 类型 | 解释
--- | --- | ---
type | string | 候选词来源标记，如：“user_phrase”、“phrase”、“punct”、“simplified” <br> 1. "user_phrase": 用户字典（随用户输入而更新） <br> 2. "phrase" <br> 3. "punct": 来源有两 "engine/segmentors/punct_segmentor" 或 "symbols:/patch/recognizer/patterns/punct" <br> 4. "simplified" <br> 5. "completion": 编码未完整。see [https://github.com/rime/librime/.../src/rime/gear/table_translator.cc#L77](https://github.com/rime/librime/blob/69d5c3291745faa184d7c020ce4b394d41744efd/src/rime/gear/table_translator.cc#L77) <br> 6...
start | number |
_start | number | 编码开始位置，如：“好” 在 “ni hao” 中的 _start=2
_end | number | 编码结束位置，如：“好” 在 “ni hao” 中的 _end=5
quality | number | 结果展示排名权重
text | string | 候选词内容
comment | string | 註解(name_space/comment_format) <br> ![image](https://user-images.githubusercontent.com/18041500/191151929-6d45e410-ccf8-4676-8146-c64bb3f4393e.png)
preedit | string | 得到当前候选词的编码（一般空格分开圆音，如："ni hao"）(name_space/preedit_format)

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get_dynamic_type | | string | 1. "Phrase": Phrase <br> 2. "Simple": SimpleCandidate （即 Candidate）<br> 3. "Shadow": ShadowCandidate <br> 4. "Uniquified": UniquifiedCandidate <br> 5. "Other"
get_genuine | | Candidate | 
get_genuines | | table: `<number, Candidate>` | 
to_shadow_candidate
to_uniquified_candidate
append

### UniquifiedCandidate

### ShadowCandidate

衍生扩展词

<https://github.com/hchunhui/librime-lua/pull/162>

ShadowCandidate(cand,type,text,comment)類似 simplifier 的作法

构造方法：`ShadowCandidate(cand, type, text, comment, inherit_comment)`
1. cand
1. type
1. text
1. comment
1. inherit_comment: （可选）

### Phrase

候选词。（选择后会更新相应的用户字典）

构造方法：`Phrase(memory, type, start, end, entry)`
1. memory: Memory
1. type: string
1. start: number
1. end: number
1. entry: DictEntry

属性：

属性名 | 类型 | 解释
--- | --- | ---
language
type
start
_start
_end
quality
text
comment
preedit
weight
code
entry

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
toCandidate

### UniquifiedCandidate

<https://github.com/hchunhui/librime-lua/pull/162>

UniqifiedCandidate(cand,type,text,comment) 類似 uniqifier 的作法

### Set

构造方法：`Set(table)`
1. table: 列表

ex: local set_tab = Set({'a','b','c','c'}) # set_tab= {a=true,b=true, c=true}

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
empty
__index
__add
__sub
__mul
__set

### Menu

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
add_translation
prepare
get_candidate_at
candidate_count
empty

### Opencc

构造方法：`Opencc(filename)`
1. filename: string

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
convert

### ReverseDb /ReverseLookup

反查

构造方法：`ReverseDb(file_name)` 
1. file_name: 反查字典文件路径。 如: `build/terra_pinyin.reverse.bin`

e.g.
```lua
local pyrdb = ReverseDb("build/terra_pinyin.reverse.bin")
```

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
lookup | 

### ReverseLookup (ver #177)

构造方法：`ReverseLookup(dict_name)`
1. dict_name: 字典名。 如: `luna_pinyin`

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
lookup(key) | key: string | string | 如：`ReverseLookup("luna_pinyin"):lookup( "百" ) == "bai bo"`
lookup_stems | 

### CommitEntry

继承 DictEntry

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get

### DictEntry

构造方法：`DictEntry()`

>librime 定义：https://github.com/rime/librime/blob/ae848c47adbe0411d4b7b9538e4a1aae45352c31/include/rime/impl/vocabulary.h#L33

属性：

属性名 | 类型 | 解释
--- | --- | ---
text | string | 词，如：“好”
comment | string | 剩下的编码，如：preedit "h", text "好", comment "~ao"
preedit | string | 如：“h”
weight | number | 如：“-13.998352335763”
commit_count | number | 如：“2”
custom_code | string | 词编码（根据特定规则拆分，以" "（空格）连接，如：拼音中以音节拆分），如：“hao”、“ni hao”
remaining_code_length | number | （预测的结果中）未输入的编码，如：preedit "h", text "好", comment "~ao"， remaining_code_length “2”
code | Code

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---

### Code

构造方法：`Code()`

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
push(inputCode) | rime::SyllableId <br> （librime中定义的类型） | 
print | | string | 

### Memory

提供来操作 dict（字典、固态字典、静态字典）和 user_dict（用户字典、动态字典）的接口

构造方法：`Memory(engine, schema, name_space)`
1. engine: Engine
1. schema: Schema
1. name_space: string （可选，默认为空）

e.g.

```lua
env.mem = Memory(env.engine,env.engine.schema)  --  ns= "translator"
-- env.mem = Memory(env.engine,env.engine.schema, env.name_space )  
-- env.mem = Memory(env.engine,Schema("cangjie5") ) --  ns= "translator-
-- env.mem = Memory(env.engine,Schema("cangjie5"), "translator") 
```

构造流程：https://github.com/rime/librime/blob/3451fd1eb0129c1c44a08c6620b7956922144850/src/gear/memory.cc#L51
1. 加载 schema 中指定的字典（dictionary）<br>
（包括："`{name_space}/dictionary`"、"`{name_space}/prism`"、"`{name_space}/packs`"）
1. 加在 schema 中指定的用户字典（user_dict）<br>
（前提：`{name_space}/enable_user_dict` 为 true）<br>
（包括："`{name_space}/user_dict`" 或 "`{name_space}/dictionary`"）<br>
（后缀："`*.userdb.txt`"）
1. 添加通知事件监听（commit_notifier、delete_notifier、unhandled_key_notifier）

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
dict_lookup(input, predictive, limit) | input: string <br> predictive: boolean <br> limit: number | boolean 是否有结果查询 | 
user_lookup(input, predictive) | input: string <br> predictive: boolean |
memorize(callback) | callback: function <br> （回调参数：CommitEntry） | 当用户字典候选词被选中时触发回调。
decode(code) | code: Code | table: `<number, string>` | 
iter_dict | |  | 配合 `for ... end` 获得 DictEntry
iter_user | |  | 配合 `for ... end` 获得 DictEntry
update_userdict(entry, commits, prefix) | entry: DictEntry <br> commits: number <br> prefix: string | boolean | 

使用案例：https://github.com/hchunhui/librime-lua/blob/67ef681a9fd03262c49cc7f850cc92fc791b1e85/sample/lua/expand_translator.lua#L32

e.g. 
```lua
-- 遍历

local input = "hello"
local mem = Memory(env.engine,env.engine.schema) 
mem:dict_lookup(input, true, 100)
-- 遍历字典
for entry in mem:iter_dict() do
 print(entry.text)
end

mem:user_lookup(input, true)
-- 遍历用户字典
for entry in mem:iter_user() do
 print(entry.text)
end
```

``````lua
-- 监听 & 更新

env.mem = Memory(env.engine, env.engine.schema) 
env.mem:memorize(function(commit) 
  for i,dictentry in ipairs(commit:get()) do
    log.info(dictentry.text .. " " .. dictentry.weight .. " " .. dictentry.comment .. "")
    -- memory:update_userdict(dictentry,0,"") -- do nothing to userdict
    -- memory:update_userdict(dictentry,1,"") -- update entry to userdict
    -- memory:update_userdict(dictentry,-1,"") -- delete entry to userdict
    --[[
      用户字典形式如：
      ```txt
      # Rime user dictionary
      #@/db_name	luna_pinyin.userdb
      #@/db_type	userdb
      #@/rime_version	1.5.3
      #@/tick	693
      #@/user_id	aaaaaaaa-bbbb-4c62-b0b0-ccccccccccc
      wang shang 	网上	c=1 d=0.442639 t=693
      wang shi zhi duo shao 	往事知多少	c=1 d=0.913931 t=693
      wang xia 	往下	c=1 d=0.794534 t=693
      wei 	未	c=1 d=0.955997 t=693
      ```
    --]]
  end
end
``````

### Projection

可以用于处理 candidate 的 comment 的转换

构造：`Projection()`

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
load(rules) | rules: ConfigList | - | 加载转换规则
apply(str) | str: string | string | 转换字符串

使用参考： <https://github.com/hchunhui/librime-lua/pull/102>

```lua
local config=env.engine.schema.config
-- load ConfigList  form  path
local proedit_fmt_list = conifg:get_list("translastor/preedit_format")
-- create Projection obj
local p1=Projection()
-- load convert rules
p1:load(proedit_fmt_list)
-- convert string
local str_raw = "abcdefg"
local str_preedit = p1:apply(str)
```

### Component

調用 processor,segmentor,translator,filter 組件，可在lua script中再重組。
參考範例: [librime-lua/sample/lua/component_test.lua](https://github.com/hchunhui/librime-lua/tree/master/sample/lua/component_test.lua)

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
Processor |engine,[schema,]name_space,prescription |Processor | 如：`Component.Processor(env.engine,"","ascii_composer")`, `Component.Processor(env.engine,Schema('cangjie5'),"",'ascii_composer)`(使用Schema: cangjie5 config)
Segmentor |同上 | Segmentor|
Translator|同上 | Translator | `Component.Translator(env.engine,'','table_translator')
Filter | 同上 | Filter | `Component.Filter(env.engine,'','uniquility')`

### Processor

属性：

属性名 | 类型 | 解释
--- | --- | ---
name_space|string|取出instance name_space #212

方法:

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
process_key_event|KeyEvent|0-2| 0:kReject 1:kAccepted 2:Noop,[參考engine.cc](https://github.com/rime/librime/blob/9086de3dd802d20f1366b3080c16e2eedede0584/src/rime/engine.cc#L107-L111)

### Segmentator

属性：

属性名 | 类型 | 解释
--- | --- | ---
name_space|string|取出instance name_space #212

方法:

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
proceed|Segmentation|bool| [參考engine.cc](https://github.com/rime/librime/blob/9086de3dd802d20f1366b3080c16e2eedede0584/src/rime/engine.cc#L168)

### Translator

属性：

属性名 | 类型 | 解释
--- | --- | ---
name_space|string|取出instance name_space #212

方法:

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
query|string: input, segmet|Translation [參考engine.cc](https://github.com/rime/librime/blob/9086de3dd802d20f1366b3080c16e2eedede0584/src/rime/engine.cc#L189-L218)

### Filter

属性：

属性名 | 类型 | 解释
--- | --- | ---
name_space|string|取出instance name_space #212

方法:

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
apply|translation,cands|Translation|[參考engine.cc](https://github.com/rime/librime/blob/9086de3dd802d20f1366b3080c16e2eedede0584/src/rime/engine.cc#L189-L218)

### Notifier

接收通知

通知类型：
1. commit_notifier
2. select_notifier
3. update_notifier
4. delete_notifier

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法： notifier connect 

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
connect(func) | func: function | Notifier

e.g.
```lua
-- ctx: Context
env.engine.context.commit_notifier:connect(function(ctx)
  -- your code ...
end)
```

### OptionUpdateNotifier

同 Notifier

e.g.
```lua
-- ctx: Context
-- name: string
env.engine.context.option_update_notifier:connect(function(ctx, name)
  -- your code ...
end)
```

### PropertyUpdateNotifier

同 Notifier

e.g.
```lua
-- ctx: Context
-- name: string
env.engine.context.property_update_notifier:connect(function(ctx, name)
  -- your code ...
end)
```

### KeyEventNotifier

同 Notifier

e.g.
```lua
-- ctx: Context
-- key: KeyEvent
env.engine.context.unhandled_key_notifier:connect(function(ctx, key)
  -- your code ...
end)
```

### Connection

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
disconnect

### log

记录日志到日志文件

日志位置：<https://github.com/rime/home/wiki/RimeWithSchemata#%E9%97%9C%E6%96%BC%E8%AA%BF%E8%A9%A6>
+ 【中州韻】 `/tmp/rime.ibus.*`
+ 【小狼毫】 `%TEMP%\rime.weasel.*`
+ 【鼠鬚管】 `$TMPDIR/rime.squirrel.*`
+ 各發行版的早期版本 `用戶資料夾/rime.log`

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
info
warning
error

### rime_api

属性：

属性名 | 类型 | 解释
--- | --- | ---

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
get_rime_version | | string | librime 版本
get_shared_data_dir | | string | 程序目录\data
get_user_data_dir | | string | 用户目录
get_sync_dir | | string | 用户资料同步目录
get_distribution_name | | string | 如：“小狼毫”
get_distribution_code_name | | string | 如：“Weasel”
get_distribution_version | | string | 发布版本号
get_user_id

### CommitRecord

CommitRecord : 參考 librime/src/rime/ engine.cc commit_history.h 
  * commit_text => `{type: 'raw',text: string}`
  * commit => `{type: cand.type , text: cand.text}`
  * reject => `{type: 'thru', text: ascii code}`

属性：

属性名 | 类型 | 解释
--- | --- | ---
type| string |
text| string |

### CommitHistory

engine 在 commit commit_text 會將 資料存入 commit_history, reject且屬於ascii範圍時存入ascii
此api 除了可以取出 CommitRecord 還可以在lua中推入commit_record
參考: librime/src/rime/gear/history_translator

属性：

属性名 | 类型 | 解释
--- | --- | ---
size| number| max_size <=20

方法：

方法名 | 参数 | 返回值 | 解释
--- | --- | --- | ---
push|(KeyEvent),(composision,ctx.input)(cand.type,cand.text)| |推入 CommitRecord
back| | CommitRecord|取出最後一個 CommitRecord
to_table| | lua table of CommitRecord|轉出 lua table of CommitRecord
iter| | | reverse_iter
repr| | string| 格式 [type]text[type]text....
latest_text| | string | 取出最後一個CommitRecord.text
empty| | bool
clear| | | size=0
pop_back| | | 移除最後一個CommitRecord

```lua
-- 將comit cand.type == "table" 加入 translation
local T={}
function T.func(inp,seg,env)
  if not seg.has_tag('histroy') then return end

  for r_iter,commit_record in context.commit_history:iter() do
    if commit_record.type=="table" then
       yield( Candidate( commit_record.type,seg.start,seg._end,commit_record.text,"commit_history"))
    end
  end
end
return T
```
