import React from 'react';
import {useState, Component} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
const result = () => {
  const [data, setData] = useState({
    arrow_result: true,
  });
  const displayresult = () => {
    setData({
      arrow_result: !data.arrow_result,
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => displayresult()}>
        <View style={styles.button}>
          <MaterialIcons
            name={
              data.arrow_result ? 'keyboard-arrow-right' : 'keyboard-arrow-down'
            }
            color="#000000"
            size={35}
          />
          <Text style={styles.textSign}>Result</Text>
        </View>
      </TouchableOpacity>
      {data.arrow_result ? null : (
        <Animatable.View animation="slideInLeft" style={{padding: 15}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            Intoduction to ICT
          </Text>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              style={styles.head}
              flexArr={[1, 1, 1]}
              data={['', 'Assignments', 'Quizes']}
              textStyle={styles.text}
            />
            <TableWrapper style={styles.wrapper}>
              <Col
                data={['1', '2', '3', '4']}
                style={styles.title}
                textStyle={styles.text}
              />
              <Rows
                data={[
                  ['10', '5'],
                  ['6', '6'],
                  ['3', '4'],
                  ['5', '3'],
                ]}
                style={styles.row}
                flexArr={[1, 1]}
                textStyle={styles.text}
              />
            </TableWrapper>
          </Table>

          <View
            style={{
              paddingTop: 10,
              marginBottom: 10,
              borderBottomWidth: 1,
            }}></View>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Math</Text>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              style={styles.head}
              flexArr={[1, 1, 1]}
              data={['', 'Assignments', 'Quizes']}
              textStyle={styles.text}
            />
            <TableWrapper style={styles.wrapper}>
              <Col
                data={['1', '2', '3', '4']}
                style={styles.title}
                textStyle={styles.text}
              />
              <Rows
                data={[
                  ['10', '5'],
                  ['6', '6'],
                  ['3', '4'],
                  ['5', '3'],
                ]}
                style={styles.row}
                flexArr={[1, 1]}
                textStyle={styles.text}
              />
            </TableWrapper>
          </Table>
          <View
            style={{
              paddingTop: 10,
              marginBottom: 10,
              borderBottomWidth: 1,
            }}></View>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            Software Engineering Concept
          </Text>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              style={styles.head}
              flexArr={[1, 1, 1]}
              data={['', 'Assignments', 'Quizes']}
              textStyle={styles.text}
            />
            <TableWrapper style={styles.wrapper}>
              <Col
                data={['1', '2', '3', '4']}
                style={styles.title}
                textStyle={styles.text}
              />
              <Rows
                data={[
                  ['10', '5'],
                  ['6', '6'],
                  ['3', '4'],
                  ['5', '3'],
                ]}
                style={styles.row}
                flexArr={[1, 1]}
                textStyle={styles.text}
              />
            </TableWrapper>
          </Table>
        </Animatable.View>
      )}
    </View>
  );
};
export default result;
const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 10, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {textAlign: 'center'},
  button: {
    alignItems: 'flex-start',
    marginTop: 50,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  textSign: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
