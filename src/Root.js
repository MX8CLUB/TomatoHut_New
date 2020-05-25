/**
 * APP路由
 * @author Jim
 * @date 2019/12/11
 * @update 2020/01/10
 */
import React, {PureComponent} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Provider} from '@ant-design/react-native';
import Navigation from './utils/Navigation';

import IndexWelcome from './containers/Index/Welcome';
import IndexIndex from './containers/Index/Index';

import KefuIndex from './containers/Kefu/Index';

import PinpaiIndex from './containers/Pinpai/Index';
import PinpaiDetail from './containers/Pinpai/Detail';

import TalentIndex from './containers/Talent/Index';
import TalentArticle from './containers/Talent/Article';

import DetailIndex from './containers/Detail/Index';

import SearchIndex from './containers/Search/Index';
import SearchList from './containers/Search/List';

import ClassifyIndex from './containers/Classify/Index';
import ClassifyList from './containers/Classify/List';

import FreeShippingIndex from './containers/FreeShipping/Index';

import RemoteFreeShippingIndex from './containers/RemoteFreeShipping/Index';

import TmallIndex from './containers/Tmall/Index';

import JuhuasuanIndex from './containers/Juhuasuan/Index';

import ShishiIndex from './containers/Shishi/Index';

import BugIndex from './containers/Bug/Index';

import FastBuyIndex from './containers/FastBuy/Index';

import AboutIndex from './containers/About/Index';

import WebviewIndex from './containers/Webview/Index';

const AppContainer = createAppContainer(
  createStackNavigator(
    {
      IndexWelcome,
      IndexIndex,
      KefuIndex,
      PinpaiIndex,
      PinpaiDetail,
      TalentIndex,
      TalentArticle,
      DetailIndex,
      SearchIndex,
      SearchList,
      ClassifyIndex,
      ClassifyList,
      FreeShippingIndex,
      RemoteFreeShippingIndex,
      TmallIndex,
      JuhuasuanIndex,
      ShishiIndex,
      BugIndex,
      FastBuyIndex,
      AboutIndex,
      WebviewIndex,
    },
    {
      defaultNavigationOptions: {
        header: null,
      },
    },
  ),
);

export default class Root extends PureComponent {
  render() {
    return (
      <Provider
        theme={{
          border_width_md: null,
        }}>
        <AppContainer
          ref={navigatorRef => {
            Navigation.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}
