// Create a new React component here!

import React from "react";

export default class Inputs extends React.Component {
    constructor(props){
        super(props)
        let li_inputs = this.props.inputs.map((type, index) =>
            <li key={index}>Input a {type}:
                <input type="text" onChange={(e) => this.handleClick(index, e)} />
             </li>
        )
        this.state = {
            li_inputs: li_inputs,
            new_input: this.props.inputs.map((type, index) => ((index+1)+"-["+type.toString()+"]"))
        }
        this.props.setNewInputs(this.state.new_input);
    }

    handleClick(i, event) {
        console.log("input field updated with "+event.target.value);
        const inputs = this.state.new_input;
        inputs[i] = event.target.value == ""?
            (i+1)+"-["+this.props.inputs[i]+"]": event.target.value;
        this.setState({
            new_input: inputs,
                //this.state.new_input.map((content, index) =>
                //(index == i? event.target.value: content))
        })
        console.log("this.state"+this.state.new_input)
        this.props.setNewInputs(this.state.new_input);
    }

    render(){
       return(
           <ol>{this.state.li_inputs}</ol>
       )
    }

}
