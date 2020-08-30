class ElementWrapper {
    constructor(type){
        //root 存储的是实体的DOM
        this.root = document.createElement(type);
    }
    setAttribute(name,value){
        this.root.setAttribute(name, value);
    }
    appendChild(component){
        this.root.appendChild(component.root);
    }
}

class TextWrapper {
    constructor(content){
        this.root = document.createTextNode(content);
    }

}

export class Component {
    constructor(){
        // 用Object.create(null);创建绝对空的一个对象
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }
    setAttribute(name,value){
        this.props[name] = value;
    }
    appendChild(component){
        this.children.push(component);
    }

    // es6的写法，会产生一个getter
    // get  root 是一个真实的渲染过程
    // 视频说，get root 是一个真实的render
    get root(){
        if (!this._root) {
            // 组件里面都有render()方法
            // 如果render出的还是component，去执行.root的时候就会发递归，一直到它变成ElementWrapper或TextWrapper
            this._root = this.render().root;
        }
        return this._root;
    }
}

/**
 * 
 * @param {*} type  标签(例如“div”)或者组件
 * @param {*} attributes 属性列表，是一个object,例如{ id: "a", "class": "c"}
 * @param  {...any} children 子节点
 */
export function createElement(type, attributes, ...children){
    let  e;
    // 是标签
    if (typeof type === "string"){  
        // e = document.createElement(type);
        e = new ElementWrapper(type);
    }else{  
        // 是组件
        e = new type;
    }

    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }

    //处理component里面的children
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

/**
 * @param {*} parentElement  父节点DOM，React的示例中这里传的都是 document.getElementById("root")
 */
export function render(component, parentElement) {
    
    // 这里的component.root就会执行 class Component里的 get root() 方法
    parentElement.appendChild(component.root);
}