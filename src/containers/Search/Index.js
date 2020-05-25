/**
 * 搜索关键词页
 * @author Jim
 * @date 2019/12/13
 * @update 2020/01/10
 */
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Toast} from '@ant-design/react-native';
import Navigation from '../../utils/Navigation';
import Axios from 'axios';
import {ScrollView} from "react-navigation";

const {width, height} = Dimensions.get('window');

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      hotKey: [],
      searchHistory: [],
    };
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 搜索
   * @param keyword
   * @constructor
   */
  Search(keyword) {
    if (keyword === '') {
      Toast.fail('搜索词不能为空', 3, undefined, false);
      return;
    }
    let {searchHistory} = this.state;
    if (searchHistory.indexOf(keyword) === -1) {
      searchHistory.unshift(keyword);
    }
    if (searchHistory.length > 20) {
      searchHistory.pop();
    }
    this.setState(
      {
        searchHistory,
      },
      () => {
        this.SaveSearchHistory();
        Navigation.navigate('SearchList', {keyword});
      },
    );
  }

  /**
   * 获取数据
   */
  GetData() {
    Axios.post('https://v2.api.haodanku.com/hot_key/apikey/mxclub').then(
      res => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
          hotKey: res.data.data,
        });
      },
    );
    Storage.load({
      key: 'searchHistory',
    }).then(res => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        searchHistory: res,
      });
    });
  }

  /**
   * 保存历史记录
   */
  SaveSearchHistory() {
    LayoutAnimation.easeInEaseOut();
    Storage.save({
      key: 'searchHistory', // 注意:请不要在key中使用_下划线符号!
      data: this.state.searchHistory,
      expires: null,
    });
  }

  render() {
    const {keyword, hotKey, searchHistory} = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps={'always'} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_back}
            onPress={() => Navigation.pop()}>
            <Icon name={'arrow-left'} color={'#999999'} />
          </TouchableOpacity>
          <View style={styles.header_body}>
            <Image
              source={require('../../images/search_icon.png')}
              style={styles.header_body_icon}
            />
            <TextInput
              style={styles.header_body_input}
              placeholder={'请输入搜索内容'}
              onChangeText={text => this.setState({keyword: text})}
              onSubmitEditing={() => this.Search(keyword)}
              value={keyword}
            />
            {keyword ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({keyword: ''})}>
                <Icon name={'close-circle'} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_button}
            onPress={() => this.Search(keyword)}>
            <Text style={styles.header_button_text}>搜索</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../images/search.jpg')}
          style={{width, height: (405 / 1080) * width}}
        />
        <View style={styles.hot}>
          <View style={styles.hot_header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../images/search-hot.png')}
                style={{width: 16, height: 16}}
              />
              <Text style={styles.hot_header_key}>热门搜索</Text>
            </View>
          </View>
          <View style={styles.hot_header_body}>
            {hotKey.slice(0, 30).map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  key={index}
                  style={styles.hot_header_body_item}
                  onPress={() => {
                    this.setState(
                      {
                        keyword: item.keyword,
                      },
                      () => {
                        this.Search(item.keyword);
                      },
                    );
                  }}>
                  <Text style={styles.hot_header_body_item_text}>
                    {item.keyword}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.hot}>
          <View style={styles.hot_header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../images/search-history.png')}
                style={{width: 16, height: 16}}
              />
              <Text style={styles.hot_header_key}>历史记录</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState(
                  {
                    searchHistory: [],
                  },
                  () => {
                    this.SaveSearchHistory();
                  },
                );
              }}>
              <Text>清空</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hot_header_body}>
            {searchHistory.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  key={index}
                  style={styles.hot_header_body_item}
                  onPress={() => {
                    this.setState(
                      {
                        keyword: item,
                      },
                      () => {
                        this.Search(item);
                      },
                    );
                  }}>
                  <Text
                    style={styles.hot_header_body_item_text}
                    numberOfLines={1}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 36,
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight + 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_back: {
    marginLeft: 15,
    marginRight: 5,
  },
  header_body: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  header_body_icon: {
    width: 24,
    height: 24,
    tintColor: '#C7C7C7',
    marginHorizontal: 5,
  },
  header_body_input: {
    flex: 1,
    padding: 0,
    paddingRight: 5,
  },
  header_button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '100%',
    backgroundColor: '#FE6007',
    marginRight: 10,
    borderRadius: 5,
  },
  header_button_text: {
    color: '#fff',
    fontSize: 12,
  },
  hot: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  hot_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hot_header_key: {
    marginLeft: 5,
    fontSize: 14,
  },
  hot_header_body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 15,
  },
  hot_header_body_item: {
    backgroundColor: '#F3F3F3',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  hot_header_body_item_text: {
    color: '#000',
    fontSize: 14,
  },
});
