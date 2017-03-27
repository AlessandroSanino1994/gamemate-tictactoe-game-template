import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { TicTacToe } from '../../game_logic_view/ticTacToe.js';

export class Cell extends Component {
  constructor(props) {
    super(props); //X, Y, Symbol, onPress
  }

  render() {
    const { style, symbol, onPress } = this.props;
    let innerCell;
    if(symbol === TicTacToe.CellValue.EMPTY){
      innerCell = <View></View>;
    } else {
      innerCell = <Image style={styles.innerCell} resizeMode={Image.resizeMode.stretch} source={symbol === TicTacToe.CellValue.CROSS ? TicTacToe.CrossImage : TicTacToe.CircleImage}/>
    }
    return (
      <TouchableHighlight
        style={[style, {flexDirection:'column', alignItems:'stretch', padding:3}]}
        onPress={onPress}>
        {innerCell}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  innerCell : {
    flex:1,
    width: null,
    height: null,
  }
});
