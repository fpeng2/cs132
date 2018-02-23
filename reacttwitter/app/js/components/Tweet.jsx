// Create a new React component here!

import React from 'react';

export default class Tweet extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            colorcoin: true,

        }
    }

    handleClick(e) {
        let el = e.target;
        while (el && !el.getAttribute("data-is-parent")) {
            el = el.parentElement;
        }
        if (this.state.colorcoin) {
            el.style["background-color"] = "rgba(160, 200, 220, 0.5)";
            console.log("clicked! " + el.style["background-color"])
            this.setState({
                colorcoin: false,
            })
        } else {
            el.style["background-color"] = "";
            console.log("clicked! " + el.style["background-color"])
            this.setState({
                colorcoin: true,
            })
        }
    }

    render(){
        let verified = this.props.data.user.verified?
            (<span className="Icon Icon--verified"> </span>) : null;
        let avatar = null;
        if (this.props.data.user.hasOwnProperty("profile_image_url")) {
            avatar = (
                <div className="Avatar"
                     style={{background: "url(" + this.props.data.user.profile_image_url + ")"}}>
                </div>
            )
        } else {
            avatar = (
                <div className="Avatar"
                     style={{background: "url(img/no_photo.png)"}}>
                </div>
            )
        }
        let authorlink = null;
        if (this.props.data.user.hasOwnProperty("url") && this.props.data.user.url != null) {
            authorlink =(<a className="TweetAuthor-link" href={this.props.data.user.url}> </a>)
        } else {
            authorlink =(<a className="TweetAuthor-link" href="#"> </a>)
        }
        return (
            <div className="timeline-TweetList-tweet">
                <div className="timeline-Tweet" onClick={(e)=>this.handleClick(e)} data-is-parent>
                    <div className="timeline-Tweet-brand">
                        <div className="Icon Icon--twitter"></div>
                    </div>
                    <div className="timeline-Tweet-author">
                        <div className="TweetAuthor">
                            {authorlink}
                            <span className="TweetAuthor-avatar">
                                {avatar}
                                </span>
                            <span className="TweetAuthor-name">{this.props.data.user.name}</span>
                            {verified}
                            <span className="TweetAuthor-screenName">{"@" + this.props.data.user.screen_name} </span>
                        </div>
                    </div>
                    <div className="timeline-Tweet-text" onClick={null}>{this.props.data.text}</div>
                </div>
            </div>
        );
    }
}