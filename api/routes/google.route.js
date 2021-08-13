const express = require("express");
const request = require('request');
const localStorage = require("localStorage");

const jsonBodyParser = express.json();
const {
    getGoogleAuthURL,
    getGoogleUser,
    getGoogleUserTokens,
    refreshToken,
} = require("../services/google.service");


const { client_id_google, client_secret_google, port } = require('../../config.json');

var redirect_uri = `https://evening-inlet-22984.herokuapp.com/api/google/callback`;

const router = express.Router();

router.get("/login", (req, res) => {
    const googleOAuthUrl = getGoogleAuthURL();
    res.status(301).redirect(googleOAuthUrl);
});
  
// Google Web App callback /oauth/google
router.get("/callback", async (req, res, next) => {
    const code = req.query.code;
    var userTokens = await getGoogleUserTokens({
        // get google user tokens
        code,
        client_id: client_id_google,
        client_secret: client_secret_google,
        redirect_uri: `${redirect_uri}`,
    });
    if (userTokens.error) return res.status(500).json(errorObj(userTokens));
  
    var userInfo = await getGoogleUser({
        // get google user info
        id_token: userTokens.id_token,
        access_token: userTokens.access_token,
    });
  if (userInfo.error) return res.status(500).json(errorObj(userInfo));
  
  localStorage.setItem('token', `${userTokens.access_token}`)

// watch gmail inbox
    request({
        url: 'https://www.googleapis.com/gmail/v1/users/me/watch',
         method: "POST",
        json: true, 
        json: {
            topicName: 'projects/tensionx/topics/TensionX',
            labelIds: ['INBOX']
        },
  headers: {
     'Authorization': `Bearer ${userTokens.access_token}`
  },
  rejectUnauthorized: false
}, function(err, res) {
      if(err) {
        console.error(err);
      } else {
        console.log(res.body);
      }
     localStorage.setItem('startHistoryId', `${res.body.historyId}`)
    });
    
    res.render("success", {
        provider: "Google",
        access_token: userTokens.access_token,
        refresh_token: userTokens.refresh_token,
        username: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        error: null
    });
});

router.post("/pubsub/pushNotification", jsonBodyParser, (req, res) => {

  const message = Buffer.from(req.body.message.data, 'base64').toString(
    'utf-8'
  );
// 1
    request({
      url: 'https://gmail.googleapis.com/gmail/v1/users/me/history',
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      rejectUnauthorized: false,
      qs: { startHistoryId: `${localStorage.getItem('startHistoryId')}`, labelId: ['INBOX'] },

    }, function (err, resp) {
      if (err) {
        console.error(err);
      } else {
        console.log('RESPONSE BODY', resp.body);
        const json = JSON.parse(resp.body)


        // console.log('json history', json.history);

        // console.log('json history 1111', json.history[0].messages);
    
        // console.log('json history 1111 messages 0', json.history[0].messages[0].id);

        // localStorage.setItem('messageId', `${json.history[0].messages[0].id}`);
        // console.log('finally', json.history[0].messages[0].id);


    //    request({
    //   url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${localStorage.getItem('messageId')}`,
    //   method: "GET",

    // }, function (err, respon) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log(localStorage.getItem('messageId'))
    //     console.log('second response', respon.body);
    //   }
    //      })
        
        
      }
    })
  

  console.log('message', message)

  res.status(200).send();
});
  

module.exports = router;