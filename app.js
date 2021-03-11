require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const buildSQL = require('./query/build-sql')
const runSQL = require('./query/run-sql')

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/public/index.html")
});

app.post("/save-game", async function(req, res) {
    const gameProps = req.body
    const {id, startTime, endTime, pieces, nextColor, gameOver, winner} = gameProps

    const saveGame = await runSQL.saveGame(id, startTime, endTime, nextColor, gameOver, winner);
    const savePieces = await pieces.map(async (piece) => {
        await runSQL.savePiece(piece.id, piece.gameID, piece.color, piece.type, piece.square, piece.isCaptured)
    })
    res.send(true)
})

app.get("/load-game", async function(req, res){
    const {gameID} = req.query
    const gameProps = await runSQL.loadGame(gameID)
    const pieces = await runSQL.loadGamePieces(gameID)
    res.send({...gameProps, pieces: pieces})
})

// connection.end();

app.listen(3000, function(){
    console.log("Server running on port 3000.");
});
