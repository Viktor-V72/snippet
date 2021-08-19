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