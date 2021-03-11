const mysql = require('mysql');

module.exports.updateGame = function(gameID, startTime, endTime, nextColor, gameOver, winner) {
    const start_time_unix = startTime ? parseInt(startTime.toString().slice(0,-3)) : null
    const end_time_unix   = endTime ? parseInt(endTime.toString().slice(0,-3)) : null
    
    const q_game_id       = mysql.escape(gameID);
    const q_start_time    = mysql.escape(start_time_unix);  // drop milliseconds from unix timestamp
    const q_end_time      = mysql.escape(end_time_unix);
    const q_next_color    = mysql.escape(nextColor);
    const q_game_over     = mysql.escape(gameOver);
    const q_winner        = mysql.escape(winner);
    
    return `INSERT INTO games(game_id, start_time, end_time, next_color, game_over, winner)
    VALUES (${q_game_id}, FROM_UNIXTIME(${q_start_time}), FROM_UNIXTIME(${q_end_time}), ${q_next_color}, ${q_game_over}, ${q_winner})  
    ON DUPLICATE KEY UPDATE end_time=FROM_UNIXTIME(${q_end_time}), next_color=${q_next_color}, game_over=${q_game_over}, winner=${q_winner};`
}

module.exports.updatePiece = function(pieceID, gameID, color, type, square, isCaptured) {
    const q_piece_id      = mysql.escape(pieceID);
    const q_game_id       = mysql.escape(gameID);
    const q_color         = mysql.escape(color);
    const q_type          = mysql.escape(type);
    const q_square        = mysql.escape(square);
    const q_is_captured   = mysql.escape(isCaptured);

    return `INSERT INTO pieces(piece_id, game_id, color, type, square, is_captured)
    VALUES (${q_piece_id}, ${q_game_id}, ${q_color}, ${q_type}, ${q_square}, ${q_is_captured})  
    ON DUPLICATE KEY UPDATE square=${q_square}, is_captured=${q_is_captured};`
}

module.exports.test = function(gameID, startTime, endTime) {
    const q_game_id       = mysql.escape(gameID);
    const q_start_time    = mysql.escape(startTime);
    const q_end_time      = mysql.escape(endTime);

    return `SELECT ${q_game_id} AS game_id, ${q_start_time} AS start_time, ${q_end_time} AS end_time`
}