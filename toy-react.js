class ElementWrapper {
    constructor(type){
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
    // 视频说，get root 是一个真实的render
    get root(){
        if (!this._root) {
            // 不太懂，待理解
            // 如果render出的还是component，就会发递归，一直到它变成ElementWrapper或TextWrapper，有根节点的这样一个component
            this._root = this.render().root;
        }
        return this._root;
    }
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
    parentElement.appendChild(component.root);
}