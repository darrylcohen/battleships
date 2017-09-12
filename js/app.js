
var randomNumber = function () {
  var randNum = {
    getRandomNum : function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
  }
  return randNum;
}

var player = function () {
  var myName;
  var myManager;

  var playerI = {
    initialise : function(aManager){
      myManager = aManager;
      return playerI;
    },
  }
  return playerI;
}
var ship = function () {
  var mySize;
  var myName;
  var mySymbol;

  var shipI = {
      initialise : function() {
      return shipI;
    },
    setDetails : function (aSize, aName, aSymbol) {
      myName = aName;
      mySize = aSize;
      mySymbol = aSymbol;
    },
    setName : function(aName) {
      myName = aName
    },
    getSize : function() {
      return mySize;
    },
    getSymbol : function() {
      return mySymbol;
    },
    getName : function() {
      return myName;
    },
  }
  return shipI;
}

var grid = function () {
  var myPositions = []
  var mySize;
  var myNumber;
  var gridI = {
    initialise : function(aSize, aNumber) {
      mySize = aSize;
      myNumber = aNumber;
      gridI.setPositions(' ');
      return gridI;
    },
    getPosition : function(index) {
      return myPositions[index]
    },
    setPositions : function(aSymbol) {
      for (var i = 0; i < mySize; i++) {
        myPositions.push(' ');
      }
    },
    getNumber : function() {
      return myNumber;
    },
    setCol : function(aCol) {
      cols = aCol;
    },
    getSize : function () {
      return mySize;
    },
    getPositions : function() {
      return myPositions;
    },
    setPosition : function(index,symbol) {

      myPositions[index] = symbol;
    }

  }
  return gridI;
}

var shipPlacer = function() {
  var myGrid;
  var myFleet;
  const DOWN = 0;
  const RIGHT = 1;
  var myDirections = [DOWN, RIGHT]

  var shipPlacerI = {
    initialise : function() {
      return shipPlacerI;
    },
    placeShips : function(aGrid, aFleet) {
      myGrid = aGrid;
      myFleet = aFleet;

      myFleet.getShips().forEach(function(aShip){
        shipPlacerI.plotShip(aShip)
      })
    },
    plotShip : function(aShip) {
      // const SKIPPERS = [ROW_SKIPPER, COLUMN_SKIPPER]
      var myIncrement;
      var mySkipper;
      var myPosition ;
      var myDirection;
      var myCount ;

      do {
        myDirection = randomNumber().getRandomNum(0, 2)
        myPosition =  randomNumber().getRandomNum(0, myGrid.getSize())
      } while (!shipPlacerI.isValidShipPosition(myPosition, myDirection,aShip.getSize()))
      mycount = 0;
      shipPlacerI.insertShip(myPosition, myDirection, aShip)
      shipPlacerI.blockSurrounds(myPosition, myDirection, aShip)
    },

    insertShip  :function (myPosition, myDirection, aShip) {
      const ROW_SKIPPER = 10;
      const COLUMN_SKIPPER = 1;
      var myCount = 0;

      do {
        myGrid.setPosition(myPosition, aShip.getSymbol())
        myPosition += myDirection === DOWN ? ROW_SKIPPER : COLUMN_SKIPPER
        myCount++
      } while (myCount < aShip.getSize())
    },

    getDirection : function () {
      return randomNumber().getRandomNum(0, 2)
    },

    isValidShipPosition : function (aPosition, aDirection, aSize) {
      const MAX_COLUMNS = 10
      var myIsPossible =true;
      var startRow = Math.floor(aPosition / MAX_COLUMNS);
      var endRow

      if (aDirection === RIGHT) {
        endRow = Math.floor((aPosition + aSize - 1) / MAX_COLUMNS)
      } else {
        endrow = aPosition + ((aSize - 1) * 10)
      }
      if (startRow !== endRow && aDirection === RIGHT) {
        myIsPossible = false;
      } else if (aDirection === DOWN && aPosition + ((aSize - 1) * 10) >= myGrid.getSize() )  {
        myIsPossible = false;
      } else if (aDirection === RIGHT && aPosition + ((aSize - 1) > 10) >= myGrid.getSize() ) {
        myIsPossible = false;
      } else if (!shipPlacerI.isShipPlaceable(aPosition, aDirection, aSize) ){
        myIsPossible = false;
      }
      return myIsPossible;
    },

    isOffGrid : function(aPointer,aPosition) {
      var result = false;
      if (aPosition % 10 === 9 && aPointer % 10 === 0) {
        return true;
      } else if (aPosition % 10 === 0 && aPointer % 9 === 9)  {
        return true;
      }
      return result;
    },

    isValidBlock : function (aPointer, aPosition) {
      result = true;
      if(aPosition < 0 || aPosition  >100) {
        result = false;
      } else if (myGrid.getPosition(aPointer) !== ' ')  {
        result = false;
      } else if (shipPlacerI.isOffGrid(aPointer,aPosition)) {
        result = false;
      }
      return result;
    },

    isShipPlaceable : function (aPosition, aDirection, aSize) {
      var tempPosition = aPosition
      var aStartPosition  = aPosition - 10 - 1; // move the start to left top diagonal
      var aPointer = aStartPosition
      var myHorizontal, myVertical
      var result = true;

      if (aDirection === DOWN) {
        myHorizontal = 3; // blocl 3 colummns
        myVertical = aSize + 2;
        // positionmyIncrementer = 10
      } else {
        myHorizontal = aSize + 2;
        myVertical = 3; // block 3 rows
      }

      for(var i = 0; i < myVertical; i++ ) {
        for (var j = 0; j < myHorizontal; j++) {
          if ( aPointer <  100 && aPointer >= 0) {
            if(myGrid.getPosition(aPointer) !== ' ') {
              result = false;
              break
            }
            aPointer += 1
          }
        }
        if (result === false) {
          break;
        }
        aPointer = aStartPosition +  10 * (i+1); // junmps to next row
      }
        return result;
    },

    // // sets all the squares arounf the ship so no ship can be placed there
    blockSurrounds : function(aPosition, aDirection, aShip) {
      var tempPosition = aPosition
      var aStartPosition  = aPosition - 10 - 1; // move the start to left top diagonal
      var aPointer = aStartPosition
      var myHorizontal, myVertical

      if (aDirection === DOWN) {
        myHorizontal = 3; // blocl 3 colummns
        myVertical = aShip.getSize() + 2;
        // positionmyIncrementer = 10
      } else {
        myHorizontal = aShip.getSize() + 2;
        myVertical = 3; // block 3 rows
      }
      for(var i = 0; i < myVertical; i++ ) {
        for (var j = 0; j < myHorizontal; j++) {
          if(aPointer < 100  && aPointer >= 0) {
            if(shipPlacerI.isValidBlock(aPointer, aPosition )) {
              myGrid.setPosition(aPointer,'.');
            }
          }
          aPointer += 1
        }
        aPointer = aStartPosition +  10 * (i+1); // junmps to next row
      }
    },

    isPositionEmpty : function (aPosition) {

    },
    // // My grid goes from 1 to 100. This checks if the ship crosses from 1 row to another
    getManager : function () {
      return myManager;
    },
  }
  return shipPlacerI
}

var fleet = function() {
  var myShips = []
  var fleetI = {
    initialise : function () {
      return fleetI
    },
    addShip : function(aShip) {
      myShips.push(aShip)
    },
    removeShip : function(aShip) {
      myShips.splice(ships.indexOf(myWord),1)
    },
    isFleetDead : function() {
      return myShips.length === 0;
    },
    hasShipBeenHit : function() {
    },
    getShip : function(index) {
      return myShips[index];
    },
    getShips : function() {
      return myShips;
    }
  }
  return fleetI;
}

var viewer = function () {
  var myManager;
  var viewerI = {
    initialise : function(aManager) {
      myManager = aManager
      var play = document.getElementById('play');
      play.addEventListener('click', function() {
        document.getElementById('instructions').style.display = 'none'
        document.getElementById('midContainer').style.display = 'block'
        myManager.playGame();
      })
      return viewerI;
    },
    displayMessage : function(aMessage) {
      var msg = document.getElementById('message')
      msg.textContent = aMessage;
    },
    clearGrids : function() {
      var gridSystem = document.querySelector('#gridSystem')
      while (gridSystem.firstChild) {
          gridSystem.removeChild(gridSystem.firstChild);
      }
    },
    updateScore : function(aID, aScore) {
      var score = document.getElementById(aID);
      score.textContent = aScore
    },
    drawGrids : function (aGrids, aGameScorer) {

      var gridSystem = document.querySelector('#gridSystem')
      var count =1;
      for (var i = 0; i < aGrids.length; i++) {
        var playerGrid = document.createElement('div')
        playerGrid.className = 'playerGrid'
        var playerName = document.createElement('div')
        playerName.className = 'playerName'

        playerName.textContent = 'PLAYER ' + count;
        count++;

        playerGrid.appendChild(playerName)

        var shipGrid = viewerI.buildGrid(aGrids[i]);
        playerGrid.appendChild(shipGrid)
        var scoreGrid = viewerI.buildScoreGrid(aGameScorer[i],i)
        playerGrid.appendChild(scoreGrid)

        gridSystem.appendChild(playerGrid)

      }
    },

    buildScoreGrid : function(aGameScore,parentID) {
      var aScoreGrid = document.createElement('div')
      aScoreGrid.className = 'scoreGrid'

      for (var i = 0; i < aGameScore.length; i++ ) {
        var aScore = document.createElement('div')
        aScore.className = 'score'

        var aShipName = document.createElement('p')
        var aShipScore = document.createElement('p')

        aShipName.textContent = aGameScore[i].getName()
        aShipName.id = 'n'+ parentID + aGameScore[i].getID()
        aShipScore.textContent = aGameScore[i].getTotal()
        aShipScore.id = 's'+ parentID + aGameScore[i].getID()
        aScore.appendChild(aShipName);
        aScore.appendChild(aShipScore);
        aScoreGrid.appendChild(aScore);
      }
      return aScoreGrid;
    },

    buildGrid : function(aGrid) {
      var colIndicator = [' ','0','1','2','3','4','5','6','7','8','9']
      // var aGrid = document.createElement('div')
      var columnLetters = document.createElement('div')
      var rowNumbers = document.createElement('div')
      var gridPositions = document.createElement('div')
      var lower = document.createElement('div')

      var mainGrid = document.createElement('div')

      mainGrid.className = 'mainGrid'
      columnLetters.className = 'topGrid'
      lower.className= 'lowerGrid'
      rowNumbers .className = 'gridLeft'
      gridPositions.className = 'gridRight'

      for( var i = 0; i < colIndicator.length; i++ ) {
        var div = document.createElement('div')

        div.textContent = colIndicator[i];
        div.className = 'columnLetter';
        columnLetters.appendChild(div)
      }

      for( var i = 0 ; i < 10; i++ ) {
        var div = document.createElement('div')
        div.textContent = i;
        div.className = 'rowNumber';
        rowNumbers.appendChild(div)
      }
      lower.appendChild(rowNumbers)

      for( var i = 0; i < aGrid.getSize(); i++ ) {
        var div = document.createElement('button')
        // div.textContent = aGrid.getPosition(i);
        div.textContent = ' '
        div.id = i;
        div.className = 'gridPosition';
        gridPositions.appendChild(div)
      }
      gridPositions.addEventListener('click', function(){
        myManager.shotHasBeenFired(aGrid.getNumber(), event);

      })
      lower.appendChild(gridPositions)

      mainGrid.appendChild(columnLetters)
      mainGrid.appendChild(lower)

      return mainGrid;
    },
  }
  return viewerI
}

var scorer = function () {
  var myShipName
  var mySymbol
  var myTotal
  var myID
  var scorerI = {
    initialise : function(aShipName, aSymbol,aID) {
      myShipName = aShipName
      mySymbol = aSymbol
      myID = aID
      myTotal = 0;
      return scorerI
    },
    updateScore : function() {
      myTotal += 1
    },
    getName : function() {
      return myShipName
    },
    getTotal : function() {
      return myTotal
    },
    getSymbol : function() {
      return mySymbol
    },
    getID : function() {
      return myID
    },
    getScore : function () {
      return myTotal;
    }
  }
  return scorerI
}

var manager = function(){
  const DEFAULT_PLAYERS = 0;
  const SIZE = 100;
  const INITIL_GRID_VALUE = ' '
  const MAX_SHIPS = 11
  var numberOfPlayers = DEFAULT_PLAYERS;
  var battleship = [4, 'Battleship', 'B'];
  var cruiser = [3, 'Cruiser', 'C'];
  var destroyer = [2, 'Destroyer', 'D']
  var submarine = [1,'Submarine', 'S']
  var myShipTypes = ['Battleship', 'Cruiser', 'Destroyer', 'Submarine', 'Missiles']
  var myShipSymbols = ['B', 'C', 'D', 'S','M']
  var thisFleet = [battleship, cruiser, destroyer, submarine]
  var myPlayers = [];
  var myGrids = []
  var myFleet = fleet()
  var myShipPlacer;
  var myViewer
  var myGameScorers = []

  // var myShipPlacer = shipPlacer();
  var managerI = {
    clearGame : function() {
      myGrids =[]
      myGameScorers = []
      myFleet = fleet()
      myShipPlacer = null;
    },
    playGame : function() {
      managerI.createPlayers();
      managerI.createFleet();
      managerI.createGrids();
      managerI.createScorers();
      managerI.createShipPlacer();
      myGrids.forEach(function(aGrid){
      myShipPlacer.placeShips(aGrid, myFleet)
      });
      managerI.drawGrids(myPlayers)
    },
    initialise : function () {
      myViewer = viewer().initialise(this);
      var numberPlayers = document.querySelector('#players');
      numberPlayers.value = ' '
      numberPlayers.addEventListener('change',  function(){
        if (event.target.value === 'The Universe') {
          myViewer.displayMessage('I need more grunt, mate')
        } else if (event.target.value === '1000000') {
          myViewer.displayMessage('This is going to take some time. Get Coffee')
        } else {
          myViewer.displayMessage('')
          numberOfPlayers = parseInt(event.target.value);
          managerI.clearGame();
          myViewer.clearGrids();
          managerI.playGame();
        }
      })
    },
    startGame : function() {
      managerI.initialise();
    },
    shotHasBeenFired : function(aGridNumber, anEvent) {
      var mySymbol = myGrids[aGridNumber].getPosition(anEvent.target.id)
      var myPosition = anEvent.target.id
      if (typeof(mySymbol) !== 'undefined') {
        if(myShipSymbols.indexOf(mySymbol) === -1 ) {
          // anEvent.target.textContent = 'W'
          anEvent.target.className = 'missileMist'
        } else {
          anEvent.target.textContent = mySymbol
          anEvent.target.className = 'missileLanded'
        }
        anEvent.target.disabled = true;

        var myScorer = myGameScorers[aGridNumber]
        var myScore = managerI.getScorer(myScorer,mySymbol)
        myScore.updateScore()
        var id = 's' + aGridNumber + myScore.getID();
        myViewer.updateScore(id,myScore.getScore());

        if (managerI.isWinner(myScorer)) {
          myViewer.displayMessage('Player ' + (aGridNumber + 1) + ' is the Winner');
        }
      }
    },
    isWinner : function (aScorer) {
      var result = false;
      if( managerI.getTotalShipsHit(aScorer) === MAX_SHIPS) {
        result = true;
      }
      return result;
    },
    getTotalShipsHit :function (aScorer) {
      myTotal = 0
      for(var i = 0 ; i < aScorer.length -1; i++ ) { // Leave off the misses
        myTotal += aScorer[i].getScore();
      }
      return myTotal
    },
    getScorer : function (aScorer, aSymbol) {
      if (myShipSymbols.indexOf(aSymbol) === -1) {
        aSymbol = 'M'
      }
      for(var i = 0 ; i < aScorer.length; i++) {
        if (aScorer[i].getSymbol() === aSymbol ) {
          return aScorer[i]
        }
      }
    },
    createShipPlacer : function() {
      myShipPlacer = shipPlacer().initialise();
    },
    drawGrids : function () {
      myViewer.drawGrids(myGrids,myGameScorers)
    },

    createFleet : function() {
      var count = 0;
      var mySize, myName, mySmbol
      myFleet.initialise();
      for (var i = 0; i < thisFleet.length ; i++) {
        mySize = thisFleet[i][0]
        myName = thisFleet[i][1]
        mySymbol = thisFleet[i][2]
        var myShip = ship().initialise()
        myShip.setDetails(mySize, myName, mySymbol)
        if (i === 3) {
          for(var j = 0; j < 2; j++ ) {
              myFleet.addShip(myShip)
          }
        } else {
            myFleet.addShip(myShip)
        }
      }
    },

    createScorers : function () {
      for(var i = 0; i < numberOfPlayers; i++) {
        var gameScorer = []

        for(var j = 0; j < myShipTypes.length; j++ ) {
          var myScorer = scorer().initialise(myShipTypes[j], myShipSymbols[j], j)
          gameScorer.push(myScorer)
        }
        myGameScorers.push(gameScorer)
      }
    },
    createGrids : function () {
      for(var i = 0; i < numberOfPlayers; i++) {
        myGrids.push(grid().initialise(SIZE, i));
      }
    },
    getFleet : function() {
      return myFleet;
    },
    getNumberOfPlayers : function () {
      return numberOfPlayers;
    },
    createPlayers : function() {
      myPlayers = []
      for(var i = 0; i < numberOfPlayers; i++) {
        myPlayers.push(player().initialise(managerI));
      }
    },
    getGrid : function (index) {
      return myGrids[index];
    },
    getPlayer : function(index) {
      return myPlayers[index];
    },
  }
  return managerI
}
var game = manager();
game.startGame();
