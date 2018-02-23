import React from 'react';
import Tweet from "./Tweet.jsx"

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        let nowthis = this;
        this.state = {
            nIntervId: null,
            loadedIDs: [],
            setDelay: function(delay) {
                nowthis.changeInterval(delay)
                console.log("home.state"+nowthis.state.new_inputs)
            },
            tweets: [],
        }
    }

    refreshTweet(){
        let mythis = this;
        $.get('http://ec2-18-216-120-197.us-east-2.compute.amazonaws.com:3030/feed/start', function(data, status) {
            if (status === "success") {
                let new_data = []
                for (var i = 0; i < data.length; i++) {
                    if (mythis.state.loadedIDs.includes(data[i].id_str)) {
                        continue;
                    }
                    let loaded = mythis.state.loadedIDs;
                    mythis.setState({
                        loadedIDs: loaded.concat([data[i].id_str])
                    })
                    new_data.concat([<Tweet data={data[i]}/>]);
                }
                let len = 26 - new_data.length;
                for (let i = 0; i < min(len, mythis.state.tweets.length); i++) {
                    new_data.concat([mythis.state.tweets[i]]);
                }
                mythis.setState({
                    tweets: new_data,
                })
            } else {
                console.log("Received error:", status);
            }
        });
    }

    setRefreshInterval(delay) {
        this.refreshTweet();
        let nIntervId = setInterval(this.refreshTweet.bind(this), delay * 1000);
        this.setState({
            nIntervId: nIntervId,
        })
    }

    changeInterval(delay) {
        if (this.state.nIntervId != null) {
            clearInterval(this.state.nIntervId);
            this.setState({
                nIntervId: null,
            });
        }
        if (delay > 0) {
            this.setRefreshInterval(delay);
        }
    }

    render() {
        return (
            <div>
                <h1>Welcome to Swift Feed!</h1>
                <Sidebar setDelay={this.state.setDelay}/>
                <div className="content">
                    <div className="tw-block-parent">
                        {this.state.tweets}
                    </div>
                </div>
            </div>
        );
    }
}


class Sidebar extends React.Component{
    constructor(props){
        super(props);
    }

    handleClick(val){
        this.props.setDelay(val);
    }

    render(){
        let options = [3, 10, 30, 0];
        let inputs = options.map((val) =>
            <div>
                <input type="radio" name="ref-intvl" value={val} id={"input"+val} onclick={this.handleClick(val)}/>
                {val == 0? "never" : val+"seconds"}
                <br/>
            </div>)
        return (
            <div className="config">
                <form id="intervals">
                    <p>Refresh every</p>
                    {inputs}
                </form>
            </div>
        );
    }
    //<button className="go" onclick={this.handleClick()}>change</button>
}