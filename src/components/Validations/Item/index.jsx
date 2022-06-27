import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import styles from './styles';

const Item = ({ ticket }) => {
  const { integrationDate, lastStatusDescription, partner } = ticket;

  const getFormatedDescription = (text) => text && text.trim()[0].toUpperCase() + text.slice(1);
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.partnerContainer}>
          <Text style={styles.partnerText}>
            {getFormatedDescription(partner && partner.corporateName ? partner.corporateName : 'Nome não cadastrado')}
          </Text>
          <Text style={styles.dateText}>{format(new Date(integrationDate), 'dd/LL/yyyy')}</Text>
        </View>
        <View>
          <Text style={styles.statusText}>{lastStatusDescription.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
};

Item.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number,
    partnerId: PropTypes.number,
    lastStatusDescription: PropTypes.string,
    integrationDate: PropTypes.string,
    partner: PropTypes.shape({
      corporateName: PropTypes.string,
    }),
  }),
};

Item.defaultProps = {
  ticket: {
    id: 0,
    partnerId: 0,
    lastStatusDescription: '',
    integrationDate: '',
    corporateName: '',
    partner: {
      corporateName: '',
    },
  },
};


export default Item;
