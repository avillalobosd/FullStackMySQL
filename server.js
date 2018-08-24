var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection;

if (process.env.JAWSDB_URL){
connection = mysql.createConnection(process.env.JAWSB_URL);
}else {
  connection= mysql.createConnection({
  host: "wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "nyec8w9ztuau42je",
  password: "a90cfcttkqymh505",
  database: "i0xjnksg5nxw3jb7"
});
};

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});


app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }else connection.query("SELECT * FROM devour;", function(err, devo) {
      if (err) {
        return res.status(500).end();
      }else
  
      res.render("index", { burgers: data, devour: devo });
    });
  });
});



app.post("/api/burgers", function(req, res) {
  connection.query("INSERT INTO burgers (burger) VALUES (?)", [req.body.burger], function(
    err,
    result
  ) {
    if (err) {

      return res.status(500).end();
    }

    res.json({ id: result.insertId });
  });
});

app.delete("/api/burgers/:id", function(req, res) {
  connection.query("SELECT * FROM burgers WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {

      console.log("error1");
    }
    else {

      var newBurger =result[0].burger;
      console.log(result[0].burger);
      connection.query("INSERT INTO devour (burger) VALUES (?)", [newBurger], function(
        err,
        result
      ) {
        if (err) {

          console.log("error2");
        }
    

      });
    }
    res.status(200).end();

  });


  connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {

      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {

      return res.status(404).end();
    }
    res.status(200).end();

  });
});




app.listen(PORT, function() {

  console.log("Server listening on: http://localhost:" + PORT);
});
