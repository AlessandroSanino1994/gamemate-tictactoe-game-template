import React, { Component } from 'react';
import dismissKeyboard from 'dismissKeyboard';
import { StyleSheet, Navigator, BackAndroid, ToastAndroid, View} from 'react-native';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { MainMenuScene } from '../main_menu/mainMenuScene.js';
import { Application } from '../../../shared_components/application.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';
//import Realm from 'realm';

export class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.onPressed = this._onPressed.bind(this);
  }

  componentWillMount() {
    this.state = {
      username : this.props.username == null ? this.props.username : '',
      password : this.props.password == null ? this.props.password : '',
      loading : false
    };
  }

  _onPressed() {
    const { username, password } = this.props;
    if (username != null && username != '' && password != null && password != '') {
      this.setState({loading : true});
      const request = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Type:'UserAuth',
          Username: username,
          Password: password,
          API_Token: Application.APIToken
        })
      };
      //alert(JSON.stringify(request));
      let response = fetch('http://gamemate.di.unito.it:8080/user/auth', request)
      .then((response) => response.json())
      .then((responseJson) => {
        //console.warn(JSON.stringify(responseJson));
        switch (responseJson.Type) {
          case 'ErrorDetail':
            this.setState({loading : false});
            ToastAndroid.show('Cannot login : ' + responseJson.ErrorMessage, ToastAndroid.SHORT)
            break;
          case 'UserSessionToken':
            Application.SessionToken = responseJson.SessionToken;
            Application.Username = username;
            //save token in realm and push.
            /*
            class RealmObjectImpl {}
            RealmObjectImpl.schema = {
              name : 'developer-info',
              properties : {
                  username : 'string',
                  password : 'string',
                  SessionToken : 'string'
              }
            };
            let realm = new Realm({schema : [RealmObjectImpl]});
            realm.write(() => {
              realm.create('developer-info', {
                  username : username,
                  password : password,
                  SessionToken : Application.Session

              });
            });
            */
            this.setState({loading : false});
            this.props.navigator.push({
              name : 'Main Menu',
              component : MainMenuScene,
              passProps : {
                username : username
              }
            });
            break;
          default:
            this.setState({loading : false});
            ToastAndroid.show('Cannot login', ToastAndroid.SHORT);
            console.warn(JSON.stringify(response));
            break;
        }
        this.setState({loading : false});
      })
      .catch((error) => {
        this.setState({loading : false});
        ToastAndroid.show('Cannot login : network error', ToastAndroid.SHORT)
        console.warn(error.message);
      });
    } else {
      ToastAndroid.show('Please fill username and password fields', ToastAndroid.SHORT);
    }
    dismissKeyboard();
  }

  render() {
    return (
          <LoadingButton
            style={styles.normal}
            loading={this.state.loading}
            onPress={this.onPressed}
            underlayColor='gray'
            text='Login'/>
    );
  }
}

const styles = StyleSheet.create({
  normal : {
    flex:1,
    borderColor : 'black',
    backgroundColor:'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    margin:10,
    borderRadius:20,
    maxHeight:80,
  },
  spinner : {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    margin:10,
    borderRadius:20,
    maxHeight:80,
  }
});
