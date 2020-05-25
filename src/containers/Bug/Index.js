/**
 * 漏洞单
 * @author Jim
 * @date 2019/12/19
 * @update 2019/12/19
 */
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Navigation from '../../utils/Navigation';
import {Icon} from '@ant-design/react-native';
import Tab from './Tab';
import {StatusBarHeight} from '../../global/Device';
import {formatDate} from '../../utils/FormatDate';

const default_state = {
  list: [],
  list_time: formatDate(new Date()),
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
  list_cid: '',
};

export default class Index extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_back}
            onPress={() => Navigation.pop()}>
            <Icon name={'arrow-left'} color={'#999999'} />
          </TouchableOpacity>
          <Text style={styles.header_body_text} numberOfLines={1}>
            漏洞单
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_search}
            onPress={() => Navigation.navigate('SearchIndex')}>
            <Image
              source={require('../../images/search_icon.png')}
              style={styles.header_search_icon}
            />
          </TouchableOpacity>
        </View>
        <Tab />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    height: 36,
    flexDirection: 'row',
    marginTop: StatusBarHeight + 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_back: {
    marginLeft: 15,
    marginRight: 5,
  },
  header_body: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  header_body_text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  header_search: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  header_search_icon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
});
