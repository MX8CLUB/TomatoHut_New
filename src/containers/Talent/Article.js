/**
 * 达人文章
 * @author Jim
 * @date 2020/02/04
 * @update 2020/02/04
 */
import React, {Component} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import Header from '../../components/Header';
import Axios from 'axios';
import WebView from 'react-native-webview';
import Navigation from '../../utils/Navigation';

const default_state = {
  loading: false,
  data: {},
};

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = default_state;
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 获取数据
   */
  GetData() {
    const {id} = this.props.navigation.state.params;
    Axios.get(
      `http://v2.api.haodanku.com/talent_article/apikey/mxclub/id/${id}/`,
    ).then(res => {
      this.setState({
        data: res.data.data,
      });
    });
  }

  render() {
    const {id} = this.props.navigation.state.params;
    return (
      <>
        <Header title={'达人文章'} />
        <WebView
          style={{flex: 1}}
          originWhitelist={['*']}
          source={{
            uri: `https://api.tomatohut.cn/index/Index/article?id=${id}`,
          }}
          mixedContentMode="always"
          onMessage={event => {
            Navigation.navigate('DetailIndex', {id: event.nativeEvent.data});
          }}
        />
      </>
    );
  }
}
