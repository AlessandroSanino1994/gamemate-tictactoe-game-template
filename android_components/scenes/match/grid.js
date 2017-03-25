import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { TicTacToe } from '../../game_logic_view/ticTacToe.js';

export class Grid extends Component {
  constructor(props) {
    super(props); //gameGrid, onCellPress()
  }

  render() {
    const { gameGrid, onCellPress } = this.props
    let rowsPartials = [];
    for (let i = 0; i < 3; i++) {
      let singleRow = [];
      for (let j = 0; j < 3; j++) {
        singleRow.push(
          <Cell style={styles.cell}
                X={i}
                Y={j}
                onPress={onCellPress(i, j)}/>
        );
        rowsPartials.push(
          <View style={styles.row}>
            {singleRow}
          </View>
        );
      }
    }
    return (
      <View style={styles.grid}>
        {rowsPartials}
      <View>
    );
  }
}

const styles = StyleSheet.create({
  grid : {
    width:500,
    height:500
  },
  row : {
    flex:1,
    flexDirection:'row'
  },
  cell : {
    flex:1,
    backgroundColor:lightgray,
    borderColor:'black'
  }
});
