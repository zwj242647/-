let show = document.getElementById('show');//在此渲染
// let ldr = document.getElementById('ldr');    //中序按钮
let dlr = document.getElementById('dlr');
let lrd = document.getElementById('lrd');
let search = document.getElementById('search');
let searchBtn = document.getElementById('searchBtn');
let add = document.getElementById('add');
let del = document.getElementById('del');
let treeArray = [];
//节点的构造函数(节点数据，父节点)
function Node(data, parent) {
    this.data = data;
    this.parent = parent || null;
    this.child = [];
}

//创建一个根节点的构造方法(节点数据)
function Tree(data) {
    let node = new Node(data);
    this.root = node;
}

//为二叉树生成一个dom节点(div上的文字)
function createNodeEle(text) {
    let ele = document.createElement('div');
    ele.innerHTML = text || '';
    return ele;
}

//追加子节点(父节点，div上的文字)
function addNode(tree, text) {
    tree.child.push(new Node(createNodeEle(text), tree));
    // tree.child[index].parent = tree;
}

//渲染二叉树(二叉树.root)
function render(tree, ele) {
    if (!!tree) {
        (ele || show).appendChild(tree.data)
        if (tree.child.length > 0) {
            for (let i = 0; i < tree.child.length; i++) {
                render(tree.child[i], tree.data);  //递归遍历
            }
        }
    }
}
let tree = new Tree(createNodeEle('root'));  //创建一个树(根节点)
addNode(tree.root, 'root');    //创建子节点
addNode(tree.root, '一');
addNode(tree.root, '三');
addNode(tree.root.child[0], 'asd');
addNode(tree.root.child[0], 'alo');
addNode(tree.root.child[1], '123');
addNode(tree.root.child[1], 'xz');
addNode(tree.root.child[1], 'js');
addNode(tree.root.child[2], 'as');
addNode(tree.root.child[0].child[0], 'rea');
addNode(tree.root.child[0].child[0], 'vue');
addNode(tree.root.child[0].child[1], 'css');
addNode(tree.root.child[0].child[1], 'ang');
addNode(tree.root.child[1].child[0], 'node');
addNode(tree.root.child[1].child[0], 'koa');
addNode(tree.root.child[1].child[1], 'exp');
// addNode(tree.root.child[1].child[1], 'eslint');
addNode(tree.root.child[0].child[0].child[0], 'jsl');
addNode(tree.root.child[0].child[0].child[0], 'ani');
addNode(tree.root.child[0].child[0].child[1], 'boo');
// addNode(tree.root.child[0].child[0].child[1],4);
// addNode(tree.root.child[0].child[1].child[0],4);
addNode(tree.root.child[0].child[1].child[0], 'jq');
// addNode(tree.root.child[0].child[1].child[1],4);
// addNode(tree.root.child[0].child[1].child[1],4);
// addNode(tree.root.child[1].child[0].child[0],4);
// addNode(tree.root.child[1].child[0].child[0],4);
// addNode(tree.root.child[1].child[0].child[1],4);
addNode(tree.root.child[1].child[0].child[1], 'can');
// addNode(tree.root.child[1].child[1].child[0],4);
addNode(tree.root.child[1].child[1].child[0], 'h5');
// addNode(tree.root.child[1].child[1].child[1],4);
// addNode(tree.root.child[1].child[1].child[1], 'fuck');

render(tree.root);  // 渲染二叉树

//中序遍历(只有二叉树能用，三叉无效)
// function LDR(tree) {
//     if(tree.data){
//         if(tree.child[0]){
//             LDR(tree.child[0]);
//         }
//         treeArray.push(tree.data);
//         if(tree.child[1]){
//             LDR(tree.child[1]);
//         }
//     }
// }

//前序遍历
function DLR(tree) {
    if (tree.data) {
        treeArray.push(tree.data);
        for (let i = 0; i < tree.child.length; i++) {
            DLR(tree.child[i]);
        }
        // if(tree.child[0]){
        //     DLR(tree.child[0]);
        // }
        // if(tree.child[1]){
        //     DLR(tree.child[1]);
        // }
    }
}

//后序遍历
function LRD(tree) {
    if (tree.data) {
        for (let i = 0; i < tree.child.length; i++) {
            LRD(tree.child[i]);
        }
        // if(tree.child[0]){
        //     LRD(tree.child[0]);
        // }
        // if(tree.child[1]){
        //     LRD(tree.child[1]);
        // }
        treeArray.push(tree.data);
    }
}

//闪烁函数
function animate(queryWord) {
    if (selectEle) {
        selectEle.style.backgroundColor = '#fff';
    }
    let queryF = queryWord?false:true;
    let i = 0
    let timer = setInterval(() => {
        if (i >= treeArray.length) {
            treeArray[i - 1].style.backgroundColor = '#fff';  //重置最后一个颜色
            treeArray = [];         //重置数组
            clearInterval(timer);
            if (!queryF) {
                alert('未找到');
            }
            return;
        }
        treeArray[i].style.backgroundColor = '#a00';
        if (i > 0) {
            treeArray[i - 1].style.backgroundColor = '#fff';
            if (queryWord && queryWord == treeArray[i].childNodes[0].data) {
                alert('找到结果了');
                i = treeArray.length; //下次循环终止
                queryF = true;
            }
        }
        i++;
    }, 500)
}


dlr.addEventListener('click', () => {
    DLR(tree.root);
    animate();
});
// ldr.addEventListener('click', () => {
//     LDR(tree.root);
//     animate();
// })
lrd.addEventListener('click', () => {
    LRD(tree.root);
    animate();
});

searchBtn.addEventListener('click', () => {
    let queryWord = search.value;
    LRD(tree.root);
    animate(queryWord);
});

let selectEle;
//选中
show.addEventListener('click', (e) => {
    let ev = e || window.event;
    let target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() === 'div') {
        if (selectEle) {
            selectEle.style.backgroundColor = '#fff';
        }
        selectEle = target;
        target.style.backgroundColor = '#a61';
    }
});

//从树中拿出当前元素节点(当前元素，树)
// let getObjF = false;
function getObj(ele, tree) {
    if (ele === tree.data) {
        return tree;
    }
    if (tree.child.length > 0) {
        for (let i = 0; i < tree.child.length; i++) {
            getObj(ele, tree.child[i]);
        }
    }
}
add.addEventListener('click', () => {
    addEle(tree.root)
});
del.addEventListener('click', () => {
    delEle(tree.root);
})

//匹配需要删除的元素
let parentIndex = 0;
function delEle(tree){
    if(tree.data===selectEle){
        delSonEle(tree);
        tree.parent.child.splice(parentIndex,1);
    }
    else if(tree.child.length>0){
        for(let i = 0 ;i<tree.child.length;i++){
            parentIndex=i;
            delEle(tree.child[i]);
        }
    }
}

//后续逐层删除元素（防止追加异常）
function delSonEle(tree){
    if (tree.data) {
        for (let i = 0; i < tree.child.length; i++) {
            delSonEle(tree.child[i]);
        }

        tree.data.remove();
    }
}

//追加子节点
function addEle(tree){
    let text = search.value;
    if(tree.data===selectEle){
        addNode(tree, text);
        tree.data.appendChild(tree.child[tree.child.length-1].data);
    }
    else if(tree.child.length>0){
        for(let i = 0 ;i<tree.child.length;i++){
            addEle(tree.child[i]);
        }
    }
}