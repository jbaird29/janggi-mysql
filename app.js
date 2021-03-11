require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const buildSQL = require('./build-sql')

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : 'janggi'
});
connection.connect();
  

app.get("/", function(req, res){
    res.sendFile(__dirname+"/public/index.html")
});

app.post("/save-game", function(req, res) {
    const gameProps = req.body
    const {id, startTime, endTime, pieces, nextColor, gameOver, winner} = gameProps

    connection.query(buildSQL.updateGame(id, startTime, endTime, nextColor, gameOver, winner),
        function(error, results, fields) { 
            if (error) throw error; 
            results.message && console.log(results.message);
        }
    );
    pieces.forEach(piece => {
        connection.query(buildSQL.updatePiece(piece.id, piece.gameID, piece.color, piece.type, piece.square, piece.isCaptured),
            function(error, results, fields) { 
                if (error) throw error;
                results.message && console.log(results.message);
            }
        )
    })
    res.send('success')
})

// connection.end();

app.listen(3000, function(){
    console.log("Server running on port 3000.");
});
