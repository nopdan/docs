import{_ as e,c as a,o as i,U as n}from"./chunks/framework.WKpLpN6N.js";const h=JSON.parse('{"title":"Packages for Linux Distributions","description":"","frontmatter":{},"headers":[],"relativePath":"rime/RimeWithIBus.md","filePath":"home.wiki/RimeWithIBus.md"}'),s={name:"rime/RimeWithIBus.md"},l=n(`<blockquote><p>Building and installing ibus-rime.</p></blockquote><h1 id="packages-for-linux-distributions" tabindex="-1">Packages for Linux Distributions <a class="header-anchor" href="#packages-for-linux-distributions" aria-label="Permalink to &quot;Packages for Linux Distributions&quot;">​</a></h1><h2 id="archlinux" tabindex="-1">Archlinux <a class="header-anchor" href="#archlinux" aria-label="Permalink to &quot;Archlinux&quot;">​</a></h2><pre><code>pacman -S ibus-rime
</code></pre><h2 id="debian" tabindex="-1">Debian <a class="header-anchor" href="#debian" aria-label="Permalink to &quot;Debian&quot;">​</a></h2><p>Rime 已收錄於 <a href="https://wiki.debian.org/DebianJessie" target="_blank" rel="noreferrer">Debian Jessie</a> 及以上版本</p><pre><code>sudo apt-get install ibus-rime # or fcitx-rime
</code></pre><h2 id="gentoo" tabindex="-1">Gentoo <a class="header-anchor" href="#gentoo" aria-label="Permalink to &quot;Gentoo&quot;">​</a></h2><pre><code>emerge ibus-rime  # or fcitx-rime
</code></pre><h2 id="ubuntu" tabindex="-1">Ubuntu <a class="header-anchor" href="#ubuntu" aria-label="Permalink to &quot;Ubuntu&quot;">​</a></h2><p>Rime 已收錄於 <a href="http://old-releases.ubuntu.com/releases/12.10/" target="_blank" rel="noreferrer">Ubuntu 12.10 (Quantal Quetzal)</a> 及以上版本</p><pre><code>sudo apt-get install ibus-rime
</code></pre><p>安裝更多輸入方案：（推薦使用 <a href="https://github.com/rime/plum" target="_blank" rel="noreferrer">/plum/</a> 安裝最新版本）</p><pre><code># 朙月拼音（預裝）
sudo apt-get install librime-data-luna-pinyin
# 雙拼
sudo apt-get install librime-data-double-pinyin
# 宮保拼音
sudo apt-get install librime-data-combo-pinyin
# 注音、地球拼音
sudo apt-get install librime-data-terra-pinyin librime-data-bopomofo
# 倉頡五代（預裝）
sudo apt-get install librime-data-cangjie5
# 速成五代
sudo apt-get install librime-data-quick5
# 五筆86、袖珍簡化字拼音、五筆畫
sudo apt-get install librime-data-wubi librime-data-pinyin-simp librime-data-stroke-simp
# IPA (X-SAMPA)
sudo apt-get install librime-data-ipa-xsampa
# 上海吳語
sudo apt-get install librime-data-wugniu
# 粵拼
sudo apt-get install librime-data-jyutping
# 中古漢語拼音
sudo apt-get install librime-data-zyenpheng
</code></pre><h2 id="fedora-22" tabindex="-1">Fedora 22+ <a class="header-anchor" href="#fedora-22" aria-label="Permalink to &quot;Fedora 22+&quot;">​</a></h2><pre><code>sudo dnf install ibus-rime
</code></pre><h2 id="fedora-18-19" tabindex="-1">Fedora 18/19 <a class="header-anchor" href="#fedora-18-19" aria-label="Permalink to &quot;Fedora 18/19&quot;">​</a></h2><pre><code>sudo yum install ibus-rime
</code></pre><h2 id="opensuse-tumbleweed-15" tabindex="-1">OpenSUSE tumbleweed &amp; 15 <a class="header-anchor" href="#opensuse-tumbleweed-15" aria-label="Permalink to &quot;OpenSUSE tumbleweed &amp; 15&quot;">​</a></h2><pre><code>sudo zypper in ibus-rime
</code></pre><h2 id="solus" tabindex="-1">Solus <a class="header-anchor" href="#solus" aria-label="Permalink to &quot;Solus&quot;">​</a></h2><pre><code>sudo eopkg it ibus-rime
</code></pre><p>有手藝、有時間、熱心腸的Linux技術高手！ 請幫我把Rime打包到你喜愛的Linux發行版，分享給其他同學吧。</p><p>謝謝你們！</p><h1 id="manual-installation" tabindex="-1">Manual Installation <a class="header-anchor" href="#manual-installation" aria-label="Permalink to &quot;Manual Installation&quot;">​</a></h1><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><p>To build la rime, you need these tools and libraries:</p><ul><li>capnproto (for librime&gt;=1.6)</li><li>cmake</li><li>boost &gt;= 1.46</li><li>glog (for librime&gt;=0.9.3)</li><li>gtest (optional, recommended for developers)</li><li>libibus-1.0</li><li>libnotify (for ibus-rime&gt;=0.9.2)</li><li>kyotocabinet (for librime&lt;=1.2)</li><li>leveldb (for librime&gt;=1.3, replacing kyotocabinet)</li><li>libmarisa (for librime&gt;=1.2)</li><li>opencc</li><li>yaml-cpp</li></ul><p>Note: If your compiler doesn&#39;t fully support C++11, please checkout <code>oldschool</code> branch from <a href="https://github.com/rime/librime/tree/oldschool" target="_blank" rel="noreferrer">https://github.com/rime/librime/tree/oldschool</a></p><h2 id="build-and-install-ibus-rime" tabindex="-1">Build and install ibus-rime <a class="header-anchor" href="#build-and-install-ibus-rime" aria-label="Permalink to &quot;Build and install ibus-rime&quot;">​</a></h2><p>Checkout the repository:</p><pre><code>git clone https://github.com/rime/ibus-rime.git
cd ibus-rime
</code></pre><p>If you haven&#39;t installed dependencies (librime, rime-data), install those first:</p><pre><code>git submodule update --init
(cd librime; make &amp;&amp; sudo make install)
(cd plum; make &amp;&amp; sudo make install)
</code></pre><p>Finally:</p><pre><code>make
sudo make install
</code></pre><h2 id="configure-ibus" tabindex="-1">Configure IBus <a class="header-anchor" href="#configure-ibus" aria-label="Permalink to &quot;Configure IBus&quot;">​</a></h2><ul><li>restart IBus (<code>ibus-daemon -drx</code>)</li><li>in IBus Preferences (<code>ibus-setup</code>), add &quot;Chinese - Rime&quot; to the input method list</li></ul><p>Voilà !</p><h2 id="ibus-rime-on-ubuntu-12-04-安裝手記" tabindex="-1">ibus-rime on Ubuntu 12.04 安裝手記 <a class="header-anchor" href="#ibus-rime-on-ubuntu-12-04-安裝手記" aria-label="Permalink to &quot;ibus-rime on Ubuntu 12.04 安裝手記&quot;">​</a></h2><p>註：這篇文章過時了。</p><p>今天天氣不錯，我更新了一把Ubuntu，記錄下安裝 ibus-rime 的步驟。</p><pre><code># 安裝編譯工具
sudo apt-get install build-essential cmake

# 安裝程序庫
sudo apt-get install libopencc-dev libz-dev libibus-1.0-dev libnotify-dev

sudo apt-get install libboost-dev libboost-filesystem-dev libboost-regex-dev libboost-signals-dev libboost-system-dev libboost-thread-dev
# 如果不嫌多，也可以安裝整套Boost開發包（敲字少：）
# sudo apt-get install libboost-all-dev

# 下文略……
</code></pre><h2 id="ibus-rime-on-centos-7" tabindex="-1">ibus-rime on Centos 7 <a class="header-anchor" href="#ibus-rime-on-centos-7" aria-label="Permalink to &quot;ibus-rime on Centos 7&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>yum install -y gcc gcc-c++ boost boost-devel cmake make cmake3</span></span>
<span class="line"><span>yum install glog glog-devel kyotocabinet kyotocabinet-devel marisa-devel yaml-cpp yaml-cpp-devel gtest gtest-devel libnotify zlib zlib-devel gflags gflags-devel leveldb leveldb-devel libnotify-devel ibus-devel</span></span>
<span class="line"><span>cd /usr/src</span></span>
<span class="line"><span></span></span>
<span class="line"><span># install opencc</span></span>
<span class="line"><span>curl -L https://github.com/BYVoid/OpenCC/archive/ver.1.0.5.tar.gz | tar zx</span></span>
<span class="line"><span>cd OpenCC-ver.1.0.5/</span></span>
<span class="line"><span>make</span></span>
<span class="line"><span>make install</span></span>
<span class="line"><span>ln -s /usr/lib/libopencc.so /usr/lib64/libopencc.so</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cd /usr/src</span></span>
<span class="line"><span>git clone --recursive https://github.com/rime/ibus-rime.git</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cd /usr/src/ibus-rime</span></span>
<span class="line"><span># 下文略，同前文給出的安裝步驟</span></span></code></pre></div>`,45),t=[l];function o(r,u,p,d,c,b){return i(),a("div",null,t)}const g=e(s,[["render",o]]);export{h as __pageData,g as default};
