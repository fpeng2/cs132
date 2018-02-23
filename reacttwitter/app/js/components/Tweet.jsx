// Create a new React component here!

import React from 'react';

export default class Tweet extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        let verified = this.props.data.user.verified?
            (<span className="Icon Icon--verified"> </span>) : null;
        let avatar = null;
        if (this.props.data.user.hasOwnProperty("profile_image_url")) {
            avatar = (
                <div className="Avatar"
                     style={"background: url(" + this.props.data.user.profile_image_url + ");"}>
                </div>
            )
        } else {
            avatar = (
                <div className="Avatar"
                     style={"background: url(img/no_photo.png);"}>
                </div>
            )
        }
        let authorlink = null;
        if (this.props.data.user.hasOwnProperty("url") && this.props.data.user.url != null) {
            console.log(item.user.url);
            authorlink =(<a className="TweetAuthor-link" href={this.props.data.user.url}> </a>)
        } else {
            authorlink =(<a className="TweetAuthor-link" href="#"> </a>)
        }
        return (
            <div className="timeline-TweetList-tweet">
                <div className="timeline-Tweet">
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
                            <span class="TweetAuthor-screenName">{"@" + this.props.user.screenName} </span>
                        </div>
                    </div>
                    <div class="timeline-Tweet-text">{this.props.data.text}</div>
                </div>
            </div>
        );
    }
}