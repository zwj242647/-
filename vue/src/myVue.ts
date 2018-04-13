class Vue {
    //当前层的vue对象
    private data: any = {};    //存放vue的数据对象
    private watch: any;     //监听器
    private vDom: any = {}; //动态渲染队列

    //构造函数
    constructor({ id, data, watch }: { id: string, data: any, watch: any }) {
        let frag: any = document.createDocumentFragment();
        let app: any = document.querySelector(id);
        frag.appendChild(app);
        this.watch = watch;
        this.createVueObj(data, this.data);
        this.VDom(frag);
        document.body.appendChild(frag);
    }

    //dom渲染
    private VDom(dom: any) {
        dom.appendChild(document.createElement('p'));

        for (let i = 0; i < dom.children.length; i++) {     //后续遍历dom树
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
                    this.vDom[keys[keys.length-1]] = [];
                    let elCl = curDom.cloneNode(true).innerText;  //克隆dom中的文本
                    this.vDom[keys[keys.length-1]].push((newData: string) => {  //添加到动态渲染队列
                        curDom.innerText = elCl.replace(check, newData);
                    })
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
    private createVueObj(data: any, obj: any, fore?: string) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) { //key是否有效
                //添加set，get监听
                let curVal = obj[key];
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    set: (newData: any) => {
                        //watch监听器
                        this.watch.hasOwnProperty(fore || key) ? this.watch[fore || key]() : null;
                        curVal = newData;
                        this.vDom[key].forEach((cb: any) => {
                            cb(newData);
                        });
                        console.log(`触发了${key}的set,当前新值为：${curVal}`);

                    },
                    get: () => {
                        console.log(`触发了${key}的get`);
                        return curVal;
                    },
                })
                if (typeof data[key] === 'object') {    //是否为深层次，需要递归否
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
