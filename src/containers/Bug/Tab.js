/**
 * 漏洞单Tab
 * @author Jim
 * @date 2019/12/19
 * @update 2019/12/23
 */
import React from 'react';
import List from './List';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

const Tab = () => {
  return (
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
      <List tabLabel={'全部'} cid={0} />
      <List tabLabel={'女装'} cid={1} />
      <List tabLabel={'母婴'} cid={2} />
      <List tabLabel={'美妆'} cid={3} />
      <List tabLabel={'居家日用'} cid={4} />
      <List tabLabel={'鞋品'} cid={5} />
      <List tabLabel={'美食'} cid={6} />
      <List tabLabel={'文娱车品'} cid={7} />
      <List tabLabel={'数码家电'} cid={8} />
      <List tabLabel={'男装'} cid={9} />
      <List tabLabel={'内衣'} cid={10} />
      <List tabLabel={'箱包'} cid={11} />
      <List tabLabel={'配饰'} cid={12} />
      <List tabLabel={'户外运动'} cid={13} />
      <List tabLabel={'家装家纺'} cid={14} />
    </ScrollableTabView>
  );
};

export default Tab;
