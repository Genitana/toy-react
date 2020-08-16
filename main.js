import {createElement,Component,render} from "./toy-react";

// for (let i of [1,2,3,4]) {
//     console.log(i);
// }

class Mycomponent extends Component{
    constructor(){
        super();
        this.state  = {
            a:1,
            b:2
        }
    }

    render(){
        return <div>
                <h1>my component</h1>
                <button onclick={() => {this.state.a ++ ; this.rerender();}}>add</button>
                <span>{this.state.a.toString()}</span>
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