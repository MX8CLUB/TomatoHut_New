/**
 * @format
 */
import {AppRegistry, UIManager} from 'react-native';
import {name as appName} from './app.json';
import Root from './src/Root';
import RNAlibcSdk from 'react-native-alibaichuan';
import './src/utils/Storage';

RNAlibcSdk.initTae(err => {
  if (!err) {
    console.log('阿里百川: ok');
  } else {
    console.log('阿里百川: err');
  }
});

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent(appName, () => Root);
