// Your SwiftFeed JavaScript code goes here

var nIntervId;
var loadedIDs = new Set();

function createTweetDiv(item) {
    //var tw_block_parent = $('<div class="tw-block-parent"></div>');
    var timeline_TweetList_tweet = $('<div class="timeline-TweetList-tweet"></div>');

    var timeline_Tweet = $('<div class="timeline-Tweet"></div>');

    timeline_Tweet.append($('<div class="timeline-Tweet-brand"></div>').html($('<div class="Icon Icon--twitter"></div>')));

    var timeline_Tweet_author = $('<div class="timeline-Tweet-author"></div>');
    var TweetAuthor = $('<div class="TweetAuthor"></div>');
    var TweetAuthor_link = $('<a class="TweetAuthor-link"></a>');
    if (item.user.hasOwnProperty("url") && item.user.url != null) {
        console.log(item.user.url);
        TweetAuthor_link.attr('href', item.user.url);
    } else {
        TweetAuthor_link.attr('href', '#');
    }
    TweetAuthor.append(TweetAuthor_link);
    var TweetAuthor_avatar = $('<span class="TweetAuthor-avatar"></span>');
    var avatar = $('<div class="Avatar"></div>');
    if (item.user.hasOwnProperty("profile_image_url")) {
        avatar[0].style['background'] = "url(" + item.user.profile_image_url + ")";
    } else {

        avatar[0].style['background'] = "url(img/no_photo.png)";
    }

    TweetAuthor_avatar.html(avatar);
    TweetAuthor.append(TweetAuthor_avatar);
    TweetAuthor.append($('<span class="TweetAuthor-name"></span>').html(item.user.name));
    var verified = $('<span class="Icon Icon--verified"> </span>');
    if (!item.user.verified) {
        verified[0].style['display'] = "none";
    }
    TweetAuthor.append(verified);
    TweetAuthor.append($('<span class="TweetAuthor-screenName"></span>').html("@" + item.user.screen_name));
    timeline_Tweet_author.append(TweetAuthor);
    timeline_Tweet.append(timeline_Tweet_author);

    timeline_Tweet.append($('<div class="timeline-Tweet-text"></div>').html(item.text));

    timeline_TweetList_tweet.append(timeline_Tweet);
    //tw_block_parent.append(timeline_TweetList_tweet);
    return timeline_TweetList_tweet;
}

function refreshTweet(){
    $.get('http://ec2-18-218-249-183.us-east-2.compute.amazonaws.com/feed/start', function(data, status) {
        if (status === "success") {
            data = data.filter(item => !loadedIDs.has(item.id_str))
            for (var i = 0; i < data.length; i++) {
                loadedIDs.add(data[i].id_str)
                var div = createTweetDiv(data[i]);
                var parent = $('.tw-block-parent')[0];
                while (parent.children.length >= 26) {
                    parent.removeChild(parent.lastChild);
                }
                $('.tw-block-parent').prepend(div);
            }
        } else {
            console.log("Received error:", status);
        }
    });
}

function setRefreshInterval(delay) {
    refreshTweet();
    nIntervId = setInterval(refreshTweet, delay * 1000);
}

function changeInterval() {
    if (nIntervId != undefined) {
        clearInterval(nIntervId);
        nIntervId = undefined;
    }
    var radios = $("#intervals input");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked && radios[i].value > 0) {
            setRefreshInterval(radios[i].value);
        }
    }
}