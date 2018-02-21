// Create a new React component here!
import React from "react";

export default class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let counter = 0;
        let mythis = this;
        let replaced_madlib = this.props.original.replace(/\[([^\])]*)\]/g,
            function (mat,p1,off,str) {
                //return (<span className="replaced"> {mythis.props.new_inputs[counter++]} </span>)} );
                return mythis.props.new_inputs[counter++]});


        //console.log("Result render"+replaced_madlib)
       return(
           <p>{replaced_madlib}</p>
       )
    }
}