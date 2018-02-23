import React from 'react';
import Tweet from "./Tweet.jsx"

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        let nowthis = this;
        this.state = {
            nIntervId: null,
            loadedIDs: new Set(),
            setDelay: function(delay) {
                nowthis.changeInterval(delay);
                console.log("home.state:"+nowthis.state.nIntervId)
            },
            tweets: [],
        }
        this.refreshTweet();
    }

    refreshTweet(){
        console.log("refreshing!")
        let mythis = this;
        $.get('http://ec2-18-216-120-197.us-east-2.compute.amazonaws.com:3030/feed/start', function(data, status) {
            if (status === "success") {
                let new_data = [];
                for (let i = 0; i < data.length; i++) {
                    if (mythis.state.loadedIDs.has(data[i].id_str)) {
                        console.log("duplicate!")
                        continue;
                    }
                    mythis.setState({
                        loadedIDs: mythis.state.loadedIDs.add(data[i].id_str)
                    })
                    new_data = new_data.concat([<Tweet key={data[i].id_str} data={data[i]}/>]);
                }
                console.log("got new data: " + new_data.length);

                let len = 26 - new_data.length;
                console.log("appending new data: " + Math.min(len, mythis.state.tweets.length));
                for (let i = 0; i < Math.min(len, mythis.state.tweets.length); i++) {
                    new_data = new_data.concat([mythis.state.tweets[i]]);
                };
                mythis.setState({
                    tweets: new_data,
                });
                console.log("got tweets:"+mythis.state.tweets.length);
            } else {
                console.log("Received error:", status);
            }
        });
    }

    setRefreshInterval(delay) {
        console.log("setting refresh interval" + delay)
        this.refreshTweet();
        let Id = setInterval(this.refreshTweet.bind(this), delay * 1000);
        this.setState({
            nIntervId: Id,
        })
    }

    changeInterval(delay) {
        console.log("changing delay to:" + delay)
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

    handleClick(val, e){
        console.log("handleClick: "+val+e);
        this.props.setDelay(val);
    }

    render(){
        let options = [3, 10, 30, 0];
        let inputs = options.map((val) =>
            <div key={val}>
                <input type="radio" name="ref-intvl" value={val} id={"input"+val}
                       onChange={(e) => this.handleClick(val, e)} defaultChecked={val == 0? true: false}
                />
                {val == 0? " never" : " " + val + "seconds"}
                <br/>
            </div>)
        let form = (
            <form id="intervals">
                <p>Refresh every</p>
                {inputs}
            </form>

        )
        return (
            <div className="config">
                {form}
            </div>
        );

        //<button className="go" onClick={this.handleClick()}/>
    }
}