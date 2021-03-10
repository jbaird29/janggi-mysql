// ---------------------------------------------------------------
// Helper functions for altering algebraic square notation
// ---------------------------------------------------------------
const nextChar = (c) => { 
  return String.fromCharCode(c.charCodeAt(0) + 1); 
}

const shift = (square, vertical, horizontal) => {
  const startLet = square.slice(0,1)
  const startNum = square.slice(1)
  const startOrd = startLet.charCodeAt(0)
  if (!(startLet >= 'a' && startLet <= 'i' && startNum >= 1 && startNum <= 10)) {
    return false
  }
  const endNum = startNum - vertical
  const endOrd = startOrd + horizontal
  const endLet = String.fromCharCode(endOrd)
  if (!(endLet >= 'a' && endLet <= 'i' && endNum >= 1 && endNum <= 10)) {
    return false
  }
  return endLet + endNum
}

const shiftDir = (square, direction) => {
  if (direction === 'right') return shift(square, 0, 1);
  if (direction === 'left') return shift(square, 0, -1);
  if (direction === 'up') return shift(square, 1, 0);
  if (direction === 'down') return shift(square, -1, 0);
}

const mirrorSquare = (square) => {
  if (!['d1', 'f1', 'd3', 'f3', 'd8', 'f8', 'd10', 'f10'].includes(square)) {
    return false
  }
  const letter = square.slice(0,1)
  const num = parseInt(square.slice(1))
  let mirror = ''
  mirror += letter === 'f' ? 'd' : 'f'
  mirror += [1, 8].includes(num) ? (num + 2) : (num - 2)
  return mirror
}

// ---------------------------------------------------------------
// Helper functions for getting certain palaces squares
// ---------------------------------------------------------------
const getPalace = (color=null) => {
  if (color === 'red') {
    return ['d1', 'e1', 'f1', 'd2', 'e2', 'f2', 'd3', 'e3', 'f3']
  } else if (color === 'blue') {
    return ['d8', 'e8', 'f8', 'd9', 'e9', 'f9', 'd10', 'e10', 'f10']
  } else {
    return ['d1', 'e1', 'f1', 'd2', 'e2', 'f2', 'd3', 'e3', 'f3',
    'd8', 'e8', 'f8', 'd9', 'e9', 'f9', 'd10', 'e10', 'f10']
  }
}

const getPalaceCorners = (color=null) => {
  if (color === 'red') {
    return ['d1', 'f1', 'd3', 'f3']
  } else if (color === 'blue') {
    return ['d8', 'f8', 'd10', 'f10']
  } else {
    return ['d1', 'f1', 'd3', 'f3', 'd8', 'f8', 'd10', 'f10']
  }
}

const getPalaceCenters = (color=null) => {
  if (color === 'red') {
    return 'e2'
  } else if (color === 'blue') {
    return 'e9'
  } else {
    return ['e2', 'e9']
  }
}

// ---------------------------------------------------------------
// Helper functions for initializing the game
// ---------------------------------------------------------------
const getStartGameProps = () => {
  const gameID = uuidv4()
  const startPieces = [
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'chariot',  square: 'a1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'chariot',  square: 'i1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'elephant', square: 'b1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'elephant', square: 'g1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'horse',    square: 'c1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'horse',    square: 'h1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'guard',    square: 'd1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'guard',    square: 'f1' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'cannon',   square: 'b3' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'cannon',   square: 'h3' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'soldier',  square: 'a4' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'soldier',  square: 'c4' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'soldier',  square: 'e4' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'soldier',  square: 'g4' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'soldier',  square: 'i4' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'red',  type: 'general',  square: 'e2' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'chariot',  square: 'a10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'chariot',  square: 'i10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'elephant', square: 'b10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'elephant', square: 'g10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'horse',    square: 'c10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'horse',    square: 'h10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'guard',    square: 'd10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'guard',    square: 'f10'}),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'cannon',   square: 'b8' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'cannon',   square: 'h8' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'soldier',  square: 'a7' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'soldier',  square: 'c7' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'soldier',  square: 'e7' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'soldier',  square: 'g7' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'soldier',  square: 'i7' }),
    new Piece({id: uuidv4(), gameID: gameID, color: 'blue', type: 'general',  square: 'e9' }),
  ]
  return {
    id: gameID,
    startTime: moment().valueOf(),
    endTime: null,
    pieces: startPieces,
    nextColor: 'blue',
    gameOver: false,
    winner: null
  }
}

const getSavedGameProps = () => {
  const gamePropsJSON = localStorage.getItem('gameProps');
  try {
    return gamePropsJSON ? JSON.parse(gamePropsJSON) : null;
  } catch(e) {
    console.log(e.message);
    return null
  }
}

const getGameProps = () => {
  const savedGameProps = getSavedGameProps()
  if (savedGameProps) {
    // if gameProps were loaded from browser storage, convert the Pieces objects into Class instances
    const cleanedPieces = savedGameProps.pieces.map(piece => new Piece({...piece}) )
    savedGameProps.pieces = cleanedPieces
    return savedGameProps
  } else {
    // otherwise build an empty game
    return getStartGameProps()
  }
}