import { React } from "react";
import { Component } from 'react';
import { Container, Button, Typography } from "@material-ui/core";

class Board extends Component {

    constructor()
    {
        super();

        this.gameStage = 1;

        this.currentSelectedShip = "";
        this.currentSelectedShipOrientation = "";
        this.hidePlayerShipButtons = false;
    }

    handleClickCell(event)
    {
        var posX = parseInt(event.target.getAttribute("px"));
        var posY = parseInt(event.target.getAttribute("py"));

        if (this.gameStage === 1) {
            if (this.currentSelectedShip !== "" && this.currentSelectedShipOrientation !== "") {
                
                if (this.currentSelectedShip > 1 && 
                    ((this.currentSelectedShipOrientation === "leftToRight" && (posX + this.currentSelectedShip) > 10) ||
                    (this.currentSelectedShipOrientation === "topToBottom" && (posY + this.currentSelectedShip) > 10))) {
                    this.props.setMessage("Invalid position!");
                    return false;
                }

                var positionsToDraw = [];
                for (var i = 0; i < this.currentSelectedShip; i++) {
                    var pX = (this.currentSelectedShipOrientation === "leftToRight") ? posX + i : posX;
                    var pY = (this.currentSelectedShipOrientation === "topToBottom") ? posY + i : posY;

                    if (this.props.playerPositions.includes([pX, pY].join())){
                        this.props.setMessage("Invalid position!");
                        return false;
                    };
                    positionsToDraw.push([pX, pY]);
                }

                const data = {
                    shipSize: this.currentSelectedShip,
                    shipLogicPosition: positionsToDraw,
                };

                this.props.setPlayerShip(data)

                this.currentSelectedShip = "";
            }
        }

        if (this.gameStage === 2 && !this.props.gameEnded) {
            if (this.props.currentTurn === "player" && this.props.currenlyShowing === "enemy") {
                if (event.target.innerText === "") {
                    this.props.openFire({ coordinate: [posX, posY].join() })
                }
            }
        }
    }

    handleClickShipSelectionButton(size)
    {
        if (this.gameStage === 1) {
            this.currentSelectedShip = size;
        }
    }

    handleClickShipOrientationButton(orientation)
    {
        if (this.gameStage === 1) {
            this.currentSelectedShipOrientation = orientation;
        }
    }

    handleStartGame()
    {
        if (this.gameStage === 1) {
            this.gameStage += 1;

            var allAllowableEnemyPositions = this.props.allowableEnemyPositions;
            var enemyShipsToDraw = [];

            [['Ca', 5], ['B', 4], ['Cr', 3], ['S', 2], ['D', 1]].forEach(element => {

                var enemyPositionsToDraw = [];
                enemyPositionsToDraw = allAllowableEnemyPositions.splice(Math.floor(Math.random() * allAllowableEnemyPositions.length), 1)[0];

                enemyPositionsToDraw.forEach(coordinate => {
                    allAllowableEnemyPositions.forEach((allowableCoord, i) => {
                        if (allowableCoord.join().includes(coordinate.join())){
                            allAllowableEnemyPositions.splice(i, 1);
                        }
                    })
                });

                enemyPositionsToDraw.splice(enemyPositionsToDraw.length - (5 - element[1]));

                var data = {
                    shipLabel: element[0],
                    shipLogicPosition: enemyPositionsToDraw,
                };

                enemyShipsToDraw.push(data);
            });
                
            this.props.setEnemyShips(enemyShipsToDraw);

            this.hidePlayerShipButtons = true;
            this.props.setMessage("Game has started!");
        }
    }

    handleBoardChange()
    {
        this.props.changeCurrentBoard();
    }

    render()
    {
        const letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        return (
            <Container component="article" maxWidth="sm">

                <Container id="box_options">
                    <section hidden={ this.hidePlayerShipButtons }>
                        <Button
                        onClick={() => this.handleClickShipSelectionButton(1)}
                        disabled={this.props.shipButtonsStatus.isDestroyerSet}>Destroyer</Button>

                        <Button
                        onClick={() => this.handleClickShipSelectionButton(2)}
                        disabled={this.props.shipButtonsStatus.isSubmarineSet}>Submarine</Button>

                        <Button
                        onClick={() => this.handleClickShipSelectionButton(3)}
                        disabled={this.props.shipButtonsStatus.isCruiserSet}>Cruiser</Button>

                        <Button
                        onClick={() => this.handleClickShipSelectionButton(4)}
                        disabled={this.props.shipButtonsStatus.isBattleshipSet}>Battleship</Button>

                        <Button
                        onClick={() => this.handleClickShipSelectionButton(5)}
                        disabled={this.props.shipButtonsStatus.isCarrierSet}>Carrier</Button>

                        <Button onClick={() => this.handleClickShipOrientationButton("leftToRight")}>Horizontally</Button>
                        <Button onClick={() => this.handleClickShipOrientationButton("topToBottom")}>Vertically</Button>
                    </section>

                    <section id="bottom_text">
                        <Typography><b>Current turn: </b>{this.props.currentTurn}</Typography>
                        <Typography><b>Showing: </b>{this.props.currenlyShowing} board</Typography>
                        <Typography><b>Last message:</b> {this.props.message}</Typography>
                    </section>
                </Container>

                <br/>

                <table id="board">
                    <thead>
                        <tr>
                            {
                                letters.map((k,i) => {
                                    return(
                                        <td key={i}>{k}</td>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                            {
                                Array(10).fill("").map((k,row_i) => {
                                    return(
                                        <tr key={row_i}>
                                            <td >{row_i + 1}</td>
                                            {
                                                Array(10).fill("").map((k,cell_i) => {
                                                    return(
                                                        <td
                                                        id={letters[cell_i + 1] + "_" + (row_i + 1)}
                                                        px={cell_i}
                                                        py={row_i}
                                                        key={cell_i}
                                                        ship={this.props.enemyVisualBoard[ cell_i][row_i ]} //debug
                                                        onClick={this.handleClickCell.bind(this)}
                                                        >{this.props.currentBoard[cell_i][row_i]}</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>

                <Button onClick={() => this.handleStartGame()} disabled={this.props.isPlayerShipsSet}>Start Game</Button>
                <Button onClick={() => this.handleBoardChange()} disabled={this.props.isPlayerShipsSet}>Change Board</Button><br/>
            </Container>
        )
    }
}

export default Board;
