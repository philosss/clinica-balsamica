const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let petsList = require("./petstoredata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Register REST entry point */
app.get("/pets", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let result = petsList;

  if (sortby === "age") {
    result = _.sortBy(result, [
      function(o) {
        return (-1) * o.born;
      }
    ]);
  } else if (sortby === "-age") {
    result = _.sortBy(result, [
      function(o) {
        return o.born;
      }
    ]);
  }
  result = _.slice(result, start, start + limit);
  res.send(JSON.stringify(result, 0, 4));
});

app.post("/pets", function(req, res) {
  let toappend = {
    id: petsList.length,
    name: req.body.name,
    tag: req.body.tag,
    born: req.body.born
  };
  petsList.push(toappend);
  res.send(toappend);
});

app.use(function(req, res) {
  res.status(400);
  res.send({ error: "400", title: "404: File Not Found" });
});

app.set("port", serverPort);

/* Start the server on port 3000 */
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
