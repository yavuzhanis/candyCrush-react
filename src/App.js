import { useEffect, useState } from 'react';
import ScoreBoard from './components/ScoreBoard'
import blueCandy from './images/blue-candy.png';
import redCandy from './images/red-candy.png';
import greenCandy from './images/green-candy.png';
import yellowCandy from './images/yellow-candy.png';
import purpleCandy from './images/purple-candy.png';
import orangeCandy from './images/orange-candy.png';
import blank from './images/blank.png';





const width = 8
const candyColors = [
  blueCandy,
  greenCandy,
  yellowCandy,
  orangeCandy,
  redCandy,
  purpleCandy
]

function App() {
  const [currentColorArrangament, setCurrentColorArrangament] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + (width * 2), i + (width * 3)]
      const decidedColor = currentColorArrangament[i]

      if (columnOfFour.every(square => currentColorArrangament[square] === decidedColor)) {
        columnOfFour.forEach(square => currentColorArrangament[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangament[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currentColorArrangament[square] === decidedColor)) {
        rowOfFour.forEach(square => currentColorArrangament[square] = blank)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + (width * 2)]
      const decidedColor = currentColorArrangament[i]

      if (columnOfThree.every(square => currentColorArrangament[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangament[square] = blank)
        return true

      }
    }
  }
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangament[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currentColorArrangament[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangament[square] = blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {

    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangament[i] == blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangament[i] = candyColors[randomNumber]
      }
      if ((currentColorArrangament[i + width]) === blank) {
        currentColorArrangament[i + width] = currentColorArrangament[i]
        currentColorArrangament[i] = blank
      }
    }

  }
  const dragStart = (e) => {
    console.log('drag Start')
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    console.log('drag drop')
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = (e) => {
    console.log('drag end')
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplaceId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArrangament[squareBeingReplaceId] = squareBeingDragged.getAttribute('src')
    currentColorArrangament[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    console.log('square being dragged ID : ', squareBeingDraggedId)
    console.log('squareBeingReplace ID : ', squareBeingReplaceId)


    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]
    const validMove = validMoves.includes(squareBeingReplaceId)

    const isAcolumnOfFour = checkForColumnOfFour();
    const isArowOfFour = checkForRowOfFour();
    const isAcolumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if ( squareBeingReplaceId && 
      validMove && (isARowOfThree || isArowOfFour || isAcolumnOfFour || isAcolumnOfThree )){
        setSquareBeingDragged(null)
        setSquareBeingReplaced(null)
      }else {
        currentColorArrangament [squareBeingReplaceId] = squareBeingReplaced.getAttribute('src')
        currentColorArrangament[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
        setCurrentColorArrangament([...currentColorArrangament])

      }
  }

  const createBoard = () => {
    const randomColorArrangament = []
    for (let i = 0; i < width * width; i++) {
      const randomNumberfrom0to5 = Math.floor(Math.random() * candyColors.length)
      const randomColor = candyColors[randomNumberfrom0to5]
      randomColorArrangament.push(randomColor)
    };
    setCurrentColorArrangament(randomColorArrangament)
  };
  useEffect(() => {
    createBoard();
  }, [width]);

  useEffect(() => {
    const Timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangament([...currentColorArrangament]);
    }, 100)
    return () => clearInterval(Timer)
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangament])


  return (
    <div className="App">
      <div className='game'>
        {currentColorArrangament.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
