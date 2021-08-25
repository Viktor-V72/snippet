const express = require("express");
const request = require('request');
const localStorage = require("localStorage");
const base64url = require('base64url');
const XLSX = require('xlsx');
const excelToJson = require('convert-excel-to-json');


const jsonBodyParser = express.json();
const {
    getGoogleAuthURL,
    getGoogleUser,
    getGoogleUserTokens,
    refreshToken,
} = require("../services/google.service");


const { client_id_google, client_secret_google, port } = require('../../config.json');

var redirect_uri = `https://cottony-destiny-join.glitch.me/api/google/callback`;

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
      qs: { startHistoryId: `${localStorage.getItem('startHistoryId')}`, labelIds: ['INBOX'] },

    }, function (err, resp) {
      if (err) {
        console.error(err);
      } else {
        
        const json = JSON.parse(resp.body)

        localStorage.setItem('messageId', `${json.history[0].messagesAdded[0].message.id}`);
        

       request({
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${localStorage.getItem('messageId')}`,
      method: "GET",
          headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      rejectUnauthorized: false,

    }, function (err, respon) {
      if (err) {
        console.error(err);
      } else {
      
        
        const secondJson = JSON.parse(respon.body)
        
        localStorage.setItem('attachmentId', `${secondJson.payload.parts[1].body.attachmentId}`);

        request({
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${localStorage.getItem('messageId')}/attachments/${localStorage.getItem('attachmentId')}`,
      method: "GET",
          headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      rejectUnauthorized: false,

    }, function (err, response) {
      if (err) {
        console.error(err);
      } else {
        const lastJson = JSON.parse(response.body)
                
         const result64 =  base64url.toBase64(lastJson.data)
        
         const workbook = XLSX.read(result64.replace(/_/g, "/").replace(/-/g, "+"), {type:'base64'})

      let sheet_name_list = [];
        sheet_name_list.push(workbook.SheetNames[2]);
        console.log('list', sheet_name_list)
//           var sheet_name_list = workbook.SheetNames[0];
        
//         console.log('workbook.SheetNames:', workbook.SheetNames)
        
//         console.log('sworkbook.SheetNames 0 :', workbook.SheetNames[0])
        
         // const newAlerts = workbook.Sheets["New Alerts"];
        // console.log('new Alerts:', newAlerts )
     
        
       
sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if(row == 4 && value) {
            headers[col] = value;
            continue;
        }

        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    // data.shift();
    // data.shift();
    // console.log('first data:',data);
  
  
  data = data.filter(function( element ) {
   return element.DOT !== undefined;
});
  
  console.log('second data:',data);
  
   let obj1 = data.find(o => o.DOT === 3007814);
  


  if(obj1) {
    console.log('Legal Name 1 ', obj1['Legal Name'])
    console.log('Basic 1', obj1.BASIC)
  }
  

}); 
       
        
      }
         })
      }
         })
      }
    })
  
   var encodedMail = Buffer.from(
        "Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        "to: viktor2236@gmail.com\n" +
        "from: viktor.dev72@gmail.com\n" +
        "subject: Greetings\n\n" +

        "how are you?"
  ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

  request({
      method: "POST",
      uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "raw": encodedMail
      })
    },
    function(err, response, body) {
      if(err){
        console.log(err); // Failure
      } else {
        console.log(body); // Success!
      }
    }); 
   
  

  console.log('message', message)

  res.status(200).send();
});
  

module.exports = router;