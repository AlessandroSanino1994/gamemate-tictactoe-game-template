import React, { Component } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

export class ToggleButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {style, onPress, underlayColor, text } = this.props;
    return (
      <TouchableHighlight style={style != undefined ? style : styles.default}
                          onPress={onPress != undefined ? onPress : () => {alert("undefined behavior")}}
                          underlayColor={underlayColor != undefined ? underlayColor : "gray"}>
        <Text>
          {text != undefined ? text : ""}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  default : {
    flex:1,
    backgroundColor:"lightgray"
  }
});
