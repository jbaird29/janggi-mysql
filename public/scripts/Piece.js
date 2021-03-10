class Piece {
    constructor(pieceProps) {
      Object.assign(this, pieceProps)
    }
  
    isEmpty(potentialPiece) {
      return potentialPiece === null
    }
  
    isEnemy(piece) {
      return piece.color !== this.color
    }
  
    isEmptyOrEnemy(potentialPiece) {
      return (this.isEmpty(potentialPiece) || this.isEnemy(potentialPiece))
    }
  
    getValidMovements(board) {
      switch (this.type) {
        case 'soldier':
          return this.soldierMoves(board);
        case 'cannon':
          return this.cannonMoves(board)
        case 'chariot':
          return this.chariotMoves(board);
        case 'elephant':
          return this.elephantMoves(board);
        case 'horse':
          return this.horseMoves(board);
        case 'guard':
          return this.guardGeneralMoves(board);
        case 'general':
          return this.guardGeneralMoves(board);
        default:
          return []
      }
    }
  
    soldierMoves(board) {
      const start = this.square
      const moves = []
      // add left, right, and up/down (depending on color)
      const directions = ['right', 'left']
      this.color === 'blue' ? directions.push('up') : directions.push('down')
      for (const direction of directions) {
        const square = shiftDir(start, direction);
        (square && this.isEmptyOrEnemy(board[square])) ? moves.push(square) : null
      }
      // add palace-specific moves
      if (['d3', 'f3'].includes(start) && this.isEmptyOrEnemy(board['e2'])) {
        moves.push('e2')
      }
      if (['d8', 'f8'].includes(start) && this.isEmptyOrEnemy(board['e9'])) {
        moves.push('e9')
      }
      if (start === 'e2') {
        this.isEmptyOrEnemy(board['d1']) ? moves.push('d1') : null
        this.isEmptyOrEnemy(board['f1']) ? moves.push('f1') : null
      }
      if (start === 'e9') {
        this.isEmptyOrEnemy(board['d10']) ? moves.push('d10') : null
        this.isEmptyOrEnemy(board['f10']) ? moves.push('f10') : null
      }
      return moves
    }
  
    cannonMoves(board) {
      const start = this.square
      const moves = []
      // add the right, left, up, down axes
      for (const direction of ['up', 'right', 'down', 'left']) {
        let pieceCount = 0
        let containsCannon = false
        let square = shiftDir(start, direction)  // shift the square by 1 in the given direction
        while (square && pieceCount < 2 && !containsCannon) {
          const piece = board[square]
          if (pieceCount === 1 && this.isEmpty(piece)) {
            moves.push(square)  // append if empty
          } else if (pieceCount === 1 && this.isEnemy(piece) && piece.type !== 'cannon') {
            moves.push(square)  // append if it contains opposing piece that is not a cannon
          }
          if (piece !== null) {
            pieceCount += 1
            containsCannon = piece.type === 'cannon'
          }
          square = shiftDir(square, direction)  // do another shift
        }
      }
      // if in the palace corners, check on adding the 'mirror' across diagonal
      if (getPalaceCorners().includes(start)) {
        const squareColor = getPalaceCorners('red').includes(start) ? 'red' : 'blue'
        const center = getPalaceCenters(squareColor)
        const mirror = mirrorSquare(start)
        const centerIsCannon = board[center] !== null && board[center].type === 'cannon'
        const mirrorIsCannon = board[mirror] !== null && board[mirror].type === 'cannon'
        if (!centerIsCannon && !mirrorIsCannon) {
          if (!this.isEmpty(board[center]) && this.isEmptyOrEnemy(board[mirror])) {
            moves.push(mirror)
          }
        }
      }
      return moves
    }
  
    chariotMoves(board) {
      const start = this.square
      const moves = []
      // append the vertical and horizontal axes
      for (const direction of ['up', 'right', 'down', 'left']) {
        let pieceCount = 0
        let square = shiftDir(start, direction)  // shift the square by 1 in the given direction
        while (square && pieceCount === 0) {  // square will be False if it is off the range of the board
          if (this.isEmpty(board[square])) {
            moves.push(square)  // if square is empty, append it as an option
          } else {
            pieceCount += 1
            this.isEnemy(board[square]) ? moves.push(square) : null
          }
          square = shiftDir(square, direction)  // do another shift
        }
      }
      // if in the palace corners, check on adding the middle and the 'mirror' across diagonal
      if (getPalaceCorners().includes(start)) {
        const squareColor = getPalaceCorners('red').includes(start) ? 'red' : 'blue'
        const center = getPalaceCenters(squareColor)
        const mirror = mirrorSquare(start)
        if (this.isEmptyOrEnemy(board[center])) {
          moves.push(center) // # if center is empty or contains opposing color, append it
        }
        if (board[center] === null && this.isEmptyOrEnemy(board[mirror])) {
          moves.push(mirror) // # if mirror is empty or contains opposing color, append it
        }
      }
      // if in the palace center, check on adding the diagonals
      if (getPalaceCenters().includes(start)) {
        const squareColor = start === getPalaceCenters('red') ? 'red' : 'blue'
        const corners = getPalaceCorners(squareColor)
        corners.forEach(square => {
          if (this.isEmptyOrEnemy(board[square])) {
            moves.push(square)
          }
        })
      }
      return moves
    }
  
    elephantMoves(board) {
      const start = this.square
      const moves = []
      // loop through the squares 1 up, 1 down, 1 left, 1 right
      const verticies = [[1, 0], [0, 1], [-1, 0], [0, -1]]
      verticies.forEach(pair => {
        const [vert, horz] = pair;
        const square = shift(start, vert, horz)
        // # if square at 1 step up/down/left/right is empty, continue
        if (square && this.isEmpty(board[square])) {
          // # from 1 up/down/left/right, do a positive and negative jump
          const posJump = [vert * 2 + horz, horz * 2 + vert]
          const negJump = [vert * 2 - horz, horz * 2 - vert]
          const jumps = [posJump, negJump]
          jumps.forEach(pair => {
            const [vert, horz] = pair;
            // # if square at pos/neg jump is empty, continue
            const square = shift(start, vert, horz)
            if (square && this.isEmpty(board[square])) {
              // # do another jump of the same type (e.g. +1 more right, +1 more up)
              const finalVert = vert > 0 ? (vert + 1) : (vert - 1)
              const finalHorz = horz > 0 ? (horz + 1) : (horz - 1)
              const square = shift(start, finalVert, finalHorz)
              if (square && this.isEmptyOrEnemy(board[square])) {
                moves.push(square)
              }
            }
          })
        }
      })
      return moves
    }
  
    horseMoves(board) {
      const start = this.square
      const moves = []
      // loop through the squares 1 up, 1 down, 1 left, 1 right
      const verticies = [[1, 0], [0, 1], [-1, 0], [0, -1]]
      verticies.forEach(pair => {
        const [vert, horz] = pair;
        const square = shift(start, vert, horz)
        // # if square at 1 step up/down/left/right is empty, continue
        if (square && this.isEmpty(board[square])) {
          // # from 1 up/down/left/right, do a positive and negative jump
          const posJump = [vert * 2 + horz, horz * 2 + vert]
          const negJump = [vert * 2 - horz, horz * 2 - vert]
          const jumps = [posJump, negJump]
          jumps.forEach(pair => {
            const [vert, horz] = pair;
            const square = shift(start, vert, horz)
            if (square && this.isEmptyOrEnemy(board[square])) {
              moves.push(square)
            }
          })
        }
      })
      return moves
    }
  
    guardGeneralMoves(board) {
      const start = this.square
      const moves = []
      const palace = getPalace(this.color)
      const corners = getPalaceCorners(this.color)
      const center = getPalaceCenters(this.color)    
      // # start the listing the squares - 1 spot up/down/left/right IFF that spot is inside palace
      for (const direction of ['up', 'right', 'down', 'left']) {
        const square = shiftDir(start, direction)
        if (square && palace.includes(square) && this.isEmptyOrEnemy(board[square])) {
          moves.push(square)
        }
      }
      // # if start in palace corners, add the center
      if (corners.includes(start)) {
        if (this.isEmptyOrEnemy(board[center])) {
          moves.push(center)
        }
      }
      // # if start is center, add the corners
      if (start === center) {
        for (const corner of corners) {
          if (this.isEmptyOrEnemy(board[corner])) {
            moves.push(corner)
          }
        }
      }
      return moves
    }
  
}
  