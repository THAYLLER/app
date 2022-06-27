import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Platform, ActivityIndicator } from 'react-native';
import CustomFlatList from '../../components/CustomFlatList';
import { CiclooService } from '../../services';

const Validations = (props) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoad] = useState(false);
  useEffect(() => { getTicket(); }, []);

  const getTicket = async () => {
    setLoad(true);
    const list = await CiclooService.GetTicket();
    setTickets(list);
    setLoad(false);
  };

  return !loading ? (<CustomFlatList items={tickets} />) : (<ActivityIndicator style={{ flex: 1 }} />);
};

Validations.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

Validations.navigationOptions = {
  title: 'VALIDAÇÕES',
  headerBackTitle: ' ',
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    color: '#fff',
    fontFamily: 'NunitoSans-Black',
  },
  headerStyle: {
    // height: 102,
    backgroundColor: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
};
export default Validations;
