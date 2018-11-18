import React from 'react';
import {Root} from 'native-base'
import { StyleSheet, Text, View, Button } from 'react-native';
import Navigation from './navigation'

//Root component is used to allow for native-base Toast support
export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Navigation/>
      </Root>
    );
  }
}

