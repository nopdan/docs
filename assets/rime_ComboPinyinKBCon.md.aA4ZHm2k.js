import{_ as e,c as o,o as a,U as r}from"./chunks/framework.WKpLpN6N.js";const u=JSON.parse('{"title":"宮保拼音·鍵盤控式","description":"","frontmatter":{},"headers":[],"relativePath":"rime/ComboPinyinKBCon.md","filePath":"home.wiki/ComboPinyinKBCon.md"}'),c={name:"rime/ComboPinyinKBCon.md"},n=r(`<h1 id="宮保拼音·鍵盤控式" tabindex="-1">宮保拼音·鍵盤控式 <a class="header-anchor" href="#宮保拼音·鍵盤控式" aria-label="Permalink to &quot;宮保拼音·鍵盤控式&quot;">​</a></h1><p>Rime 輸入方案：<a href="https://github.com/rime/rime-combo-pinyin/blob/master/combo_pinyin_kbcon.schema.yaml" target="_blank" rel="noreferrer"><code>combo_pinyin_kbcon</code></a></p><p><a href="https://github.com/rime/plum" target="_blank" rel="noreferrer">東風破</a> 安裝口令： <code>bash rime-install combo-pinyin</code></p><h2 id="簡介" tabindex="-1">簡介 <a class="header-anchor" href="#簡介" aria-label="Permalink to &quot;簡介&quot;">​</a></h2><p>[[宮保拼音|ComboPinyin]] 是一種爲 PC 鍵盤設計的多鍵並擊輸入拼音的方法。</p><p>本式改進了原《宮保拼音》方案（以下稱其爲「大衆式」），將其應用於拇指位有左右各一按鍵的特製鍵盤， 進一步優化了組合聲母的指法，使左手的操作難度和思維負擔減輕，從而提高舒適感。（見文末創作者自我測評）</p><p>本方案共使用 20 枚按鍵，以雙手除小指外的 8 個手指並擊 1 ~ 6 枚不等的按鍵。</p><h2 id="佈局" tabindex="-1">佈局 <a class="header-anchor" href="#佈局" aria-label="Permalink to &quot;佈局&quot;">​</a></h2><pre><code>    Ln  Dt          u   I   O
S   Cr  Z*  Gk      i*  N   E
    Fm  Bp      er  yu  U   E&#39;
            H*  A*

標「*」的按鍵爲拇指、食指的基準鍵位
E&#39; 是 E 的活用鍵位，只用於組合韻母
</code></pre><p>說明：聲母部分已精簡並重新排列，<code>G</code> 與 <code>S</code> 匹配 QWERTY 鍵盤的 G 鍵與 S 鍵，高頻的 <code>Z</code>、<code>C</code>、<code>S</code> 安置在定位行。</p><h2 id="組合鍵" tabindex="-1">組合鍵 <a class="header-anchor" href="#組合鍵" aria-label="Permalink to &quot;組合鍵&quot;">​</a></h2><p>「鍵盤控式」組合聲母</p><pre><code>BH = p, BF = m, DH = t, DL = n, GH = k,
ZH = zh, CH = ch, SH = sh, ZC = r
</code></pre><p>說明：聲母 <code>p</code>、<code>t</code>、<code>k</code> 由 <code>b</code>、<code>d</code>、<code>g</code> 組合作爲送氣標記的 <code>h</code> 並擊輸入；<code>zh</code>、<code>ch</code>、<code>sh</code> 直觀地取漢語拼音的寫法。 次濁聲母 <code>m</code>、<code>n</code>、<code>r</code> 以食指、中指並擊同一排（同屬一組聲母）的兩枚聲母鍵。</p><p>組合韻母及活用（同「大衆式」），括弧內爲活用組合</p><pre><code>AI = ai, EI (OI) = ei, AU = ao, U (E&#39;U) = ou,
uI = uei, uAI = uai, iU (yuU) = iou, iAU (yuAU) = iao,
N = en, NE = eng, AN = an, ANE = ang,
iN = in, uN = uen, yuN = yun,
iNE = ing, uNE (uIO) = ong, yuNE (yuUE&#39;) = iong,
uANE (uAIO) = uang
</code></pre><p><img src="https://github.com/rime/home/raw/master/images/combo-pinyin-kbcon-chicory-relabeled.jpg" alt="宮保拼音·鍵盤控式"></p><p><a href="https://github.com/rime/home/raw/master/images/combo-pinyin-kbcon-amj40.jpg" target="_blank" rel="noreferrer">另一幅狂放的實拍鍵位圖</a></p><h2 id="適用鍵盤型號及固件" tabindex="-1">適用鍵盤型號及固件 <a class="header-anchor" href="#適用鍵盤型號及固件" aria-label="Permalink to &quot;適用鍵盤型號及固件&quot;">​</a></h2><p>理論上，凡左右手拇指位各有一獨立按鍵的可編程鍵盤皆適用。</p><p>只需要將左手拇指位置的按鍵編程爲左 Control 鍵，對應宮保拼音碼 <code>H</code>；右手拇指操作空格鍵。其他按鍵沿用 QWERTY 佈局。</p><p>該左手拇指鍵也可編程爲左 Shift 鍵、分號鍵等。在輸入方案代碼中設有相應的開關。 如果選用 Control 鍵，請在系統設置裏禁用 Control+space 等與宮保拼音輸入有衝突的快捷鍵。</p><p>筆者已將本式宮保拼音用於以下鍵盤型號：</p><ul><li>AMJ40: <code>make amj40:kbcon</code></li><li>crkbd: <code>make crkbd:kbcon</code></li><li>Ergodox: <code>make ergodox_ez:kbcon</code></li></ul><p>以上鍵盤的固件程序： <a href="https://github.com/lotem/qmk_firmware" target="_blank" rel="noreferrer">https://github.com/lotem/qmk_firmware</a></p><p>本式宮保拼音亦可用於標準 PC 鍵盤，對其兼容的佈局和指法詳見下文。</p><p>本式用於 PC 鍵盤時，因爲用到中排第 1 列左手小指控制下的按鍵參與並擊，經實驗發現在一些鍵盤上更容易發生按鍵衝突。因此相對於「大衆式」，本式對鍵盤的並擊性能更爲挑剔。</p><h2 id="「鍵盤控」兼容佈局" tabindex="-1">「鍵盤控」兼容佈局 <a class="header-anchor" href="#「鍵盤控」兼容佈局" aria-label="Permalink to &quot;「鍵盤控」兼容佈局&quot;">​</a></h2><p>該佈局是對「鍵盤控式」宮保拼音佈局的擴展，使其適用標準 PC 鍵盤。</p><p>主要區別是不使用左手拇指位 <code>H</code> 鍵，而改用主鍵盤區中排第 1 列的 <code>H&#39;</code> 鍵，由左手小指操作。</p><p>librime&gt;=1.6 以上版本，還可使用標準鍵位的左 Control 鍵或左 Shift 鍵代替 <code>H</code> 鍵，也用左手小指操作。</p><p>「鍵盤控」兼容佈局由同一個輸入方案 <code>combo_pinyin_kbcon</code> 實現。如果不需要用到 Control 鍵並擊，可以在輸入方案裏關閉相關的代碼補丁。</p><pre><code>   (C&#39;) Ln  Dt (T&#39;)     u   I   O
H&#39;  S   Cr  Z*  Gk      i*  N   E
   (Z&#39;) Fm  Bp (P&#39;) er  yu  U   E&#39;
                    A*

標「*」的按鍵爲拇指、食指的基準鍵位
加 () 的冗餘按鍵，是爲方便用家從「大衆式」過渡到本式而增設
</code></pre><h2 id="組合鍵增補" tabindex="-1">組合鍵增補 <a class="header-anchor" href="#組合鍵增補" aria-label="Permalink to &quot;組合鍵增補&quot;">​</a></h2><p>PC 鍵盤組合聲母及活用</p><pre><code>BH&#39; (BZ&#39;) = p, BF = m, DH&#39; (DC&#39;) = t, DL = n, GH&#39; (GC) = k,
ZH&#39; (ZS) = zh, CH&#39; = ch, SH&#39; = sh, ZC = r
</code></pre><p>兼容「大衆式」聲母</p><pre><code>P&#39; = p, T&#39; = t, FZ&#39; = zh, LC&#39; = ch, CS = sh
</code></pre><p>組合韻母及活用（同上文、亦同「大衆式」）</p><h2 id="創作者自我測評" tabindex="-1">創作者自我測評 <a class="header-anchor" href="#創作者自我測評" aria-label="Permalink to &quot;創作者自我測評&quot;">​</a></h2><p>筆者由「大衆式」切換到「鍵盤控式」以來，打字技巧又有所提高。</p><p>主觀感受是按鍵更省力、對思維的干擾也小一些。略加練習已經可以跟打節奏較爲舒緩的歌詞了。 <a href="https://www.youtube.com/watch?v=Qsvtb4oNwoQ" target="_blank" rel="noreferrer">視頻演示（菜）</a></p><p>這歸因於本式佈局和指法簡化、規律性更強、更充分地利用了拇指的優勢並擊能力。</p>`,43),i=[n];function t(d,p,h,l,m,s){return a(),o("div",null,i)}const _=e(c,[["render",t]]);export{u as __pageData,_ as default};
