import React, { Component } from 'react';
import dismissKeyboard from 'dismissKeyboard';
import { StyleSheet, Navigator, ToastAndroid, View } from 'react-native';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { Application } from '../../../shared_components/application.js';
import { MainMenuScene } from '../main_menu/mainMenuScene.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';


export class RegisterButton extends Component {
  constructor(props) {
    super(props);
    this.onPressed = this._onPressed.bind(this);
  }

  componentWillMount() {
    this.state = {
      username : this.props.username == null ? this.props.username : '',
      password : this.props.password == null ? props.password : '',
      loading : false
    };
  }

  _onPressed() {
    const { username, password } = this.props;
    if (username != null && username != '' && password != null && password != '') {
      this.setState({loading : true});
      let request = {
        method : 'POST',
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({  //server/models/developer/registration
          Type : 'UserRegistration',
          Username: username,
          Password: password,
          API_Token: Application.APIToken
        })
      };
      let response = fetch('http://gamemate.di.unito.it:8080/user/register', request)
          .then((response) => response.json())
          .then((responseJson) => {
            try {
            switch (responseJson.Type) {
              case 'UserSessionToken':
                Application.SessionToken = responseJson.SessionToken;
                Application.Username = username;
                this.props.navigator.push({
                  name : 'Main Menu',
                  component : MainMenuScene
                });
                break;
              case 'ErrorDetail':
                ToastAndroid.show('Error : ' + responseJson.ErrorMessage, ToastAndroid.LONG);
                break;
              default:
                ToastAndroid.show('Unknown error, retry later', ToastAndroid.LONG);
                break;
            }} catch(ex) {console.warn(ex.message);}
            this.setState({loading : false});
          }).catch((error) => {
            this.setState({loading : false});
            ToastAndroid.show('Unknown error, retry later', ToastAndroid.SHORT);
            console.warn(error.message);
          });
    }
    else {
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
        text='Register'/>
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
    maxHeight:80
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
