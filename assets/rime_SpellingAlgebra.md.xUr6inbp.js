import{_ as e,c as a,o as n,U as l}from"./chunks/framework.WKpLpN6N.js";const b=JSON.parse('{"title":"拼寫運算詳解","description":"","frontmatter":{},"headers":[],"relativePath":"rime/SpellingAlgebra.md","filePath":"home.wiki/SpellingAlgebra.md"}'),i={name:"rime/SpellingAlgebra.md"},t=l(`<h1 id="拼寫運算詳解" tabindex="-1">拼寫運算詳解 <a class="header-anchor" href="#拼寫運算詳解" aria-label="Permalink to &quot;拼寫運算詳解&quot;">​</a></h1><p>佛振 <a href="mailto:chen.sst@gmail.com" target="_blank" rel="noreferrer">chen.sst@gmail.com</a></p><p>2012-02-14</p><h2 id="拼寫運算" tabindex="-1">拼寫運算 <a class="header-anchor" href="#拼寫運算" aria-label="Permalink to &quot;拼寫運算&quot;">​</a></h2><blockquote><p>「重現世間無匹好兵器，一發招覆雨驚天地。」</p></blockquote><p>Rime輸入法獨門絕活之「拼寫運算」，是按規則改寫編碼的形式、實現多種定製功能的技術。</p><h1 id="概念" tabindex="-1">概念 <a class="header-anchor" href="#概念" aria-label="Permalink to &quot;概念&quot;">​</a></h1><p>先來介紹本文所使用的術語：</p><ul><li>輸入法 : 以輸入信號的序列到輸出文本序列的轉換方法；Rime可搭載多種不同類型的輸入法，稱其爲「輸入方案」</li><li>字符集 : 構成目標輸出文本的字符的集合，主要由漢字組成</li><li>編碼 : 用於檢索目標字符的字母序列</li><li>字母 : 構成編碼的字符，亦稱「碼元」</li><li>字母表 : 字母的集合，亦稱「編碼字符集」，通常由小寫拉丁字母組成</li><li>碼表 : 目標字符集與編碼集合之間的映射表</li><li>碼長 : 單個編碼所包含的字母個數；碼表中所有編碼碼長一致，本文稱其爲「定長編碼」；規定了最大碼長的編碼方案，本文稱其爲「限長編碼」</li><li>編碼空間 : 給定的字母表以有限的碼長排列組合所得的可用編碼數目</li><li>音節表 : 輸入方案中所有編碼的集合；拼音輸入方案中，彼此不同的音節是可窮舉的，其音節表是個固定的集合；多數形碼輸入法按照一定規則在給定的編碼空間內爲新生詞組編碼，故無法給出固定的音節表</li><li>重碼 : 對應到多個輸出字符的編碼</li><li>輸入碼 : 用作輸入的字符序列</li><li>候選 : 與輸入碼相關聯的目標輸出文字；當有重碼時，候選文字形成一個列表可供用戶挑選</li><li>拼寫 : 與單個編碼相對應的輸入碼；拼寫可能不同於編碼</li><li>拼寫法 : 一種輸入方案裏，有效拼寫的集合到編碼集合的映射，亦稱「正字法」</li><li>拼寫運算 : 以拼寫爲運算元的一元運算，通過字符串匹配及替換操作對拼寫實施文字變換，獲得一個新的拼寫，並可賦予結果附加的屬性</li><li>投影 : 以拼寫法爲運算元的一元運算，獲得一個衍生的拼寫法；實際運用時，通常對拼寫法連續執行一組投影操作；每一輪操作中，對拼寫法裏的每個有效拼寫做一次拼寫運算，從而獲得新的有效拼寫集合，並重新建立其與編碼集合的映射</li></ul><h2 id="功能" tabindex="-1">功能 <a class="header-anchor" href="#功能" aria-label="Permalink to &quot;功能&quot;">​</a></h2><p>傳統的中文輸入法是基於碼表的，通過鍵盤輸入特定字母序列，獲得與該編碼對應的文字。 而大多數編碼方案，都不會用盡編碼空間內的所有編碼；與字符集內的文字無對應的編碼，就在編碼空間中形成空位。 爲了提高輸入效率，輸入法會利用編碼空間中的空位，編製簡碼、容錯碼等衍生編碼，以在儘量多的場合爲用戶提供有意義的候選文字。</p><p>在某些輸入方案裏，簡碼、容錯碼可以從源碼表按照一定規則產生。 如：漢語拼音輸入法中的簡拼，取拼音音節的首字母，也可取以雙字母表示的聲母zh、ch、sh。 這是因爲編碼方案所遵循的語言學原理，決定了拼音音節在編碼空間內的分佈及留下的空位，呈某種規則的形式。 故，產生簡碼、容錯碼的規則是與輸入方案相關的，一款通用的輸入法軟件要以與編碼方案相適應的方式生成這些衍生編碼。</p><p>拼寫運算，提供了描述產生式規則的能力！</p><p>爲了提供多樣化的輸入體驗，Rime可藉由一份碼表製作多款輸入方案。 譬如：注音符號、漢語拼音這兩套註音方案是爲相同音系設計的（忽略地區間字音標準的差異）。 今有一份注音碼表，按一定對應規則將注音轉換爲漢語拼音，可使注音、漢語拼音，甚至還有基於漢語拼音的雙拼等輸入方案復用同一部詞典。</p><p>拼寫運算，提供爲輸入方案重構拼寫法的能力！</p><p>此外，改變編碼回顯的樣式、按特定規則生成詞組編碼……拼寫運算也可用來實現此等需要定製能力的算法。</p><h2 id="原理與實現" tabindex="-1">原理與實現 <a class="header-anchor" href="#原理與實現" aria-label="Permalink to &quot;原理與實現&quot;">​</a></h2><p>拼寫運算，藉助正則表達式實現其字符串處理能力。 進一步，利用數學知識，構造出建立在輸入法編碼集合上的代數系統。</p><p>拼寫運算實現爲Rime程序庫中的一套算法，可從Rime配置文件導入一組算式，執行規定的計算步驟。 運算步驟以YAML字符串列表的形式定義；每個列表項爲描述一項運算的算式。 算式中包含的正則表達式，遵照Perl正則表達式的語法規範。</p><h3 id="拼寫運算的算式" tabindex="-1">拼寫運算的算式 <a class="header-anchor" href="#拼寫運算的算式" aria-label="Permalink to &quot;拼寫運算的算式&quot;">​</a></h3><pre><code>格式爲：&lt;運算子&gt;&lt;分隔符&gt;&lt;參數1&gt;&lt;分隔符&gt;&lt;參數2&gt;&lt;分隔符&gt;...
分隔符爲單個ASCII字符，通常用符號或空白字符。
舉例：
xlit/abc/ABC/
上式中，運算子爲 xlit（轉寫），分隔符爲“/”，有兩個參數 &quot;abc&quot;、&quot;ABC&quot;
如果參數中不包含空格，也可寫作：
xlit abc ABC
注意：作爲分隔符的字符不能在參數中出現；不同於Perl的 s/\\//\\\\/ 語法：拼寫運算式不支持在參數中將用作分隔符的字符用“\\”轉義表示。
</code></pre><h3 id="拼寫運算的運算子" tabindex="-1">拼寫運算的運算子 <a class="header-anchor" href="#拼寫運算的運算子" aria-label="Permalink to &quot;拼寫運算的運算子&quot;">​</a></h3><pre><code>* 轉寫／Transliteration : 依次將拼寫中見於&lt;左字母表&gt;的字符替換爲&lt;右字母表&gt;對應位置的字符。左、右字母表應包含相同數目的Unicode字符。

 格式：xlit/&lt;左字母表&gt;/&lt;右字母表&gt;/
 實例：算式 xlit/abc/ABC/  運算元 abracadabra  結果 ABrACAdABrA
 
* 變形／Transformation : 若拼寫（或其子串）與&lt;模式&gt;匹配，則將所匹配的部份改寫爲&lt;替換式&gt;；否則拼寫保持不變。模式、替換式遵循Perl正則表達式語法。

 格式：xform/&lt;模式&gt;/&lt;替換式&gt;/
 實例：算式 xform/^([nl])ue$/$1ve/  運算元 nue  結果 nve
 效果：輸入nve(lve)可以獲得源碼表中與編碼nue(lue)對應的候選；輸入nue(lue)無候選

* 消除／Erasion : 若拼寫與&lt;模式&gt; 完 全 匹配，則將該拼寫從有效拼寫集合中消除。

格式：erase/&lt;模式&gt;/
實例：算式 erase/^.*\\d$/  運算元 dang1  結果 帶聲調的拼音不再可用

* 派生／Derivation : 若對拼寫做正則模式匹配、替換而獲得了新的拼寫，則有效拼寫集合同時包含派生前後的拼寫；否則僅保留原拼寫。

 格式：derive/&lt;模式&gt;/&lt;替換式&gt;/
 實例一：算式 derive/^([nl])ue$/$1ve/  運算元 nue  結果 nve
 效果：輸入nve或nue(lve或lue)均可獲得源碼表中與編碼nue(lue)對應的候選

 實例二：算式 derive/^[nl](.*)$/l$1/  運算元 na  結果 la
 效果：輸入la可獲得源碼表中與編碼na、la對應的候選；輸入na，候選仍爲碼表中編碼爲na的候選

* 模糊／Fuzzing : 執行派生運算；派生出的拼寫將獲得「模糊」屬性，可設定將其用作構成詞組的簡碼、但不用於輸入單字。

 格式：fuzz/&lt;模式&gt;/&lt;替換式&gt;/
 實例：算式 fuzz/^([a-z]).+([a-z])$/$1$2/
 效果：以首、尾碼爲多字母音節碼的構詞碼。
     註：需配合 script_translator 的選項 \`translator/strict_spelling: true\` 方可限定該拼寫不用於輸入單字。

* 縮略／Abbreviation : 執行派生運算；派生出的拼寫將獲得「縮略」屬性，會在音節切分時與通常的拼寫做區分處理。

 格式：abbrev/&lt;模式&gt;/&lt;替換式&gt;/
 實例：算式 abbrev/^([a-z]).+$/$1/
 效果：以首字母爲多字母音節碼的縮寫。
</code></pre><p>註解：</p><ul><li><p>「轉寫」是拼寫運算中目前唯一一則將運算元和參數作UTF-32編碼、而非UTF-8編碼處理的運算。 意味着，字母表可以採用ASCII範圍以外的字符、字母表的長度按照Unicode字符數來計算。</p></li><li><p>「轉寫」和「變形」兩則運算，除在拼寫法投影操作中起重要作用，還可用於對單個字符串進行變換。 「消除」、「派生」和「縮略」，則專爲拼寫法投影操作引入更多變化。</p></li><li><p>「消除」就給定的模式，對運算元做完全匹配，即regex match操作； 「變形」、「派生」和「縮略」則可做部份匹配，相當於regex search/global replace操作。</p></li></ul><h3 id="投影算法" tabindex="-1">投影算法 <a class="header-anchor" href="#投影算法" aria-label="Permalink to &quot;投影算法&quot;">​</a></h3><p>在拼寫法投影操作P[x,y,z]裏，每項運算x, y, z作爲投影的一個步驟，依次從作爲運算元的拼寫法中產生一套新的拼寫法； 將拼寫法投影用於構建拼寫－編碼映射時，用戶的輸入是隨意的；而碼表中，音節表是固定的集合A。</p><p>所以Rime選音節表A上的初始拼寫法(A -&gt; A)爲投影的運算元，逐步推導出映射到音節表A的有效拼寫集合B，即所求的拼寫法(B -&gt; A)。</p><p>算法：</p><pre><code>記音節表爲A，拼寫運算爲序列[x,y,z]，該投影的結果記爲 P[x,y,z](A -&gt; A)
Sa = { a -&gt; a | for a in A } = (A -&gt; A)
Sx = P&lt;x&gt;(Sa) = { x(a) -&gt; a | for (a -&gt; a) in (A -&gt; A) } = (B -&gt; A)
Sy = P&lt;y&gt;(Sx) = { y(b) -&gt; a | for (b -&gt; a) in (B -&gt; A) } = (C -&gt; A)
Sz = P&lt;z&gt;(Sy) = { z(c) -&gt; a | for (c -&gt; a) in (C -&gt; A) } = (D -&gt; A)
P[x,y,z](Sa) = Sz
</code></pre><h3 id="在rime輸入方案中的用法" tabindex="-1">在Rime輸入方案中的用法 <a class="header-anchor" href="#在rime輸入方案中的用法" aria-label="Permalink to &quot;在Rime輸入方案中的用法&quot;">​</a></h3><p>一例：倉頡輸入方案(cangjie5.schema.yaml)，在編碼區回顯倉頡字母</p><pre><code>translator:
  preedit_format:
    - xlit|abcdefghijklmnopqrstuvwxyz|日月金木水火土竹戈十大中一弓人心手口尸廿山女田難卜符|
</code></pre><p>一例：朙月拼音(luna_pinyin.schema.yaml)，顯示拼音字母“ü”</p><pre><code>translator:
  preedit_format:
    - xform/([nl])v/$1ü/
</code></pre><p>這一處，拼寫運算的作用對象是編碼回顯區的拼音串，串中可能包含多個拼音音節，並已經自動插入了隔音符號。 爲了替換該拼音段中所有匹配的字母，模式中並未用錨點匹配音節的頭尾位置。</p><p>一例：朙月拼音(luna_pinyin.schema.yaml)，定義簡拼、容錯拼寫。</p><pre><code>speller:
  algebra:
    - abbrev/^([a-z]).+$/$1/          # 簡拼（首字母）
    - abbrev/^([zcs]h).+$/$1/         # 簡拼（zh, ch, sh）
    - derive/^([nl])ve$/$1ue/         # 設 nue = nve, lue = lve 
    - derive/ui$/uei/                 # 設 guei = gui,...
    - derive/iu$/iou/                 # 設 jiou = jiu,...
    - derive/([aeiou])ng$/$1gn/       # 容錯 dagn = dang,...
    - derive/ong$/on/                 # 容錯 zhonguo = zhong guo
    - derive/ao$/oa/                  # 容錯 hoa = hao,...
    - derive/([iu])a(o|ng?)$/a$1$2/   # 容錯 tain = tian,...
</code></pre><p>編譯輸入方案時，將運用這組運算規則完成音節表上的投影，求得可解析爲音節代碼的有效拼寫集合； 輸入過程中，這組有效拼寫決定着輸入碼的音節切分方式。</p><p>一例：在拼音輸入法中定義模糊音 zh=z, ch=c, sh=s, n=l, en=eng, in=ing</p><pre><code>speller:
  algebra:
    - derive/^([zcs])h/$1/
    - derive/^([zcs])([^h])/$1h$2/
    - derive/^n/l/
    - derive/^l/n/
    - derive/([ei])n$/$1ng/
    - derive/([ei])ng$/$1n/
    # 模糊音定義先於簡拼定義，可令簡拼支持以上模糊音
    - abbrev/^([a-z]).+$/$1/
    - abbrev/^([zcs]h).+$/$1/
</code></pre><h2 id="工具" tabindex="-1">工具 <a class="header-anchor" href="#工具" aria-label="Permalink to &quot;工具&quot;">​</a></h2><p>除Rime輸入法主程序外，拼寫運算還用於：</p><ul><li>輸入方案部署工具：將投影所得的拼寫法製成Prism文件，供Rime輸入法於工作時快速訪問</li><li><a href="http://rime.github.io/blog/2013/08/28/spelling-algebra-debugger/" target="_blank" rel="noreferrer">拼寫運算調試器</a>：創作輸入方案時，用此工具調試算式、驗證運算結果</li></ul><h2 id="討論" tabindex="-1">討論 <a class="header-anchor" href="#討論" aria-label="Permalink to &quot;討論&quot;">​</a></h2><p>拼寫運算技術及應用技巧，你有好的話題，請在本頁或 <a href="https://rime.im/discuss" target="_blank" rel="noreferrer">Rime 官網討論頁</a> 留言。</p>`,46),r=[t];function o(p,h,c,d,g,s){return n(),a("div",null,r)}const m=e(i,[["render",o]]);export{b as __pageData,m as default};
