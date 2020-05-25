/**
 * APP主页
 * @author Jim
 * @date 2019/12/11
 * @update 2020/01/15
 */
import React, {Component} from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import Main from './Main';
import Classify from './Classify';
import Navigation from '../../utils/Navigation';
import ClassifyIndex from '../Classify/Index';
import AboutIndex from '../About/Index';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import _updateConfig from '../../../update.json';
import {
  checkUpdate,
  downloadUpdate,
  isFirstTime,
  markSuccess,
  switchVersionLater,
} from 'react-native-update';
import RNBugly from 'rn-bugly';

const {appKey} = _updateConfig[Platform.OS];

class Index extends Component {
  static navigationOptions = {
    title: '主页',
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 'home',
    };
  }

  componentDidMount() {
    // Alert.alert('', '1.0.2.2，热更新');
    if (isFirstTime) {
      markSuccess();
    }
    checkUpdate(appKey).then(res => {
      // Alert.alert('', JSON.stringify(res));
      if (res.update) {
        downloadUpdate(res).then(hash => switchVersionLater(hash));
      }
      RNBugly.checkUpgrade({isManual: false, isSilence: true});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'rgba(0,0,0,0)'}
          translucent={true}
          barStyle={'dark-content'}
        />
        <SearchBar />
        <Tab />
      </View>
    );
  }
}

/**
 * 头部搜索框与客服按钮
 * @author Jim
 * @date 2019/12/11
 */
const SearchBar = () => {
  return (
    <View style={styles.search_bar}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.search_bar_body}
        onPress={() => Navigation.navigate('SearchIndex')}>
        <Image
          style={styles.search_bar_image}
          source={require('../../images/search_icon.png')}
        />
        <Text style={styles.search_bar_input}>输入关键词或粘贴淘宝标题</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => Navigation.navigate('KefuIndex')}>
        <Image
          style={styles.search_bar_service}
          source={require('../../images/customer_service_icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

/**
 * 标签页
 */
class Tab extends Component {
  render() {
    return (
      <ScrollableTabView
        ref={ref => (this.tab = ref)}
        renderTabBar={() => (
          <ScrollableTabBar
            style={{height: 40, borderWidth: 0}}
            tabStyle={{height: 40}}
            backgroundColor={'#E94F62'}
            textStyle={{color: '#fff', lineHeight: 40}}
            underlineStyle={{height: 0}}
            activeTextFontSize={20}
            inactiveTextFontSize={16}
          />
        )}>
        <Main tabLabel={'精选'} tab={this} />
        <Classify tabLabel={'女装'} cid={1} />
        <Classify tabLabel={'母婴'} cid={2} />
        <Classify tabLabel={'美妆'} cid={3} />
        <Classify tabLabel={'居家日用'} cid={4} />
        <Classify tabLabel={'鞋品'} cid={5} />
        <Classify tabLabel={'美食'} cid={6} />
        <Classify tabLabel={'文娱车品'} cid={7} />
        <Classify tabLabel={'数码家电'} cid={8} />
        <Classify tabLabel={'男装'} cid={9} />
        <Classify tabLabel={'内衣'} cid={10} />
        <Classify tabLabel={'箱包'} cid={11} />
        <Classify tabLabel={'配饰'} cid={12} />
        <Classify tabLabel={'户外运动'} cid={13} />
        <Classify tabLabel={'家装家纺'} cid={14} />
      </ScrollableTabView>
    );
  }
}

/**
 * Tab
 * @type {*|$ObjMap<S>}
 */
const TabNavigator = createBottomTabNavigator(
  {
    Index,
    ClassifyIndex,
    AboutIndex,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        switch (routeName) {
          case 'Index':
            return (
              <Image
                source={require('../../images/tabbar/home.png')}
                style={[{width: 24, height: 24}, focused && {tintColor}]}
              />
            );
          case 'ClassifyIndex':
            return (
              <Image
                source={require('../../images/tabbar/classify.png')}
                style={[{width: 24, height: 24}, focused && {tintColor}]}
              />
            );
          case 'AboutIndex':
            return (
              <Image
                source={require('../../images/tabbar/about.png')}
                style={[{width: 24, height: 24}, focused && {tintColor}]}
              />
            );
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: '#E94F62',
      inactiveTintColor: '#000',
    },
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search_bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E94F62',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 15,
  },
  search_bar_body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.2)',
    height: 30,
    marginVertical: 10,
    borderRadius: 19,
    paddingLeft: 10,
    marginRight: 10,
  },
  search_bar_image: {
    width: 18,
    height: 18,
  },
  search_bar_input: {
    fontSize: 12,
    paddingLeft: 10,
    lineHeight: 38,
    color: '#fff',
  },
  search_bar_service: {
    width: 30,
    height: 30,
  },
});

export default createAppContainer(TabNavigator);
