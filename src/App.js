import { Component } from 'react';

import './App.css';
import Board from "./components/Board"

class App extends Component
{
	constructor()
	{
		super();

		this.state = {
			shipButtonsStatus: {
				isDestroyerSet: false,
				isSubmarineSet: false,
				isCruiserSet: false,
				isBattleshipSet: false,
				isCarrierSet: false,
			},
			currentBoard: "player",
			playerShipsSet: true,
			playerPositions: [],
			enemyPositions: [],
			message: "Pick a ship and a orientation and set your ship positions, then hit \"Start\"!",
			playerBoard: this._createEmptyBoard(),
			enemyBoard: this._createEmptyBoard(),
			enemyVisualBoard: this._createEmptyBoard(), //debug
			allowableEnemyPositions: this._createAllowableEnemyPositions(),
			currentTurn: "player"
		}
	}

	_createAllowableEnemyPositions()
	{
		var allowableX = [];
		
		Array(10).fill("").map((k,row_i) => {
			Array(6).fill("").map((k,row_k) => {
				var horizontal = [];
				for (var i = 0; i < 5; i++) {
				horizontal.push([row_k + i, row_i]);
				}

				allowableX.push(horizontal);

				return null;
			});

			return null;
		});

		var allowableY = [];

		Array(6).fill("").map((k,row_i) => {
			Array(10).fill("").map((k,row_k) => {
			  var vertical = [];
			  for (var i = 0; i < 5; i++) {
				vertical.push([row_k, row_i + i]);
			  }
			  
			  allowableY.push(vertical);

			  return null;
			});

			return null;
		  });
		
		return allowableX.concat(allowableY);
	}

	_createEmptyBoard()
	{
		return [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]];
	}

	setPlayerShip(data)
	{
		var stateUpdate = this.state;

		let shipToDraw = "";
		
		if (data.shipSize === 1) {
			stateUpdate.shipButtonsStatus.isDestroyerSet = true;
			shipToDraw = "D";
		}

		if (data.shipSize === 2) {
			stateUpdate.shipButtonsStatus.isSubmarineSet = true;
			shipToDraw = "S";
		}

		if (data.shipSize === 3) {
			stateUpdate.shipButtonsStatus.isCruiserSet = true;
			shipToDraw = "Cr";
		}

		if (data.shipSize === 4) {
			stateUpdate.shipButtonsStatus.isBattleshipSet = true;
			shipToDraw = "B";
		}

		if (data.shipSize === 5) {
			stateUpdate.shipButtonsStatus.isCarrierSet = true;
			shipToDraw = "Ca";
		}

		data.shipLogicPosition.forEach(element => {
			stateUpdate.playerBoard[element[0]][element[1]] = shipToDraw;
			stateUpdate.playerPositions.push(element.join());
		});

		if (stateUpdate.playerPositions.length === 15) {
			stateUpdate.playerShipsSet = false;
		}

		this.setState(stateUpdate);
	}

	setEnemyShips(data)
	{
		var stateUpdate = this.state;

		data.forEach(enemyShip => {
			enemyShip.shipLogicPosition.forEach(coordinate => {
				stateUpdate.enemyBoard[coordinate[0]][coordinate[1]] = ""; //enemyShip.shipLabel;
				stateUpdate.enemyVisualBoard[coordinate[0]][coordinate[1]] = enemyShip.shipLabel; //debug
				stateUpdate.enemyPositions.push(coordinate.join());
			});
		});

		this.setState(stateUpdate);
	}

	openFire(data)
	{
		var stateUpdate = this.state;
		var nextTurn = stateUpdate.currentTurn;
		var msg = "";
		var newCellLabel = "O";
		var coordinateId = -1;
		var coordinate = data.coordinate;
		var enemyFollowUpShot = false;

		if (nextTurn === "player") {
			coordinateId = stateUpdate.enemyPositions.indexOf(coordinate);
			if (coordinateId !== -1) {
				stateUpdate.enemyPositions.splice(coordinateId, 1);
				newCellLabel = "X";
				msg = "Player scored a hit! Fire again!"
			} else {
				nextTurn = "enemy";
				stateUpdate.currentBoard = "player";
				msg = "You've missed! It's the Enemy turn!"
			}

			coordinate = coordinate.split(",");
			stateUpdate.enemyBoard[parseInt(coordinate[0])][parseInt(coordinate[1])] = newCellLabel;
		} else {
			coordinateId = stateUpdate.playerPositions.indexOf(coordinate);
			if (coordinateId !== -1) {
				stateUpdate.playerPositions.splice(coordinateId, 1);
				newCellLabel = "X";
				msg = "The Enemy scored a hit! Enemy is firing again!"
				enemyFollowUpShot = true;
			} else {
				nextTurn = "player";
				msg = "The Enemy missed! Back to player!"
			}

			coordinate = coordinate.split(",");
			stateUpdate.playerBoard[parseInt(coordinate[0])][parseInt(coordinate[1])] = newCellLabel;
		}

		stateUpdate.currentTurn = nextTurn;
		stateUpdate.message = msg;

		this.setState(stateUpdate, () => {
			if (nextTurn === "enemy") {
				setTimeout(() => {

					var enemyFireAt = [ Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) ].join();

					if (enemyFollowUpShot) {
						var allDirections = [ 'up', 'down', 'left', 'right' ];

						if (parseInt(coordinate[0]) === 0 || this.state.playerBoard[parseInt(coordinate[0]) - 1][parseInt(coordinate[1])] === "X" || this.state.playerBoard[parseInt(coordinate[0]) - 1][parseInt(coordinate[1])] === "O") {
							allDirections.splice(allDirections.indexOf("left"), 1);
							//console.log("cant go left")
						}
						if (parseInt(coordinate[0]) === 9 || this.state.playerBoard[parseInt(coordinate[0]) + 1][parseInt(coordinate[1])] === "X" || this.state.playerBoard[parseInt(coordinate[0]) + 1][parseInt(coordinate[1])] === "O") {
							allDirections.splice(allDirections.indexOf("right"), 1);
							//console.log("cant go right")
						}
						if (parseInt(coordinate[1]) === 0 || this.state.playerBoard[parseInt(coordinate[0])][parseInt(coordinate[1]) - 1] === "X" || this.state.playerBoard[parseInt(coordinate[0])][parseInt(coordinate[1]) - 1] === "O") {
							allDirections.splice(allDirections.indexOf("up"), 1);
							//console.log("cant go up")
						}
						if (parseInt(coordinate[1]) === 9 || this.state.playerBoard[parseInt(coordinate[0])][parseInt(coordinate[1]) + 1] === "X" || this.state.playerBoard[parseInt(coordinate[0])][parseInt(coordinate[1]) + 1] === "O") {
							allDirections.splice(allDirections.indexOf("down"), 1);
							//console.log("cant go down")
						}

						var pickDirection = allDirections[Math.floor(Math.random() * allDirections.length)];

						if (pickDirection === "left") {
							enemyFireAt = [ parseInt(coordinate[0]) - 1, parseInt(coordinate[1]) ].join();
						}
						if (pickDirection === "right") {
							enemyFireAt = [ parseInt(coordinate[0]) + 1, parseInt(coordinate[1]) ].join();
						}
						if (pickDirection === "up") {
							enemyFireAt = [ parseInt(coordinate[0]), parseInt(coordinate[1]) - 1 ].join();
						}
						if (pickDirection === "down") {
							enemyFireAt = [ parseInt(coordinate[0]), parseInt(coordinate[1]) + 1 ].join();
						}
						
						//console.log("follow up shot", pickDirection, allDirections, enemyFireAt);
					}

					this.openFire({ coordinate: enemyFireAt });
				}, 3000);
			}
		});

		console.log(this.state.enemyPositions.length, this.state.playerPositions.length) //debug
	}

	setMessage(msg)
	{
		this.setState({message: msg});
	}

	changeCurrentBoard()
	{
		var changeToBoard = (this.state.currentBoard === "player") ? "enemy" : "player";
		this.setState({currentBoard: changeToBoard});
	}

	render()
	{
		var boardToShow = (this.state.currentBoard === "player") ? this.state.playerBoard : this.state.enemyBoard;

		return(
			<section>
				<Board
				message={this.state.message}
				shipButtonsStatus={this.state.shipButtonsStatus}
				playerPositions={this.state.playerPositions}
				//enemyPositions={this.state.enemyPositions}
				currentBoard={boardToShow}
				enemyVisualBoard={this.state.enemyVisualBoard} //debug
				currenlyShowing={this.state.currentBoard}
				allowableEnemyPositions={this.state.allowableEnemyPositions}
				isPlayerShipsSet={this.state.playerShipsSet}
				currentTurn={this.state.currentTurn}
				openFire={this.openFire.bind(this)}
				setEnemyShips={this.setEnemyShips.bind(this)}
				changeCurrentBoard={this.changeCurrentBoard.bind(this)}
				setPlayerShip={this.setPlayerShip.bind(this)}
				setMessage={this.setMessage.bind(this)}/>
			</section>
		)
	};
}

export default App;
