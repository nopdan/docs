Rime 使用 [YAML](http://yaml.org/) 作为配置文件

- 后缀为`.yaml`或`.yml`，在 Rime 里推荐使用`.yaml`
- 大小写敏感
- 使用**缩进**表示层级关系
- 缩进不允许使用`tab`，只允许空格
- 缩进的空格数不重要，只要相同层级的元素左对齐即可
- `#`表示注释

## 数据类型

YAML 支持以下几种数据类型：

- **对象**：键值对的集合，又称为映射（mapping）/ 哈希（hashes） / 字典（dictionary）
- **数组**：一组按次序排列的值，又称为序列（sequence） / 列表（list）
- **纯量**（scalars）：单个的、不可再分的值

## 对象

使用**冒号**分隔，冒号后**必须加空格**，`key: value`  
可以使用单行：`key: {key1: value1, key2: value2, ...}`  
也可以展开：  
```yaml
key:
  key1: value1
  key2: value2
# 注意缩进对齐
```

## 列表

单行：`[value1, value2, ...]`  
多行：  
```yaml
- value1
- value2
```

## 复合结构

**列表**作为**对象**的`value`：  
```yaml
key: [value1, value2]

# 展开
key:
  - value1
  - value2
```

**对象**作为**列表**的元素：  
```yaml
[{key: value, key2: value2},{a: b, c: d}]

# 展开
- {key: value, key2: value2}
- {a: b, c: d}

# 进一步展开
- key: value
  key2: value2
- a: b
  c: d
```

*列表作为对象的`key`比较复杂，在`rime`中用不到，这里就不写了*

## 纯量

纯量是最基本的，不可再分的值

### 字符串

使用 *单引号* 或 *双引号* 包裹，若字符串中没有特殊字符，也可以不写引号（裸键名就是不写引号的字符串）
```yaml
string:
  - 哈哈 #只要没有特殊字符，中文也可以不加引号
  - 'Hello world\n'  #使用双引号或者单引号包裹特殊字符
  - "Hello world\n" #双引号里的字符串不转义
  - 'I''m' #使用单引号转义单引号
```

### 数字

```yaml
number:
  - 12 #普通整数
  - 0xAAA678 #16进制整数（8进制：0, 2进制：0b）
  - 12.12 #浮点数
  - 1.2e+4 #科学计数法
  - -12 #负数只需在前面加 - 
```

### 布尔值

```yaml
boolean:
  - true # True, TRUE都可以
  - false # False, FALSE都可以
```

### 空值

使用`null`或者`~`

### 时间和日期

必须使用ISO 8601格式
```yaml
date: 2018-02-17 #yyyy-MM-dd
datetime: 2018-02-17T15:02:31+08:00 #时间和日期之间使用T连接，最后使用+代表时区
```

### 多行字符串

```yaml
key: hello
  world
```
直接换行：将换行符转为空格，解析为 `hello world`

```yaml
key: |
  hello
  world

anther: any
```
`|`：保留末尾一个换行，解析为 `hello\nworld\n`

在`|`后加`+`号：保留末尾所有换行，解析为 `hello\nworld\n\n`

在`|`后加`-`号：删去末尾所有换行，解析为 `hello\nworld`


## `&`锚点和`*`引用

```yaml
key: &a value #标记一个纯量
key2: *a #引用

person: 
  basic: &b #标记一个对象
    name: cxcn
    age: 1
  like: &c #标记一个列表
    - music
    - game

person2:
  basic: *b #引用一个对象
  like: *c #引用一个列表

list:
  - &d hello #标记列表中的元素
  - *d
```

`rime`暂不支持`<<`合并数据
