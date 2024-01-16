import{_ as s,c as i,o as a,U as n}from"./chunks/framework.WKpLpN6N.js";const g=JSON.parse('{"title":"詞典擴展包","description":"","frontmatter":{},"headers":[],"relativePath":"rime/DictionaryPack.md","filePath":"home.wiki/DictionaryPack.md"}'),l={name:"rime/DictionaryPack.md"},p=n(`<h1 id="詞典擴展包" tabindex="-1">詞典擴展包 <a class="header-anchor" href="#詞典擴展包" aria-label="Permalink to &quot;詞典擴展包&quot;">​</a></h1><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>librime 1.6.0 增加了一種擴展詞典內容的機制——詞典擴展包。可用於爲固定音節表的輸入方案添加詞彙。</p><p>固態詞典包含<code>*.table.bin</code>和<code>*.prism.bin</code>兩個文件。 前者用於存儲來自詞典源文件<code>*.dict.yaml</code>的數據，後者綜合了從詞典源文件中提取的音節表和輸入方案定義的拼寫規則。</p><p>擴充固態詞典內容，舊有在詞典文件的YAML配置中使用<code>import_tables</code>從其他詞典源文件導入碼表的方法。 此法相當於將其他源文件中的碼表內容追加到待編譯的詞典文件中，再將合併的碼表編譯成二進制詞典文件。</p><p>詞典擴展包可以達到相似的效果。其實現方式有所不同。 編譯過程中，將額外的詞典源文件<code>*.dict.yaml</code>生成對應的<code>*.table.bin</code>，其音節表與主碼表的音節表保持一致。 使用輸入方案時，\b按照<code>translator/packs</code>配置列表中的包名加載額外的<code>*.table.bin</code>文件，多表並用，從而一併查得擴充的詞彙。</p><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h2><p>我有一例，請諸位靜觀。</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 在Linux環境做出librime及命令行工具</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> librime</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 準備示例文件（有三）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 做一個構建擴展包專用的方案，以示如何獨立於主詞典的構建流程。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果不需要把擴展包和主詞典分開製備，也可以用原有的輸入方案。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin/luna_pinyin_packs.schema.yaml</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># Rime schema</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">schema:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  schema_id: luna_pinyin_packs</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">translator:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  dictionary: luna_pinyin_packs</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  packs:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    - sample_pack</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 代用的主詞典。因爲本示例只構建擴展包。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 做這個文件的目的是不必費時地編譯導入了預設詞彙表的朙月拼音主詞典。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果在主詞典的構建流程生成擴展包，則可直接使用主詞典文件。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin/luna_pinyin_packs.dict.yaml</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># Rime dict</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">---</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">name: luna_pinyin_packs</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">version: &#39;1.0&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">sort: original</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">use_preset_vocabulary: false</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import_tables:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  - luna_pinyin</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">...</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 擴展包源文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin/sample_pack.dict.yaml</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># Rime dict</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">---</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">name: sample_pack</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">version: &#39;1.0&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">sort: original</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">use_preset_vocabulary: false</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">...</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">粗鄙之語	cu bi zhi yu</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 製作擴展包</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./rime_deployer</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --compile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> luna_pinyin_packs.schema.yaml</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 構建完成後可丟棄代用的主詞典，只留擴展包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin/build/luna_pinyin_packs.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 重新配置朙月拼音輸入方案，令其加載先時生成的詞典擴展包</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./rime_patch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> luna_pinyin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;translator/packs&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;[sample_pack]&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 驗證詞典可查到擴展包中的詞語</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;cubizhiyu&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./rime_console</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h2 id="總結" tabindex="-1">總結 <a class="header-anchor" href="#總結" aria-label="Permalink to &quot;總結&quot;">​</a></h2><p>與編譯詞典時導入碼表的方法相比，使用詞典擴展包有兩項優勢：</p><ul><li>擴展包可以獨立於主詞典及其他擴展包單獨構建，增量添加擴展包不必重複編譯完整的主詞典，減少編譯時間及資源開銷；</li><li>詞典擴展包的編譯單元與詞典源文件粒度一致，方便組合使用，增減擴展包只須重新配置輸入方案。</li></ul><p>需要注意的是，查詢時使用主詞典的音節表，這要求擴展包使用相同的音節表構建。 目前librime並沒有機制保證加載的擴展包與主詞典兼容。用家須充分理解該功能的實現機制，保證數據文件的一致性。 這也意味着二進制擴展包不宜脫離於主詞典而製作和分發。</p>`,13),h=[p];function k(t,e,F,r,c,d){return a(),i("div",null,h)}const E=s(l,[["render",k]]);export{g as __pageData,E as default};
