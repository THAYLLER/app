import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CiclooService } from '../services';
import AppService from '../services/AppService';

export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            data: props.data,
            date: new Date(props.date),
            expanded : false,
            disable: false,
            read: props.read,
            cpf: props.cpf,
            id: props.id,
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
    render() {
        const {date} = this.state
        const elapsed = AppService.calcTimeElapsed(date)
        return (
        <View>
            <TouchableOpacity ref={this.accordian} style={[
                styles.row,
                this.state.expanded ? styles.rowHide : styles.rowShow
            ]} onPress={()=>this.toggleExpand()}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[
                        styles.info,
                        this.state.read ? styles.infoHide : styles.infoShow
                    ]} />
                    <View style={{ flexDirection: 'column', width: '88%' }}>
                        <Text style={[styles.title, styles.font]} numberOfLines={1}>{`Há ${elapsed.time > -1 ? elapsed.time : 0} ${(elapsed.time > 1) ? elapsed.plural_prefix : elapsed.prefix}`}</Text>
                        {
                            !this.state.expanded &&
                            <Text numberOfLines={1} style={[
                                styles.subTitle, 
                                styles.font,
                                {width: '88%'},
                                this.state.disable ? styles.subTitleHide : styles.subTitleShow
                            ]}>{this.props.data}</Text>
                        }
                    </View>
                </View>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color='#000' />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    <Text style={[
                        this.props.data.toString().length <= 33 ? styles.textMin : styles.text, 
                    styles.font]}>{this.props.data}</Text>    
                </View>
            }
        </View>
        )
    }

    toggleExpand = async ()=>{
        let {expanded, read, id, cpf} = this.state
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({expanded : !expanded})
        if(!read){
            this.setState({read: true})
            let read = await CiclooService.MarkNotificationAsRead(id)
            if(read){
                this.props.onRead((cpf == null), read)
            }
        }
    }

}

const styles = StyleSheet.create({
    title:{
        fontSize: 12,
        color: '#A9A9A9',
        fontFamily: 'Rubik-Bold',
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#fff',
        
    },
    rowShow: {
        borderBottomColor: '#A9A9A9',
        borderBottomWidth: 1
    },
    rowHide: {
        borderBottomColor: 'transparent',
        borderBottomWidth: 0
    },
    parentHr:{
        height:1,
        color: '#fff',
        width:'100%'
    },
    child:{
        backgroundColor:'transparent',
        borderTopWidth: 0,
        borderBottomColor: '#A9A9A9',
        borderBottomWidth: 1,
        padding:16,
        width: 370
    },
    text: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Rubik-Regular',
        position: 'relative',
        left: 24,
        bottom: 35
    },
    textMin: {
        position: 'absolute',
        left: 44,
        bottom: 37
    },
    subTitle: {
        fontSize: 16,
        
        fontFamily: 'Rubik-Regular'    
    },
    subTitleShow: {
        color: '#000',
    },
    subTitleHide: {
        color: '#A9A9A9',
    },
    info: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginRight: 10,
        marginTop: 10
     },
    infoShow: {
        backgroundColor: '#00d182',
    },
    infoHide: {
        backgroundColor: '#A9A9A9',
    },
});