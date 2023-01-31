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
			message: "",
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
			});
		});

		var allowableY = [];

		Array(6).fill("").map((k,row_i) => {
			Array(10).fill("").map((k,row_k) => {
			  var vertical = [];
			  for (var i = 0; i < 5; i++) {
				vertical.push([row_k, row_i + i]);
			  }
			  
			  allowableY.push(vertical);
			});
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
		stateUpdate.message = "";

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
				stateUpdate.enemyVisualBoard[coordinate[0]][coordinate[1]] = enemyShip.shipLabel; 
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

		if (nextTurn === "player") {
			coordinateId = stateUpdate.enemyPositions.indexOf(coordinate);
			if (coordinateId !== -1) {
				stateUpdate.enemyPositions.splice(coordinateId, 1);
				newCellLabel = "X";
				msg = "It's a hit! Fire again!"
			} else {
				nextTurn = "enemy";
				stateUpdate.currentBoard = "player";
				msg = "Missed! Enemy turn!"
			}

			coordinate = coordinate.split(",");
			stateUpdate.enemyBoard[parseInt(coordinate[0])][parseInt(coordinate[1])] = newCellLabel;
		} else {
			coordinateId = stateUpdate.playerPositions.indexOf(coordinate);
			if (coordinateId !== -1) {
				stateUpdate.playerPositions.splice(coordinateId, 1);
				newCellLabel = "X";
				msg = "It's a hit! Enemy is firing again!"
			} else {
				nextTurn = "player";
				msg = "Missed! Back to player!"
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
					this.openFire({ coordinate: enemyFireAt });
				}, 3000);
			}
		});

		console.log(this.state.enemyPositions.length) //debug
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
