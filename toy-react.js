const RENDER_TO_DOM = Symbol("render to dom");
class ElementWrapper {
    constructor(type){
        this.root = document.createElement(type);
    }
    setAttribute(name,value){
        // [\s\S]表示所有的字符 ,以on开头的取出来，绑定事件
        if(name.match(/^on([\s\S]+)$/)){
            // RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()  确保第一个字母是小写字母开头的
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
        }else {
            this.root.setAttribute(name, value);
        }
    }
    appendChild(component){
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
        // this.root.appendChild(component.root);  //?? 为什么不能用这种形式了？
    }

    [RENDER_TO_DOM](range) {
        // 先把里面内容删掉
        range.deleteContents();
        // 然后插入新内容
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(content){
        this.root = document.createTextNode(content);
    }

    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }

}

export class Component {
    constructor(){
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }
    setAttribute(name,value){
        this.props[name] = value;
    }
    appendChild(component){
        this.children.push(component);
    }

    // 思想要发生一个变化，我们从取一个元素变成了把它渲染进一个range里

    /**
     * 这个[RENDER_TO_DOM](range)方法里的 this.render() 可能会返回组件或者ElementWrapper或者TextWrapper，
     * 但是经过递归，最终都会返回ElementWrapper或者TextWrapper，而调用这两个Wrapper里面[RENDER_TO_DOM](range)方法就是在重新渲染
     *
     * 真正的渲染是在ElementWrapper和TextWrapper里的[RENDER_TO_DOM](range)方法
     */

    //这里要给它传一个位置
    // DOM API 里面，什么API是跟位置对应的呢？答案是Range API
    [RENDER_TO_DOM](range) {
        this._range = range;
        //递归调用
        this.render()[RENDER_TO_DOM](range);
    }

    rerender(){
        this._range.deleteContents();
        this[RENDER_TO_DOM](this._range);
    }

    setState(newState){
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState;
            this.rerender();
            return;
        }
        let merge = (oldState, newState) => {
            for (const p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object"){
                    oldState[p] = newState[p];
                }else{
                    merge(oldState[p], newState[p]);
                }
            }
        }
        merge(this.state, newState);
        this.rerender();
    }

    // es6的写法，会产生一个getter
    // 视频说，get root 是一个真实的render
    //root 是跟渲染相关的东西
    // get root(){
    //     if (!this._root) {
    //         // 不太懂，待理解
    //         // 如果render出的还是component，就会发递归，一直到它变成ElementWrapper或TextWrapper，有根节点的这样一个component
    //         this._root = this.render().root;
    //     }
    //     return this._root;
    // }
}

/**
 * 
 * @param {*} type 
 * @param {*} attributes 属性列表，是一个object,例如{ id: "a", "class": "c"}
 * @param  {...any} children 子节点
 */
export function createElement(type, attributes, ...children){
    let  e;
    if (typeof type === "string"){
        // e = document.createElement(type);
        e = new ElementWrapper(type);
    }else{
        e = new type;
    }

    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }

    let insertChildren = (children) => {

        for (let child of children) {
            if (typeof child === "string") {
                // child = document.createTextNode(child);
                child = new TextWrapper(child);
            }
            if (typeof child === 'object' && child instanceof Array) {
                insertChildren(child);
            }else {
                e.appendChild(child);
            }
        }
    }
    insertChildren(children);
    return e;
}

export function render(component, parentElement) {
    // parentElement.appendChild(component.root);
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}