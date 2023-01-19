import { Component } from 'react';

import './App.css';
import Board from "./components/Board"

class App extends Component
{
	constructor()
	{
		super();

		this.state = {
			isDestroyerSet: false,
			isSubmarineSet: false,
			isCruiserSet: false,
			isBattleshipSet: false,
			isCarrierSet: false,
			shipPositions: [["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""],["","","","","","","","","",""]]
		}
	}

	cellInteraction(data)
	{
		const stateUpdate = {}
		let shipToDraw = "";
		
		if (data.shipSize === 1) {
			stateUpdate.isDestroyerSet = true;
			shipToDraw = "D";
		}

		if (data.shipSize === 2) {
			stateUpdate.isSubmarineSet = true;
			shipToDraw = "S";
		}

		if (data.shipSize === 3) {
			stateUpdate.isCruiserSet = true;
			shipToDraw = "Cr";
		}

		if (data.shipSize === 4) {
			stateUpdate.isBattleshipSet = true;
			shipToDraw = "B";
		}

		if (data.shipSize === 5) {
			stateUpdate.isCarrierSet = true;
			shipToDraw = "Ca";
		}

		const currentGrid = this.state.shipPositions;
		data.shipLogicPosition.forEach(element => {
			currentGrid[element[1]][element[0]] = shipToDraw;
		});
		stateUpdate.shipPositions = currentGrid;

		this.setState(stateUpdate);
	}

	render()
	{
		return(
			<section>
				<Board
				shipButtonsStatus={this.state}
				cellInteraction={this.cellInteraction.bind(this)}
				shipPositions={this.state.shipPositions} />
			</section>
		)
	};
}

export default App;
