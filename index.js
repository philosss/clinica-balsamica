const express = require("express");
const app = express();

let serverPort = (process.env.PORT || 5000);



let petsList = [
  { id: 0, name: "pippo", tag: "dog" },
  { id: 1, name: "miao", tag: "cat" }
];

/* Register REST entry point */

app.get("/pets", function(req, res) {
  res.send(JSON.stringify(petsList, 0, 4));
});

app.use(express.static(__dirname + '/public'));

app.set('port', serverPort);

/* Start the server on port 3000 */
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
