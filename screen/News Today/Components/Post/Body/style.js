import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width - 15,
        height: Dimensions.get('window').width - 15,
        borderRadius:15,
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    view:{
        justifyContent: 'center',
        alignContent: 'center'
    }
})

export default styles;