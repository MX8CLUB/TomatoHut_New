/**
 * 关于我们
 * @author Jim
 * @date 2020/01/18
 * @update 2020/01/18
 */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {List} from '@ant-design/react-native';
import Header from '../../components/Header';
import RNBugly from 'rn-bugly';
import Navigation from '../../utils/Navigation';
export default class Index extends Component {
  static navigationOptions = {
    title: '关于我们',
  };
  render() {
    return (
      <View style={styles.container}>
        <Header left={<View />} title={'关于我们'} />
        <>
          <List>
            <List.Item
              thumb={
                <Image
                  style={{width: 20, height: 20, marginRight: 10}}
                  source={require('../../images/tabbar/about.png')}
                />
              }
              arrow={'horizontal'}
              onPress={() => {
                RNBugly.checkUpgrade({isManual: true, isSilence: false});
              }}>
              检查更新
            </List.Item>
          </List>
          <View style={styles.copyright}>
            <Text
              style={{color: '#E94F62'}}
              onPress={() =>
                Navigation.navigate('WebviewIndex', {
                  title: '用户协议',
                  uri: 'https://api.tomatohut.cn/index/Index/yinsi?tab=1',
                })
              }>
              《用户协议》
            </Text>
            <Text>|</Text>
            <Text
              style={{color: '#E94F62'}}
              onPress={() =>
                Navigation.navigate('WebviewIndex', {
                  title: '隐私政策',
                  uri: 'https://api.tomatohut.cn/index/Index/yinsi?tab=2',
                })
              }>
              《隐私政策》
            </Text>
          </View>
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  copyright: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
});
