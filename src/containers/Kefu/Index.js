/**
 * 客服
 * @author Jim
 * @date 2020/01/14
 * @update 2020/01/14
 */
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  Clipboard,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import {Toast} from '@ant-design/react-native';

export default class Index extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          title={'专属客服'}
          backgroundColor={'#E94F62'}
          backColor={'#fff'}
          titleColor={'#fff'}
        />
        <View
          style={{
            position: 'absolute',
            height: 150,
            width: '100%',
            backgroundColor: '#E94F62',
          }}
        />
        <View style={styles.background}>
          <Image
            style={{
              width: 64,
              height: 64,
              marginRight: 15,
              tintColor: '#E94F62',
            }}
            source={require('../../images/kefu.png')}
          />
          <View style={{flex: 1}}>
            <Text style={{color: '#000'}}>
              使用番茄小屋APP的过程中，您可以添加专属客服，咨询使用问题，番茄小屋专属客服将为您服务
            </Text>
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.list_item}>
            <Image
              style={{width: 32, height: 32}}
              source={require('../../images/wechat.png')}
            />
            <Text style={{flex: 1, color: '#fff', marginLeft: 20}}>
              微信:lcc1314624
            </Text>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#fff',
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
              onPress={() => {
                Clipboard.setString('lcc1314624');
                Toast.info('复制成功', 1, undefined, false);
              }}>
              <Text style={{color: '#fff'}}>立即复制</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  background: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 150,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 30,
  },
  list: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1ED0B8',
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
});
