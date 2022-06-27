import React, { PureComponent } from 'react';
import {
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';

class DismissKeyboardView extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
      </TouchableWithoutFeedback>
    );
  }
}

export default DismissKeyboardView;
