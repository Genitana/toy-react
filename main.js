import {createElement,Component,render} from "./toy-react";

// for (let i of [1,2,3,4]) {
//     console.log(i);
// }

class Mycomponent extends Component{

    render(){
        return <div>
                <h1>my component</h1>
                {this.children}
            </div>
    }
}



// window.a  = <div id='a' class="c">
//      <div>abc</div>
//      <div><div></div></div>
//      <div></div>
//     </div>

// document.body.appendChild ( 
//    <div id='a' class="c">
//      <div>abc</div>
//      <div><div></div></div>
//      <div></div>
//     </div>);

render(<Mycomponent id='a' class="c">
     <div>abc</div>
     <div></div>
     <div></div>
    </Mycomponent>, document.body);