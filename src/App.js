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
			playerBoard: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]],
			enemyBoard: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]],
			allowableEnemyX: this._allowableEnemyX(),
			allowableEnemyY: this._allowableEnemyY(),
			currentTurn: "player"
		}
	}

	_allowableEnemyX()
	{
		var allowableX = [];
		
		Array(10).fill("").map((k,row_i) => {
			Array(10-5).fill("").map((k,row_k) => {
				var horizontal = [];
				for (var i = 0; i < 5; i++) {
				horizontal.push([row_k + i, row_i]);
				}

				allowableX.push(horizontal);
			});
		});

		return allowableX;
	}

	_allowableEnemyY()
	{
		var allowableY = [];

		Array(10-5).fill("").map((k,row_i) => {
			Array(10).fill("").map((k,row_k) => {
			  var vertical = [];
			  for (var i = 0; i < 5; i++) {
				vertical.push([row_k, row_i + i]);
			  }
			  
			  allowableY.push(vertical);
			});
		  });

		  return allowableY;
	}

	setPlayerShip(data)
	{
		const stateUpdate = this.state;

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
		const stateUpdate = this.state;

		data.forEach(enemyShip => {
			enemyShip.shipLogicPosition.forEach(coordinate => {
				stateUpdate.enemyBoard[coordinate[0]][coordinate[1]] = enemyShip.shipLabel;
				stateUpdate.enemyPositions.push(coordinate.join());
			});
		});

		this.setState(stateUpdate);
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
		const boardToShow = (this.state.currentBoard === "player") ? this.state.playerBoard : this.state.enemyBoard;

		return(
			<section>
				<Board
				message={this.state.message}
				shipButtonsStatus={this.state.shipButtonsStatus}
				playerPositions={this.state.playerPositions}
				currentBoard={boardToShow}
				currenlyShowing={this.state.currentBoard}
				allowableEnemyX={this.state.allowableEnemyX}
				allowableEnemyY={this.state.allowableEnemyY}
				isPlayerShipsSet={this.state.playerShipsSet}
				currentTurn={this.state.currentTurn}
				setEnemyShips={this.setEnemyShips.bind(this)}
				changeCurrentBoard={this.changeCurrentBoard.bind(this)}
				setPlayerShip={this.setPlayerShip.bind(this)}
				setMessage={this.setMessage.bind(this)}/>
			</section>
		)
	};
}

export default App;
