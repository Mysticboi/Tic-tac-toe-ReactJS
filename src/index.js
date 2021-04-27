import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';


function Square(props){
      return (
        <button
            className={props.name}
            onClick={props.onClick}
        >
          {props.value}
        </button>
      );
}

Square.propTypes={
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.any  // Value can be null
};
  
  class Board extends React.Component {

    renderSquare(i,name) {
      return (
      <Square 
        value={this.props.squares[i]} 
        onClick={()=>this.props.onClick(i)} 
        key={i}
        name={name} 
        />
      );
    }
  
    // Normal render
    /*render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
    */
    // for render
    render(){
      let rows=[];
      let counter=0;
      let winning=this.props.winning;
      for(let i=0; i<3;i++){
        let rowSquares=[];
        for(let j=0; j<3; j++){ 
          let current=i*3+j;
          let name= winning.includes(current) ? "winning-square" : "square";
          rowSquares.push(this.renderSquare(counter,name));
          counter++;
        }
        rows.push(<div className="board-row" key={i} >{rowSquares}</div>)
      }
      return (<div>{rows}</div>)
    }
  }

  Board.propTypes={
    winning: PropTypes.array.isRequired,
    squares: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
  };

  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history: [
                { squares: Array(9).fill(null), lastMove:Array(2).fill(null)}
            ],
            xIsNext:true,
            stepNumber:0,
            ascOrder:true,
            winning: Array(3).fill(null)
        }
    }

    handleClick(i){
        let history=this.state.history.slice(0,this.state.stepNumber+1);
        let current=history[history.length -1];
        const squares=current.squares.slice();
        const lastMove=current.lastMove.slice();
        if(squares[i] ||calculateWinner(squares)[0]){
            return;
        }
        squares[i]=this.state.xIsNext ? 'X' : 'O';
        lastMove[0]=i%3+1;
        lastMove[1]=Math.floor(i/3) +1;
        this.setState({
            history: history.concat([{squares : squares, lastMove:lastMove}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });

        let result=calculateWinner(squares);
        if(result[0]){ // When we got a winner we show the winning squares
          const lines=result[1];
          this.setState({
            winning: lines
          });
        }
        if(!squares.includes(null) && !result[0]){
          alert("draw");
        }
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) ===0,
            winning: Array(3).fill(null)
        })
    }

    render() {
        let history=this.state.history;
        const current=history[this.state.stepNumber];
        const n=this.state.stepNumber;
        const winner=calculateWinner(current.squares)[0];
        if(!this.state.ascOrder){
          history=history.reverse();
        }
        
        const moves=history.map((step,move)=>{
            let pos;
            if(this.state.ascOrder){
              if(move){
                  const col=step.lastMove[0];
                  const row=step.lastMove[1];
                  pos=" ( " + col + ", " +row+ " )";
              }
              const desc=move ? 'Go to move #'+ move +pos : 'Go to game start';
              const name_li=move===n ? "bolded-li": "normal-li";
              return(
                  <li key={move} className={name_li}>
                      <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                  </li>
              );
            }
            else{
              if(move!==history.length-1){
                const col=step.lastMove[0];
                const row=step.lastMove[1];
                pos=" ( " + col + ", " +row+ " )";
              }
              const desc=move!==(history.length-1) ? 'Go to move #'+ (history.length-1-move) +pos : 'Go to game start';
              const name_li=history.length-1-move===n ? "bolded-li": "normal-li";
              return(
                <li key={history.length-1-move} className={name_li}>
                    <button onClick={()=>this.jumpTo(history.length-1-move)}>{desc}</button>
                </li>
            );
            }
        });

        if(!this.state.ascOrder){
          history=history.reverse();
        }
        
        let status;
        if(winner){
            status='The player '+winner+' has won';
        }
        else{
            status='Next player: '+(this.state.xIsNext ? 'X':'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i)=>this.handleClick(i)}
                winning={this.state.winning}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div><button onClick={()=>this.setState({ascOrder: !this.state.ascOrder})}> Change order</button></div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a],lines[i]];
      }
    }
    return Array(2).fill(null)
  }