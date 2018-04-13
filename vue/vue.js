//观察者模式（事件监听）
function Event() {
    this.events = {};   //事件容器，事件名为数组名，数组元素就是事件函数
    this.on = (eventType, cb) => {
        if (this.events.hasOwnProperty(eventType)) {
            this.events[eventType].push(cb);
        }
        else {
            this.events[eventType] = [cb];
        }
        return this;
    }
    this.off = (eventType) => {
        for (let key in this.events) {
            if (key === eventType) {
                delete this.events[key];
            }
        }
    }
    this.emit = function (eventType) {
        if (this.events.hasOwnProperty(eventType)) {
            let args = Array.prototype.slice.call(arguments, 1);    //等价于arguments.slice(1);只因为arguments没有slice方法
            for (let i = 0; i < this.events[eventType].length; i++) {
                this.events[eventType][i].apply(this, args);
            }
        }
        return this;
    }
}
// let event = new Event(); //观察者



//Vue构造函数
function Vue(data, path) {
    this.data = data;       //存放对象
    this.path = (path || 'root');   //指向父级
    this.event = new Event();   //观察者模式
    //后续遍历对象，确保深层数据也添加set和get
    this.create = (data) => {
        for (let key in data) {
            if (data.hasOwnProperty) {
                if (typeof data[key] === 'object') {
                    new Vue(data[key], this.path + '.' + key);
                }
                this.setAndGet(key, data[key]);
            }
        }
    }
    //添加set get
    this.setAndGet = (key, val) => {
        let that = this;
        Object.defineProperty(this.data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                console.log('您访问了:' + key);
                return val;
            },
            set: function (newVal) {
                if (typeof newVal === 'object') {
                    new Vue(newVal, that.path + '.' + key);
                }
                val = newVal;
                that.event.emit(key, val);  //订阅
                //拆解path,向上冒泡
                let parentEvents = that.path.split('.');
                for (let i = 0; i < parentEvents.length; i++) {
                    that.event.emit(parentEvents[i], val);
                }
                //绑定数据
                that.directive.forEach(element => {
                    let arr = element.path.split('.')
                    if(arr[arr.length-1]===key){
                        element.updata();
                    }
                });
                console.log('您为' + key + '设置的新值为:' + val);
            }
        })
    }
    //借助观察者实现watch
    this.$watch = function (key, cb) {
        this.event.on(key, cb); //发布
    }
    //指令（双向绑定）
    this.directive = new Array();


    this.create(this.data); //驱动
}


//遍历DOM匹配{{}}替换并添加指令
Vue.prototype.forDom = function (dom) {
    for (let i = 0; i < dom.children.length; i++) {     //后续遍历dom树
        let curDom = dom.children[i];
        if (curDom.length != 0) {
            this.forDom(curDom);
        }
        let check = /\{\{(.*)\}\}/;
        if(check.test(curDom.innerText)){
            let key = curDom.innerText.trim().match(check)[1];
            let keys = key.split('.');
            let dataVal=this.data;
            for(let i=0;i<keys.length;i++){
                dataVal = dataVal[keys[i]];
            }
            if(dataVal){
                this.directive.push(new Directive(curDom,key,this.data));
            }
        }
    }
}
Vue.prototype.createDir = function(){
    let frag = document.createDocumentFragment();
    let app = document.getElementById('app');
    frag.appendChild(app);
    this.forDom(frag);
    document.body.appendChild(frag);
}


function Directive(el,path,vm){
    let check = /\{\{(.*)\}\}/;
    this.path = path;
    this.vm = vm;
    this.el = el;
    this.elCl = el.cloneNode(true);
    this.updata = function(){
        let keys = path.split('.');
        let dataVal=this.vm;
        for(let i=0;i<keys.length;i++){
            dataVal = dataVal[keys[i]];
        }
        this.el.innerText = this.elCl.innerText.replace(/\{\{(.*)\}\}/,dataVal);
    }
    this.updata();
}



//测试对象
let data = new Vue({
    user: "admin",
    power: {
        test: "test",
        eat: {
            food: 'noodle',
            shit: 'myShit'
        }
    },
    test: "test"
});
data.$watch('test', () => {
    this.user = '改变了';
})
data.createDir();   //生成指令，双向绑定