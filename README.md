![Tinderella](http://az616578.vo.msecnd.net/files/2015/01/25/635577465595890562356530534_tinder1.imgopt1000x70.jpg "Tinderella")

### Introduction

Tinderella is a Tinder bot that "swipes right" on every user. When a match is made, a message will be sent to the user.

### Word of Warning

Tinder needs your Facebook ID and Tinder access token. This program might violate Tinder and Facebook TOS.

### Obtaining User ID & Access Token

There are a number of programmatic ways for obtaining the Tinder Access Token, but they all appear to be broken (including [tinderauth](https://github.com/tinderjs/tinderauth)) after Tinder updated their API. It is still possible to get the access token manually, and the below steps were the easiest I have found:

- Open developer tools in your browser to inspect the network traffic
- Go to this [Facebook link](https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&state=%7B%22challenge%22%3A%22q1WMwhvSfbWHvd8xz5PT6lk6eoA%253D%22%2C%220_auth_logger_id%22%3A%2254783C22-558A-4E54-A1EE-BB9E357CC11F%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=54783C22-558A-4E54-A1EE-BB9E357CC11F#_=_) and click OK on the popup
- Search for access_token in the most recent API call

The Facebook ID can easily be obtained by going to [findmyfbid.com](https://findmyfbid.com/)

### Setup

```bash
npm install
```
- Place your Facebook access token and user ID in the local.json file
- For custom messages, update the messages array in the default.json file

### Run

```bash
node main.js
```
