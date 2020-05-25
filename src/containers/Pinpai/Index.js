/**
 * 品牌券
 * @author Jim
 * @date 2020/01/28
 * @update 2020/01/28
 */
import React from 'react';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import List from './List';
import Header from '../../components/Header';
import {View} from 'react-native';
import {default_category2} from '../../global/haodanku_category';

const Index = () => {
  return (
    <>
      <Header title={'精选品牌'} />
      <ScrollableTabView
        renderTabBar={() => (
          <ScrollableTabBar
            style={{height: 40, borderWidth: 0}}
            tabStyle={{height: 40}}
            backgroundColor={'#fff'}
            activeTextColor={'#E94F62'}
            textStyle={{lineHeight: 40}}
            underlineStyle={{height: 0}}
          />
        )}>
        {default_category2.map((item, index) => (
          <List key={index} tabLabel={item.title} sort={item.value} />
        ))}
      </ScrollableTabView>
    </>
  );
};

export default Index;
