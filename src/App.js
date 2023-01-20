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
			playerPositions: [],
			message: "",
			myBoard: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]]
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
			stateUpdate.myBoard[element[0]][element[1]] = shipToDraw;
			stateUpdate.playerPositions.push(element.join());
		});
		stateUpdate.message = "";

		this.setState(stateUpdate);
	}

	setMessage(msg)
	{
		this.setState({message: msg});
	}

	render()
	{
		return(
			<section>
				<Board
				message={this.state.message}
				shipButtonsStatus={this.state.shipButtonsStatus}
				myBoard={this.state.myBoard}
				playerPositions={this.state.playerPositions}
				cellInteraction={this.cellInteraction.bind(this)}
				setMessage={this.setMessage.bind(this)}/>
			</section>
		)
	};
}

export default App;
