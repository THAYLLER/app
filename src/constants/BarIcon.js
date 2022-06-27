import React from 'react';
import {
  View, StyleSheet, Dimensions, Text,
} from 'react-native';

import BackButton from '../components/BackButtonComponent';

const { width, height } = Dimensions.get('window');

class BarIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text>
          Testando
        </Text>
      </View>
    );
  }
}

BarIcon.navigationOptions = ({ navigation }) => ({
  headerLeft: (<BackButton back={navigation} />),
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#FFFFFF00',
    height,
  },
});

export default BarIcon;
