import React, { Component } from 'react';
import {
  Animated, Dimensions, StyleSheet, TouchableOpacity, View, Text, TextInput, Platform, Keyboard,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import Colors from '../constants/Colors';
import 'moment/locale/pt-br';

const { width } = Dimensions.get('window');

const placeholder = {
  label: '',
  value: 0,
  color: '#6853C8',
};
const genders = [
  {
    id: 1,
    label: 'Masculino',
    value: 1,
    color: '#6853C8',
  },
  {
    id: 2,
    label: 'Feminino',
    value: 2,
    color: '#6853C8',
  },
  {
    id: 3,
    label: 'Outros',
    value: 3,
    color: '#6853C8',
  },
];
class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' || (this.props.label === 'Gênero' && this.props.value === 0) ? 0 : 1);
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state: { isFocused } } = this;
    // if (prevProps !== props) {
    if (props.label === 'Gênero') console.log('this._animatedIsFocused', this._animatedIsFocused);
    Animated.timing(this._animatedIsFocused, {
      toValue: isFocused || (props.label !== 'Gênero' && props.value !== '') || (props.label === 'Gênero' && props.value !== 0) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // Animated.timing(this._animatedIsFocusedGender, {
    //   toValue: (isFocused || props.value !== 0) ? 1 : 0,
    //   duration: 200,
    // }).start();
    // }
  }

  validate(type) {
    let validAndRaw = [];
    switch (type) {
      case 'CPF':
        // const cpfIsValid = this.cpfField.isValid();
        // const cpfRawValue = this.cpfField.getRawValue();
        // console.log('cpfIsValid, cpfRawValue', cpfIsValid, cpfRawValue);
        validAndRaw = [this.cpfField.isValid(), this.cpfField.getRawValue()];
        break;
      case 'Data de Nascimento':
        validAndRaw = [this.bdayField.isValid(), this.bdayField.getRawValue()];
        break;

      default:
        break;
    }
    return validAndRaw;
  }

  render() {
    const {
      label, onChange, blur, focused, style, ...props
    } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#66666600', '#8EA7AB'],
      }),
    };
    const labelStyleGender = {
      big: {
        position: 'absolute',
        left: 4,
        fontFamily: 'Rubik-Regular',
        top: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [10, -23],
        }),
        color: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: ['#66666600', '#8EA7AB'],
        }),
        paddingTop: 30,
        // marginTop: -40,
        // marginBottom: -40,
      },
      label: {
        opacity: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
        color: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: ['#141414', '#66666600'],
        }),
        fontFamily: 'Rubik-Light',
        fontSize: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 23],
        }),
        top: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [23, 0],
        }),
        // top: 23,
        left: 8,
        marginTop: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
        marginBottom: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -30],
        }),
      },
    };
    if (label === 'Gênero') {
      return (
        <View style={[styles.floatingLabel, { paddingTop: 0 }]}>
          <Animated.Text style={[labelStyleGender.big, { ...style }]}>{label}</Animated.Text>
          <Animated.Text style={[labelStyleGender.label, { ...style }]}>Escolha seu gênero</Animated.Text>
          <RNPickerSelect
            placeholderTextColor="#8EA7AB"
            {...props}
            textInputProps={{
              style: {
                height: 32,
                paddingTop: 4,
                marginBottom: -2,
                fontSize: 16,
                color: '#000',
                borderBottomWidth: 2,
                borderBottomColor: '#6853C8',
                paddingLeft: 8,
                // fontFamily: 'NunitoSans-ExtraLight',
                fontWeight: '500',
                width: width - 50,
                alignSelf: 'center',
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 4,
              },
              keyboardAppearance: 'dark',
            }}
            placeholder={placeholder}
            items={genders}
            onValueChange={(value) => {
              if (value !== 0) this.setState({ isFocused: true });
              if (value === 0) this.setState({ isFocused: false });
              onChange(value);
            }}
            doneText="Feito"
            style={
              Platform.select({
                ios: pickerSelectStyles.inputIOS,
                android: pickerSelectStyles.inputAndroid,
              })
            }
            useNativeAndroidPickerStyle={false}
            onOpen={() => {
              console.log('aberto');
              this.setState({ isFocused: true });
            }}
            onClose={() => {
              console.log('fechado');
              this.setState({ isFocused: false });
            }}
          />
        </View>
      );
    }
    if (label === 'CPF*') {
      return (
        <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
          <Animated.Text style={[labelStyle, { ...style }]}>
            {label}
          </Animated.Text>
          <TextInputMask
            contextMenuHidden
            type="cpf"
            ref={(ref) => {this.cpfField = ref; (this.props.registerInputRef) ? this.props.registerInputRef('cpf', ref) : null}}
            {...props}
            style={{
              height: 32,
              paddingTop: 2,
              marginBottom: -2,
              fontSize: 16,
              color: '#000',
              borderBottomWidth: 2,
              borderBottomColor: '#6853C8',
              paddingLeft: 8,
              fontFamily: 'Rubik-Light',
              ...style,
              // paddingLeft: props.value !== '' ? 18 : 8,
            }}
            validator={(valid) => { console.log(valid); }}
            keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
            placeholderTextColor="#8EA7AB"
            onFocus={() => {
              this.setState({ isFocused: true });
              const [isOK, raw] = this.validate('CPF');
            }}
            onBlur={() => {
              this.setState({ isFocused: false });
              const [isOK, raw] = this.validate('CPF');
              blur(raw, isOK);
            }}
            blurOnSubmit={false}
            onChangeText={(val) => {
              console.log(val);
              onChange(val);
              const [isOK, raw] = this.validate('CPF');
              blur(raw, isOK);
            }}
            onSubmitEditing={() => {console.log({nextRef: this.props.nextRef, edit: this.props.submitEditing});(this.props.submitEditing) ? this.props.submitEditing(this.props.nextRef) : null}}
          />
        </View>
      );
    }
    if (label === 'Data de Nascimento') {
      return (
        <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
          <Animated.Text style={[labelStyle, { ...style }]}>
            {label}
          </Animated.Text>
          <TextInputMask
            contextMenuHidden
            type="datetime"
            options={{
              format: 'DD/MM/YYYY',
            }}
            ehVal={() => {
              const bdayFormat = moment(this.bdayField.props.value, 'DDMMYYYY').utc().format();
              console.log('ehVal funcionando', bdayFormat);
              const [isOK, raw] = this.validate('Data de Nascimento');
              blur(this.bdayField.props.value, isOK, bdayFormat);
            }}
            ref={(ref) => {this.bdayField = ref; (this.props.registerInputRef) ? this.props.registerInputRef('birthday', ref) : null}}
            {...props}
            style={{
              height: 32,
              paddingTop: 2,
              marginBottom: -2,
              fontSize: 16,
              color: '#000',
              borderBottomWidth: 2,
              borderBottomColor: '#6853C8',
              paddingLeft: 8,
              fontFamily: 'Rubik-Light',
              ...style,
              // paddingLeft: props.value !== '' ? 18 : 8,
            }}
            validator={(valid) => { console.log('validator', valid); }}
            keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
            placeholderTextColor="#8EA7AB"
            onFocus={() => {
              this.setState({ isFocused: true });
              const [isOK, raw] = this.validate('Data de Nascimento');
            }}
            onBlur={() => {
              this.setState({ isFocused: false });
              const [isOK, raw] = this.validate('Data de Nascimento');
              blur(raw, isOK, false);
            }}
            blurOnSubmit={false}
            onChangeText={(val) => {
              console.log(val);
              onChange(val);
              const [isOK, raw] = this.validate('Data de Nascimento');
              blur(raw, isOK, false);
            }}
            validation={(value) => {
              console.log('validation value', value);
              const [isOK, raw] = this.validate('Data de Nascimento');
              blur(raw, isOK, false);
            }}
            onSubmitEditing={() => {console.log({nextRef: this.props.nextRef, edit: this.props.submitEditing});(this.props.submitEditing) ? this.props.submitEditing(this.props.nextRef) : null}}
          />
        </View>
      );
    }
    if (label === 'Celular') {
      return (
        <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
          <Animated.Text style={[labelStyle, { ...style }]}>
            {label}
          </Animated.Text>
          <TextInputMask
            contextMenuHidden
            type="cel-phone"
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) ',
            }}
            ref={(ref) => {this.cellPhone = ref; (this.props.registerInputRef) ? this.props.registerInputRef('phone', ref) : null}}
            {...props}
            style={{
              height: 32,
              paddingTop: 2,
              marginBottom: -2,
              fontSize: 16,
              color: '#000',
              borderBottomWidth: 2,
              borderBottomColor: '#6853C8',
              paddingLeft: 8,
              fontFamily: 'Rubik-Light',
              ...style,
              // paddingLeft: props.value !== '' ? 18 : 8,
            }}
            keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
            placeholderTextColor="#8EA7AB"
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={() => this.setState({ isFocused: false })}
            blurOnSubmit={false}
            onChangeText={(val) => onChange(val)}
            onSubmitEditing={() => {console.log({nextRef: this.props.nextRef, edit: this.props.submitEditing});(this.props.submitEditing) ? this.props.submitEditing(this.props.nextRef) : null}}
          />
        </View>
      );
    }
    return (
      <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
        <Animated.Text style={[labelStyle, { ...style }]}>
          {label}
        </Animated.Text>
        <TextInput
          // contextMenuHidden
          ref={(ref) => {this[props.refName] = ref; (this.props.refName) ? this.props.registerInputRef(this.props.refName, ref) : null}}
          {...props}
          style={{
            height: 32,
            paddingTop: 2,
            marginBottom: -2,
            fontSize: 16,
            color: '#000',
            borderBottomWidth: 2,
            borderBottomColor: '#6853C8',
            paddingLeft: 8,
            fontFamily: 'Rubik-Light',
            ...style,
            // paddingLeft: props.value !== '' ? 18 : 8,
          }}
          keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
          placeholderTextColor="#8EA7AB"
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
          blurOnSubmit={false}
          onChangeText={(val) => onChange(val)}
          onSubmitEditing={() => {console.log({nextRef: this.props.nextRef, edit: this.props.submitEditing});(this.props.submitEditing) ? this.props.submitEditing(this.props.nextRef) : Keyboard.dismiss()}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  floatingLabel: {
    width: width - 50,
    height: 50,
    // marginLeft: 25,
    // justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default FloatingLabelInput;
