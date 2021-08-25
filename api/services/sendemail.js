var request = require('request');



  // Base64-encode the mail and make it URL-safe 
  // (replace all "+" with "-" and all "/" with "_")
  var encodedMail = Buffer.from(
        "Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        "to: xxxx@gmail.com\n" +
        "from: xxxxx@gmail.com\n" +
        "subject: Greetings\n\n" +

        "how are you?"
  ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

  request({
      method: "POST",
      uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      headers: {
        "Authorization": "Bearer some token",
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