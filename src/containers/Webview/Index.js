/**
 * 网页WebView
 * @author Jim
 * @date 2019/12/18
 * @update 2020/01/18
 */
import React, {PureComponent} from 'react';
import {WebView} from 'react-native-webview';
import Header from '../../components/Header';

export default class Index extends PureComponent {
  render() {
    const {uri, title} = this.props.navigation.state.params;
    return (
      <>
        <Header title={title} />
        <WebView style={{flex: 1}} source={{uri}} />
      </>
    );
  }
}
