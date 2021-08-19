// function makeBody(to, from, subject, message) {
//     var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
//         "MIME-Version: 1.0\n",
//         "Content-Transfer-Encoding: 7bit\n",
//         "to: ", to, "\n",
//         "from: ", from, "\n",
//         "subject: ", subject, "\n\n",
//         message
//     ].join('');

//     var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
//         return encodedMail;
// }

// function sendMessage(auth) {
//     var raw = makeBody('viktor.dev72@gmail.com', 'viktor.dev72@gmail.com', 'test subject', 'test message');
//     gmail.users.messages.send({
//         auth: auth,
//         userId: 'me',
//         resource: {
//             raw: raw
//         }
//     }, function(err, response) {
//         res.send(err || response)
//     });
// }

// fs.readFile(secretlocation, function processClientSecrets(err, content) {
//     if (err) {
//         console.log('Error loading client secret file: ' + err);
//         return;
//     }
//     // Authorize a client with the loaded credentials, then call the
//     // Gmail API.
//     authorize(JSON.parse(content), sendMessage);
// });




var request = require('request');



  // Base64-encode the mail and make it URL-safe 
  // (replace all "+" with "-" and all "/" with "_")
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
        "Authorization": "Bearer ya29.a0ARrdaM_v8NKpTqPosxN89UphGH0QUUHc6DMaudgz9j4aIB5-6oXiUeVvcOJu6nWaKe1kOqEJ3mi0oynUDkWKnZe64TPY7ZAOL6K4JHdEuwQhMHBbgPAdTJBkiDBnM44_J8eSifkxmuBh3ta0HMn0WMn2wlLl",
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