class Mark {
    //dom容器
    private codeContainer: any = document.getElementById('code');
    private lineContainer: any = document.getElementById('line');
    private showContainer: any = document.getElementById('show');

    private _line: number = this.lineContainer.children.length;
    private code: Array<any>;
    private show: any = document.createDocumentFragment();
    private init: boolean = true;

    //列表容器
    private list: { type: string, dom: any } = {
        type: undefined,
        dom: undefined
    };

    private js: { code: Array<string>, temCode: string, end: boolean } = {
        code: [],
        temCode: '',
        end: true
    };

    //构造函数
    constructor() {
        this.line = this.codeContainer.children.length;
        this.translte();
        this.init ? this.showContainer.appendChild(this.show) : null;
        this.init = false;
    }

    //每次设置新的行数自动渲染dom
    set line(num: number) {
        let len: number = num - this.line;
        if (len > 0) {
            for (let i = 1; i <= len; i++) {
                let newLine: any = document.createElement('p');
                newLine.innerText = this.line + i;
                this.lineContainer.appendChild(newLine);
            }
        }
        if (len < 0) {
            let arrLen = this.lineContainer.children.length;
            for (let i = len; i < 0; i++) {
                this.lineContainer.children[arrLen + len].remove();
            }
        }
    }
    get line(): number {
        return this._line;
    }

    //code转dom入口
    public translte(): void {
        for (let element of this.codeContainer.children) {
            this.transform(element.innerText);
        };
        if (this.list.dom) {
            this.show.appendChild(this.list.dom);
            this.list.dom = undefined;
            this.list.type = undefined;
        }
        if (!this.init) {
            //删除show中节点，添加新的节点
            while (this.showContainer.hasChildNodes())  
            {
                this.showContainer.removeChild(this.showContainer.firstChild);
            }
            this.showContainer.appendChild(this.show);
        }
        else {
            for (let code of this.js.code) {
                let strFun = new Function(code);
                strFun();
            }
        }
    }

    //正则转换
    private transform(str: string): void {
        let h = new RegExp(/^#{1,6}\s/);    //h1-h6,匹配 1-6个#空格
        let hr = new RegExp(/^---$/);       //hr
        let code = new RegExp(/`[^`]+`/);      //code
        let strong = new RegExp(/\*\*.*\*\*/);  //strong
        let src = new RegExp(/^\[.*\]\((http|https|ftp):\/\/.*\)$/);  //src [文本](链接)
        let img = new RegExp(/^\!\[.*\]\((http|https|ftp):\/\/.*\)$/);    //img
        let ul = new RegExp(/^-\s/);
        let ol = new RegExp(/^\d+\.\s/);
        let newDom: any;    //dom
        if (h.test(str)) {
            let name = 'h' + (str.split('#').length - 1).toString();
            newDom = document.createElement(name);
            newDom.innerText = str.replace(h, '');
        }
        if (hr.test(str)) {
            newDom = document.createElement('hr');
        }
        if (code.test(str)) {
            newDom = document.createElement('p');
            str = str.replace(code, `<code>${str.match(code)[0].split('`')[1]}</code>`);
            newDom.innerHTML = str;
        }
        if (strong.test(str)) {
            newDom = document.createElement('p');
            str = str.replace(strong, `<strong>${str.match(strong)[0].split('**')[1]}</strong>`);
            newDom.innerHTML = str;
        }
        if (src.test(str)) {
            newDom = document.createElement('a');
            let text = str.match(/^\[.*\]/)[0];
            newDom.innerText = text.substr(1, text.length - 2);
            let attr = str.match(/\]\(.*\)/)[0];
            newDom.setAttribute('href', attr.substr(2, attr.length - 3));
        }
        if (img.test(str)) {
            newDom = document.createElement('img');
            let text = str.match(/^\!\[.*\]/)[0];
            newDom.innerText = text.substr(1, text.length - 2);
            let attr = str.match(/\]\(.*\)/)[0];
            newDom.setAttribute('src', attr.substr(2, attr.length - 3));
        }
        if (ul.test(str)) {
            let dom = document.createElement('li');
            dom.innerText = str.replace(ul, '');
            if (!this.list.type) {
                this.list.dom = document.createElement('ul');
                this.list.type = 'ul'
            }
            if (this.list.type !== 'ul') {
                this.show.appendChild(this.list.dom);
                this.list.dom = document.createElement('ul');
                this.list.type = 'ul'
            }
            this.list.dom.appendChild(dom);
            return;
        }
        if (ol.test(str)) {
            let dom = document.createElement('li');
            dom.innerText = str.replace(ol, '');
            if (!this.list.type) {
                this.list.dom = document.createElement('ol');
                this.list.type = 'ol'
            }
            if (this.list.type !== 'ol') {
                this.show.appendChild(this.list.dom);
                this.list.dom = document.createElement('ol');
                this.list.type = 'ol'
            }
            this.list.dom.appendChild(dom);
            return;
        }
        if (/^```javascript$/.test(str)) {
            this.js.end = false;
            return;
        }
        if (/^```$/.test(str)) {
            this.js.end = true;
            this.js.code.push(this.js.temCode);
            this.js.temCode = '';
            return;
        }
        if (!newDom) {
            if (this.js.end) {
                newDom = document.createElement('p');
                newDom.innerText = str;
            }
            else {
                this.js.temCode += str;
                return;
            }
        }

        this.show.appendChild(newDom);
    }
}
let mark = new Mark();

document.getElementById('code').addEventListener('input', () => {
    mark.translte();
})