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
			playerPositions: [],
			enemyPositions: [],
			message: "",
			playerBoard: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]],
			enemyBoard: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]]
		}
	}

	cellInteraction(data)
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

		this.setState(stateUpdate);
	}

	setEnemyShip(data)
	{
		const stateUpdate = this.state;

		data.shipLogicPosition.forEach(element => {
			stateUpdate.enemyBoard[element[0]][element[1]] = data.shipLabel;
			stateUpdate.enemyPositions.push(element.join());
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
				setEnemyShip={this.setEnemyShip.bind(this)}
				changeCurrentBoard={this.changeCurrentBoard.bind(this)}
				cellInteraction={this.cellInteraction.bind(this)}
				setMessage={this.setMessage.bind(this)}/>
			</section>
		)
	};
}

export default App;
