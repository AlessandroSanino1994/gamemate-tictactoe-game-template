import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { TicTacToe } from '../../game_logic_view/ticTacToe.js';

export class Cell extends Component {
  constructor(props) {
    super(props); //X, Y, Symbol, onPress
  }
}
