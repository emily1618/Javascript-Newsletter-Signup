const express = require ("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.LName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/8f18503276"

  const options = {
    method: "POST",
    auth: "heartmurder:d55cea8b7a4c120645e1b47afaea6fb3-us8"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data){

      console.log(JSON.parse(data));
    })

  })

  request.write(jsonData);
  request.end();


});


app.post("/failure", function(req, res){
  res.redirect("/");

})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// d55cea8b7a4c120645e1b47afaea6fb3-us8 API Key
// 8f18503276 List ID
// The GET and POST are two different types of HTTP requests.
// GET is used for viewing something, without changing it, while POST is used for changing something.
// For example, a search page should use GET to get data while a form that changes your password should use POST.
// Essentially GET is used to retrieve remote data, and POST is used to insert/update remote data.
//
// Full article click here.

// var can  always be declared again so  it can be overridden accidentally further down the code,
// however const can't so it prevents yourself from accidentally overriding,
// it's used only on the things that you know 100% shouldn't be changed...

// Merge fields are used to personalize messages to the subscribers. For example:
//
// Hello, *|FNAME|*  = Hello, Shan
//
//
// What happens here is that the Firstname is fetched using the identifier FNAME which we mentioned in the merge_list.
// like a placeholder in your code. When it reaches the browser it will display the first name instead of the identifier.
// Hope this was clear.
