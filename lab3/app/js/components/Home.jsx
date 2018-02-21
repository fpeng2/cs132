import React from 'react';
import madlibs from '../../madlib.js';
import Results from './Results.jsx'
import Inputs from './Query.jsx'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
      const idx = Math.floor(Math.random() * madlibs.length);
      let one_madlib = madlibs[idx];
      let inputs = [];
      one_madlib.content.replace(/\[([^\])]*)\]/g,
          function (mat,p1,off,str) { inputs.push(p1) } );
      const nowthis = this;
    this.state = {
      original: one_madlib.content,
      inputs: inputs,
      new_inputs: inputs.map((content,index) => ((index+1)+"-[" + content.toString() +"]")),
        setNewInputs: function(new_inputs_) {
          nowthis.setState({new_inputs: new_inputs_})
          console.log("home.state"+nowthis.state.new_inputs)
        }
    }
  }

  render(){

      return (
          <div>
              <h1> Welcome to Madlibs! </h1>
              <h3> Fill in the instructed places and you'll see what story you've got! Immediately!</h3>
              <Results original={this.state.original} new_inputs={this.state.new_inputs}/>
            <Inputs inputs={this.state.inputs} setNewInputs={this.state.setNewInputs} />
          </div>
    );
  }
}
