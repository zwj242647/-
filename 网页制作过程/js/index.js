const dom = '<div class="container-fluid"><nav><ul><li><img src="./img/logo.png" alt="logo"></li><li>网站首页</li><li>关于我们</li><li>产品展示</li><li>新闻中心</li><li>联系我们</li></ul></nav><section><div class="flex-left"><div class="unit-1"><img src="./img/01.jpg" alt="banner"></div></div><div class="flex-left"><div class="unit-1-2"><div class="detail"><h3>礼服系列</h3><p>view</p></div><img src="./img/cp1.jpg" alt="展品1"></div><div class="unit-1-2"><div class="detail"><h3>婚纱系列</h3><p>view</p></div><img src="./img/cp2.jpg" alt="展品2"></div></div><div class="flex-left"><div class="unit-1-2"><div class="detail"><h3>样片系列</h3><p>view</p></div><img src="./img/cp3.jpg" alt="展品3"></div><div class="unit-1-2"><div class="detail"><h3>中国风系列</h3><p>view</p></div><img src="./img/cp4.jpg" alt="展品4"></div></div><div class="flex-left"><div class="unit-1"><img src="./img/03.jpg" alt="展品5"></div></div></section><footer><div><img src="./img/call.jpg" alt="phone"> <img src="./img/wechat.jpg" alt="wechat"></div><small>Copyright © 最棒的我</small></footer></div>';
domArr = dom.split('');
const css = '*{transition:all .4s ease-out}nav>ul{display:flex;align-items:center;justify-content:space-evenly;margin:6px}nav{width:100%;height:70px;background-color:#000;position:fixed;top:0;z-index:100}nav img{max-height:100%}section{margin-top:70px}.container-fluid{padding:0}.unit-1-2{position:relative}.detail{cursor:pointer;z-index:50;position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,.4);padding:50% 0 0 10%;opacity:0}.detail>p{display:inline-block;padding:10px;border:1px solid #fff;cursor:pointer}.detail>p:hover{color:red;border-color:red}section img{width:100%;height:100%}.flex-left>div{overflow:hidden}.unit-1-2:hover>img{transform:scale(1.1)}.unit-1-2:hover>.detail{opacity:1}footer{min-height:calc(100vh - 70px);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}footer>div{width:100%;display:flex;justify-content:space-evenly}small{position:absolute;bottom:10px}';
cssArr = css.split('');

new Vue({
    el: '#app',
    data: {
        html: '',       //html结构渲染
        style: '',      //css渲染
        isHtml: true,   //控制标签
        htmlIndex: 0,   //循环索引
        cssIndex: 0,
        codeHide: false,
        bodyShow: false
    },
    methods: {
        renderHtml: function(){
            let that = this;
            let htmlInterval = setInterval(()=>{
                if(that.htmlIndex>domArr.length-2){
                    clearInterval(htmlInterval);
                    that.isHtml = false;
                    that.renderCss();
                }
                if(domArr[that.htmlIndex]==='>'&&domArr[that.htmlIndex+1] ==='<'){
                    that.html += (domArr[that.htmlIndex++]+'\r');
                }
                else{
                    that.html += domArr[that.htmlIndex++];
                }
            },30);
        },
        renderCss: function(){
            let cssText = document.getElementsByTagName('style')[0];
            let that = this;
            let cssInterval = setInterval(()=>{
                if(that.cssIndex>cssArr.length-3){
                    clearInterval(cssInterval);
                    this.finish();
                }
                if(cssArr[that.cssIndex]==='}'){
                    cssText.innerHTML += (cssArr[that.cssIndex]);
                    that.style += (';\n'+cssArr[that.cssIndex++]+'\n');
                }
                if(cssArr[that.cssIndex]==='{'||cssArr[that.cssIndex] ===';'){
                    cssText.innerHTML += (cssArr[that.cssIndex]);
                    that.style += (cssArr[that.cssIndex++]+'\n');
                }
                else{
                    cssText.innerHTML += cssArr[that.cssIndex];
                    that.style += cssArr[that.cssIndex++];
                }
            },30);
        },
        finish: function(){
            let that = this;
            this.codeHide = true;
            setTimeout(()=>{
                that.bodyShow = true;
            },440)
        }
    },
    mounted() {
        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
            alert("不兼容IE哦，请您使用最新版chrome内核的浏览器访问");
        }
        else{
            this.renderHtml();
        }
    }
})