import{_ as e,c as a,o as t,U as r}from"./chunks/framework.WKpLpN6N.js";const _=JSON.parse('{"title":"共享文件夾","description":"","frontmatter":{},"headers":[],"relativePath":"rime/SharedData.md","filePath":"home.wiki/SharedData.md"}'),o={name:"rime/SharedData.md"},i=r('<h1 id="共享文件夾" tabindex="-1">共享文件夾 <a class="header-anchor" href="#共享文件夾" aria-label="Permalink to &quot;共享文件夾&quot;">​</a></h1><p>存放由本機多個用戶共享的文件，通常由輸入法安裝程序寫入。</p><p>Rime 輸入法在查找一項資源的時候，會優先訪問 [[用戶文件夾|UserData]] 中的文件。 用戶文件不存在時，再到共享文件夾中尋找。</p><p>一些 Linux 發行版可由 <code>rime-data</code> 軟件包安裝常用數據文件到這裏。或用 <a href="https://github.com/rime/plum#install-as-shared-data" target="_blank" rel="noreferrer">/plum/</a> 編譯安裝。</p><h2 id="位置" tabindex="-1">位置 <a class="header-anchor" href="#位置" aria-label="Permalink to &quot;位置&quot;">​</a></h2><p><code>librime</code> 允許輸入法指定共享文件夾的位置。</p><ul><li><strong>小狼毫：</strong> <code>&lt;安裝目錄&gt;\\data</code></li><li><strong>鼠鬚管：</strong> <code>&quot;/Library/Input Methods/Squirrel.app/Contents/SharedSupport&quot;</code></li><li><strong>ibus-rime, fcitx-rime:</strong> <code>/usr/share/rime-data</code> （編譯時可配置）</li></ul><h2 id="內容" tabindex="-1">內容 <a class="header-anchor" href="#內容" aria-label="Permalink to &quot;內容&quot;">​</a></h2><p>輸入方案、韻書、默認配置源文件：</p><ul><li><code>&lt;輸入方案代號&gt;.schema.yaml</code>: 用戶下載或自定義的 <em>輸入方案</em>。</li><li><code>&lt;韻書代號&gt;.dict.yaml</code>: 用戶下載或自定義的 <em>韻書</em>。</li><li><code>&lt;詞典名稱&gt;.txt</code>: 文本格式的詞典，如預設詞彙表。</li></ul><p>也可以包含編譯後的機讀格式，從而省去用戶部署時從相同源文件再次編譯的步驟：</p><ul><li><code>build/*</code> 快取文件。爲使輸入法程序高效運行，預先將配置、韻書等編譯爲機讀格式。</li></ul><p>註： <code>librime</code> 1.3 版本之前，編譯後的快取文件直接存放在共享文件夾，與源文件並列。</p><p>其他：</p><ul><li><code>opencc/*</code> - <a href="https://github.com/BYVoid/OpenCC" target="_blank" rel="noreferrer">OpenCC</a> 字形轉換配置及字典文件。</li></ul>',15),l=[i];function d(c,n,s,p,h,m){return t(),a("div",null,l)}const f=e(o,[["render",d]]);export{_ as __pageData,f as default};