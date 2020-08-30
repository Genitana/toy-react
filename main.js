
function createElement(tagName, attributes, ...children){
    let e = document.createElement(tagName);
    for(let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }
    for(let child of children) {
        if (typeof child === "string"){
            child = document.createTextNode(children);
        }
        e.appendChild(child);
    }
    return e;
}

// window.a  = <div id='a' class="c">
//      <div>abc</div>
//      <div><div></div></div>
//      <div></div>
//     </div>

document.body.appendChild ( 
   <div id='a' class="c">
     <div>abc</div>
     <div>
         <div></div>
    </div>
     <div></div>
    </div>);

/**
 * 上面这段标签会被插件翻译成如下
 * 可以自己运行 npx webpack 试试
 * 子元素会被当成第3个参数传进去；多个并列的子元素，则会作为第3个、第4个...参数传进去
 */

/** 
document.body.appendChild(
    createElement("div",
        {             //属性当做一个对象，作为第二个参数传进去
            id: "a",
            "class": "c"
        },
        createElement("div", null, "abc"),
        createElement("div", null, createElement("div", null)), //子元素也有子元素的话，也是一样，其实就是递归了
        createElement("div", null))
);

*/

