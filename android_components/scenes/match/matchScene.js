import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { TicTacToe } from '../../game_logic_view/ticTacToe.js';
import { Grid } from './grid.js';

import {
  Text,
  StyleSheet,
  ListView,
  View,
  ToastAndroid
} from 'react-native';



export class MatchScene extends Component {
  constructor(props) {
    super(props);
    const {firstPlayer, player} = this.props;
    this.MY_SIMBOL = firstPlayer.Username === Application.Username ? TicTacToe.CellValue.CROSS : TicTacToe.CellValue.CIRCLE;
    this.onCellPress = this._onCellPress.bind(this);
  }

  componentWillMount() {
    const { lobby, socket, firstPlayer } = this.props;

    let initialMatrix = [];
    for(let i = 0; i < 3; i++) {
      initialMatrix[i] = [TicTacToe.CellValue.EMPTY, TicTacToe.CellValue.EMPTY, TicTacToe.CellValue.EMPTY];
    }

    this.setState({
      lobby : lobby,
      gameMatrix : initialMatrix,
      socket : socket,
      turnOfPlayer : firstPlayer,
      finished : false,
      enableUI : this.MY_SIMBOL === TicTacToe.CellValue.CROSS,
    });

    socket.onmessage = (event) => {
      response = JSON.parse(event.data);
      const { lobby, socket, gameMatrix, turnOfPlayer } = this.state;
      const { username } = this.props;
      const { Action, RoomID, CustomData, Cell, Symbol, Player, NextPlayer, Result, Winner} = response;
      console.warn(JSON.stringify(response));
      switch (Action) {
        case "NewMove":
          const { gameMatrix } = this.state;
          gameMatrix[Cell.X][Cell.Y] = Symbol;
          this.setState({
            gameMatrix : gameMatrix,
            turnOfPlayer : NextPlayer
          })
          if(Result != TicTacToe.MatchStatus.ONGOING){
            this.setState({
              finished : true,
              enableUI : false,
              turnOfPlayer : null
            });
            if(Result == TicTacToe.MatchStatus.WIN) {
              ToastAndroid.show("And the winner is... " + turnOfPlayer.Username, ToastAndroid.LONG);
            } else {
              ToastAndroid.show("It's a DRAW", ToastAndroid.LONG);
            }
          } else if(NextPlayer.Username === Application.Username) {
            //my turn
            this.setState({
              enableUI : true
            });
          }
          break;
        case "MoveRejected":
          if (Result == TicTacToe.MatchStatus.ONGOING) {
            gameMatrix[Cell.X][Cell.Y] = TicTacToe.CellValue.EMPTY;
            this.setState({
              gameMatrix : gameMatrix,
              enableUI : true,
              turnOfPlayer : {
                ID : -1,
                Username : username
              }
            });
          }
          break;
        default:
          console.warn("UNKNOWN MESSAGE : " + JSON.stringify(response));
          break;
      }
    };
  }

  _onCellPress(X, Y) {
    return () => {
      const { gameMatrix, enableUI } = this.state;
      if (enableUI && gameMatrix[X][Y] == TicTacToe.CellValue.EMPTY) {
        const { socket } = this.state;
        const request = {
          Type : "Move",
          API_Token : Application.APIToken,
          SessionToken : Application.SessionToken,
          CustomData : {
            Cell : {
              X : parseInt(X),
              Y : parseInt(Y)
            },
            Symbol : parseInt(this.MY_SIMBOL)
          }
        };
        console.warn(JSON.stringify(request));
        socket.send(JSON.stringify(request));
        this.setState({
          enableUI : false
        });
      }
    }
  }

  _onDummyPress(X, Y) {
    return () => {
      console.warn(X + " - " + Y + "MY SIMBOL = " + this.MY_SIMBOL);
      let { gameMatrix } = this.state;
      gameMatrix[X][Y] = this.MY_SIMBOL;
      this.setState({
        gameMatrix : gameMatrix
      });
    }
  }

  componentWillUnmount() {
    //detach message handling.
    const { socket } = this.props;
    socket.onmessage = () => {};
  }

  render() {
    const { gameMatrix, enableUI, finished } = this.state;
    const matchStatusText = !enableUI ? "Waiting for opponents" : "It's your turn, touch a cell to place your symbol";
    return (
      <View style={styles.container}>
        <Grid onCellPress={this.onCellPress} gameGrid={gameMatrix} finished={finished}/>
        <Text style={styles.matchStatus}>
          {finished ? "Match finished" : matchStatusText}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    flexDirection : 'column',
    alignItems:'center',
    justifyContent:'center'
  },
  matchStatus : {
    flex:1
  }
});
