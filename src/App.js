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

		
		if (data.shipSize === 1) {
			stateUpdate.isDestroyerSet = true;
		}

		if (data.shipSize === 2) {
			stateUpdate.isSubmarineSet = true;
		}

		if (data.shipSize === 3) {
			stateUpdate.isCruiserSet = true;
		}

		if (data.shipSize === 4) {
			stateUpdate.isBattleshipSet = true;
		}

		if (data.shipSize === 5) {
			stateUpdate.isCarrierSet = true;
		}

		const currentGrid = this.state.shipPositions;
		currentGrid[data.shipLogicPosition[0]][data.shipLogicPosition[1]] = "X";
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
