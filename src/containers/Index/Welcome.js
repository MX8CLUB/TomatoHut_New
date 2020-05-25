/**
 * 欢迎页
 * @author Jim
 * @date 2020/01/15
 */
import React, {PureComponent} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navigation from '../../utils/Navigation';
import {Button, Modal} from '@ant-design/react-native';
import RNExitApp from 'react-native-exit-app';

export default class Welcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      first: true,
    };
  }

  componentDidMount() {
    SplashScreen.hide();
    Storage.load({
      key: 'welcome',
    })
      .then(res => {
        if (res.version) {
          Navigation.replace('IndexIndex');
        } else {
          this.setState(
            {
              show: true,
            },
            () => this.forceUpdate(),
          );
        }
      })
      .catch(err => {
        this.setState(
          {
            show: true,
          },
          () => this.forceUpdate(),
        );
      });
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.setState({
          show: false,
        });
      },
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        !this.state.first &&
          this.setState(
            {
              show: true,
            },
            () => this.forceUpdate(),
          );
      },
    );
  }

  componentWillUnmount() {
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  render() {
    return (
      <ImageBackground
        source={require('../../images/screen.png')}
        style={{flex: 1}}>
        <Modal
          title="服务协议和隐私政策"
          transparent
          visible={this.state.show}
          // closable
          footer={[
            {
              text: '暂不使用',
              style: {color: '#000'},
              onPress: () => RNExitApp.exitApp(),
            },
            {
              text: '同意',
              onPress: () => {
                Storage.save({
                  key: 'welcome',
                  data: {
                    version: '1.1.8',
                  },
                }).then(res => {
                  Navigation.replace('IndexIndex');
                });
              },
            },
          ]}>
          <View style={{paddingVertical: 20}}>
            <Text>
              请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向您提供内容分享等服务，我们需要收集您的设备信息，操作日志等。
            </Text>
            <Text>
              您可阅读
              <Text
                style={{color: '#0e80d2'}}
                onPress={() =>
                  this.setState(
                    {
                      first: false,
                    },
                    () =>
                      Navigation.navigate('WebviewIndex', {
                        title: '服务协议',
                        uri: 'https://api.tomatohut.cn/index/Index/yinsi?tab=1',
                      }),
                  )
                }>
                《服务协议》
              </Text>
              <Text
                style={{color: '#0e80d2'}}
                onPress={() =>
                  this.setState(
                    {
                      first: false,
                    },
                    () =>
                      Navigation.navigate('WebviewIndex', {
                        title: '隐私政策',
                        uri: 'https://api.tomatohut.cn/index/Index/yinsi?tab=2',
                      }),
                  )
                }>
                《隐私政策》
              </Text>
              了解详细信息。如您同意，请点击“同意”开始接受我们的服务。
            </Text>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}
