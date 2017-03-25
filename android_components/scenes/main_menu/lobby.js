import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { ToggleButton } from '../../buttons/toggleButton.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';

import {
  Text,
  StyleSheet,
  ListView,
  View,
  ToastAndroid
} from 'react-native';

const dataSourceModel = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});

export class Lobby extends Component {
  constructor(props){
    super(props);
    this.renderRow = this._renderRow.bind(this);
  }

  componentWillMount() {
    const { socket } = this.props;

    this.setState({
      lobby : null,
      rows : [],
      datasource : dataSourceModel.cloneWithRows([])
    });

    socket.onmessage = (event) => {
        //parse event.data
        //handle only lobby events
        //when match starts pass to another scene
        //which will replace this function with
        //another regarding only match events.
        response = JSON.parse(event.data);
          const { lobby } = this.state;
          const { Action, RoomID, Players, PlayersLeft, MatchStarted } = response;
          console.warn(JSON.stringify(response));
          switch (Action) {
            case "RoomUpdate":
              this.setState({
                lobby : {
                  RoomID : RoomID,
                  Players : Players,
                  PlayersLeft : PlayersLeft,
                  MatchStarted : MatchStarted
                },
                Players : Players,
                datasource : dataSourceModel.cloneWithRows(Players)
              });
              if (MatchStarted) {
                //push match started view.
                console.warn("MATCH STARTED");
              }
              break;
              default:
                console.warn("UNKNOWN MESSAGE : " + JSON.stringify(response));
                break;
          }
    };
  }

  componentWillUnmount() {
    //detach message handling.
    const { socket } = this.props;
    socket.onmessage = () => {};
  }

  _renderRow(singleItem) {
    return <Text> {singleItem.Username} </Text>;
  }

  AddPlayer(player) {
    const { rows } = this.state;
    rows.append(player);
    this.setState({
      rows : rows,
      datasource : dataSourceModel.cloneWithRows(rows)
    });
  }

  render() {
    const { datasource, lobby } = this.state;
    return(
      <View>
        <Text>
            {lobby != null ?
            "Current Members in Lobby Number " +
            lobby.RoomID + " (" + (lobby.PlayersLeft == 0 ? "Starting..." : "-" +
            lobby.PlayersLeft.toString() + " to Start") + "):" : "No current lobby"}
        </Text>
        <ListView style={styles.playerList} dataSource={datasource}
            renderRow={this.renderRow}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerList : {
    height:200
  }
});
