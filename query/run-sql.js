const mysql = require('mysql');
const buildSQL = require('./build-sql')

function getConnection() {
    return mysql.createConnection({
        host     : 'localhost',
        port     : '3306',
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : 'janggi',
    })
}

module.exports.saveGame = function(gameID, startTime, endTime, nextColor, gameOver, winner) {
    return new Promise(function(resolve, reject) {
        const connection = getConnection()
        connection.connect();
        connection.query(buildSQL.updateGame(gameID, startTime, endTime, nextColor, gameOver, winner),
            function(error, results, fields) { 
                if (error) return reject(error);
                else return resolve(results)
            }
        );
    })
}

module.exports.savePiece = function(pieceID, gameID, color, type, square, isCaptured) {
    return new Promise(function(resolve, reject) {
        const connection = getConnection()
        connection.connect();
        connection.query(buildSQL.updatePiece(pieceID, gameID, color, type, square, isCaptured),
            function(error, results, fields) { 
                if (error) return reject(error);
                else return resolve(results)
            }
        );
    })
}

module.exports.loadGame = function(gameID) {
    return new Promise(function(resolve, reject) {
        const connection = getConnection()
        connection.connect();
        connection.query(buildSQL.getGame(gameID),
            function(error, results, fields) { 
                if (error) return reject(error);
                else return resolve(results[0])
            }
        );
    })
}

module.exports.loadGamePieces = function(gameID) {
    return new Promise(function(resolve, reject) {
        const connection = getConnection()
        connection.connect();
        connection.query(buildSQL.getGamePieces(gameID),
            function(error, results, fields) { 
                if (error) return reject(error);
                else return resolve(results)
            }
        );
    })
}
