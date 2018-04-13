class Vue {
    //构造函数
    constructor({ id, data, watch }) {
        //当前层的vue对象
        this.data = {}; //存放vue的数据对象
        this.vDom = {}; //动态渲染队列
        let frag = document.createDocumentFragment();
        let app = document.querySelector(id);
        frag.appendChild(app);
        this.watch = watch;
        this.createVueObj(data, this.data);
        this.VDom(frag);
        document.body.appendChild(frag);
    }
    //dom渲染
    VDom(dom) {
        dom.appendChild(document.createElement('p'));
        for (let i = 0; i < dom.children.length; i++) {
            let curDom = dom.children[i];
            if (0 in curDom.children) {
                this.VDom(curDom);
            }
            else {
                let check = /\{\{(.*)\}\}/;
                if (check.test(curDom.innerText)) {
                    //{{}}中的值
                    let key = curDom.innerText.trim().match(check)[1];
                    //{{}}中有多个点解析
                    let keys = key.split('.');
                    let newData = this.data;
                    for (let i of keys) {
                        newData = newData[i];
                    }
                    this.vDom[keys[keys.length - 1]] = [];
                    let elCl = curDom.cloneNode(true).innerText; //克隆dom中的文本
                    this.vDom[keys[keys.length - 1]].push((newData) => {
                        curDom.innerText = elCl.replace(check, newData);
                    });
                    curDom.innerText = curDom.innerText.replace(check, newData);
                }
            }
        }
    }
    /*
    * 创建vue对象
    * @param：原数据
    * @param：原数据的父容器
    * @fore?： 祖先名称（watch用）
     */
    createVueObj(data, obj, fore) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                //添加set，get监听
                let curVal = obj[key];
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    set: (newData) => {
                        //watch监听器
                        this.watch.hasOwnProperty(fore || key) ? this.watch[fore || key]() : null;
                        curVal = newData;
                        this.vDom[key].forEach((cb) => {
                            cb(newData);
                        });
                        console.log(`触发了${key}的set,当前新值为：${curVal}`);
                    },
                    get: () => {
                        console.log(`触发了${key}的get`);
                        return curVal;
                    },
                });
                if (typeof data[key] === 'object') {
                    curVal = {};
                    this.createVueObj(data[key], curVal, fore || key);
                }
                else {
                    curVal = data[key];
                }
            }
        }
    }
}
let app1 = new Vue({
    id: '#app',
    data: {
        name: 'youngwind',
        age: 25,
        eat: {
            food: 'noodle',
            shit: 'myShit',
            test: {
                a: 2,
            }
        }
    },
    watch: {
        eat: () => {
            console.log('eat中的元素被改变');
        },
        age: () => {
            console.log(this.eat.food);
        }
    },
});
//# sourceMappingURL=myVue.js.map