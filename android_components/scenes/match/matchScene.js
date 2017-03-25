import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { TicTacToe } from '../../game_logic_view/ticTacToe.js';
import {
  Text,
  StyleSheet,
  ListView,
  View,
  ToastAndroid
} from 'react-native';



export class Lobby extends Component {
  constructor(props) {
    super(props);
    const {firstPlayer, username} = this.props;
    this.MY_SIMBOL = firstPlayer.Username == username ? TicTacToe.CROSS : TicTacToe.CIRCLE;

    this.onCellPress = this._onCellPress.bind(this);
  }

  componentWillMount() {
    const { lobby, socket, firstPlayer } = this.props;

    const initialMatrix = []
    for(let i = 0; i < 3; i++) {
      initialMatrix[i] = [TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY];
    }
    this.setState({
      lobby : lobby,
      gameMatrix : initialMatrix,
      socket : socket,
      turnOfPlayer : firstPlayer,
      finished : false,
      matchStatusText : this.MY_SIMBOL === TicTacToe.CROSS ? TicTacToe.StatusYourTurn : TicTacToe.StatusWaitingOpponent
    });

    socket.onmessage = (event) => {
        //parse event.data
        //handle only lobby events
        //when match starts pass to another scene
        //which will replace this function with
        //another regarding only match events.
        response = JSON.parse(event.data);
          const { lobby } = this.state;
          const { Action, RoomID, CustomData} = response;
          console.warn(JSON.stringify(response));
          switch (Action) {
            case "MatchUpdate":
              const { Cell, Symbol, Player, TurnOfPlayer, End } = response;
              const { gameMatrix } = this.state;
              gameMatrix[Cell.X][Cell.Y] = Symbol;
              this.setState({
                gameMatrix : gameMatrix,
                turnOfPlayer : !End ? TurnOfPlayer : null
              })
              if(End){
                this.setState({
                  finished : true
                });
                ToastAndroid.show("And the winner is... " + Player.Username, ToastAndroid.LONG);
              }
              break;
            case "MoveRejected":
              const { Cell, Symbol, End } = response;
              const { gameMatrix } = this.state;
              if (!End) {
                gameMatrix[Cell.X][Cell.Y] = TicTacToe.EMPTY;
                this.setState({
                  gameMatrix : gameMatrix
                });
              }
              break;
            case "MoveOK":
              const { Cell, Symbol, TurnOfPlayer } = response;
              this.setState({
                turnOfPlayer : TurnOfPlayer
              });
              break;
              default:
                console.warn("UNKNOWN MESSAGE : " + JSON.stringify(response));
                break;
          }
    };
  }

  _onCellPress(X, Y) {
    return () => {
      const { gameMatrix } = this.state;
      if (gameMatrix[X][Y] == TicTacToe.EMPTY) {
        const { socket } = this.state;
        const request = {
          API_Token : Application.APIToken,
          SessionToken : Application.SessionToken,
          CustomData : {
            Cell : {
              X : X,
              Y : Y
            },
            Symbol : this.MY_SIMBOL
          }
        };
        socket.send(JSON.stringify(request));
      }
    }
  }

  _onDummyPress(X, Y) {
    let { gameMatrix } = this.state;
    gameMatrix[X, Y] = TicTacToe.CROSS;
    this.setState({
      gameMatrix : gameMatrix
    });
  }

  componentWillUnmount() {
    //detach message handling.
    const { socket } = this.props;
    socket.onmessage = () => {};
  }

  render() {
    const { gameMatrix, matchStatusText, finished } = this.state;
    return (
      <View style={styles.container}>
        <Grid onCellPress={this._onDummyPress.bind(this)} gameGrid={gameMatrix} finished={finished}/>
        <Text style={styles.matchStatus}>
          {matchStatusText}
          {!finished ? "Touch a valid cell to make your move" : ""}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    flexDirection : 'column'
  },
  matchStatus : {
    flex:1
  }
});
