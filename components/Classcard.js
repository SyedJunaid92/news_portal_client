import React from 'react';
import {Text, View} from 'react-native';

const Classcard = ({name}) => {
  return (
    <View style={styles.classCard}>
      <View>
        <Text style={styles.classLogo}>{name.slice(0, 2).toUpperCase()}</Text>
      </View>
      <Text style={styles.classNames}>{name}</Text>
    </View>
  );
};

export default Classcard;
const styles = {
  classCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    paddingLeft: 15,
    margin: 10,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 15,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  classNames: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 24,
  },
  classLogo: {
    marginTop: 5,
    marginRight: 10,
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#BC986A',
    borderRadius: 30,
    color: 'white',
  },
};
