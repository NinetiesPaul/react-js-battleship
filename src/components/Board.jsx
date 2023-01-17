import { React, Component } from "react";

class Board extends Component {

    letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    render()
    {
        return (
            <section>
                <table id="board">
                    <thead>
                        <tr>
                            {
                                this.letters.map((k,i) => {
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
                                                        id={row_i + "_" + cell_i}
                                                        key={cell_i}
                                                        onClick={(event) => {console.log(event.target.id)}}
                                                        ></td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>
            </section>
        )
    }
}

export default Board;
