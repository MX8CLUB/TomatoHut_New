/**
 * 分类
 * @author Jim
 * @date 2019/12/18
 * @update 2020/01/09
 */
import React, {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Navigation from '../../utils/Navigation';
import Axios from 'axios';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

export default class Index extends PureComponent {
  static navigationOptions = {
    title: '分类',
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      selected: 0,
    };
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 获取分类信息
   */
  GetData() {
    Axios.get('https://api.tomatohut.cn/api/Shop/superClassify').then(res => {
      let arr = [];
      let key = 0;
      arr[key] = {
        name: res.data.data[0].name,
        data: [],
      };
      res.data.data.map(item => {
        if (item.name === arr[key].name) {
          arr[key].data.push({
            cid: item.cid,
            q: item.q,
            q_pic: item.q_pic,
          });
        } else {
          arr[++key] = {
            name: item.name,
            data: [],
          };
          arr[key].data.push({
            cid: item.cid,
            q: item.q,
            q_pic: item.q_pic,
          });
        }
      });
      this.setState({
        loading: false,
        data: arr,
      });
    });
  }
  render() {
    const {loading, data, selected} = this.state;
    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={require('../../lotties/196-material-wave-loading')}
            autoPlay
            style={{width: width / 3}}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <SearchBar />
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FlatList
            style={styles.left}
            data={data}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.sv.scrollTo({x: 0, y: 0, animated: false});
                    this.setState({
                      selected: index,
                    });
                  }}
                  style={[
                    styles.left_item,
                    selected == index && styles.left_item_active,
                  ]}>
                  <Text
                    style={[
                      styles.left_item_text,
                      selected == index && styles.left_item_text_active,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <ScrollView ref={ref => (this.sv = ref)} style={styles.right}>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              {data[selected].data.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      Navigation.navigate('ClassifyList', {
                        cid: item.cid,
                        q: item.q,
                      })
                    }
                    key={index}
                    style={[
                      styles.right_item,
                      (index + 1) % 1 || {marginLeft: 12},
                    ]}>
                    <Image
                      style={styles.right_item_image}
                      source={{uri: item.q_pic}}
                    />
                    <Text style={styles.right_item_text}>{item.q}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const SearchBar = () => {
  return (
    <View style={styles.search_bar}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.search_bar_body}
        onPress={() => Navigation.navigate('SearchIndex')}>
        <Text style={styles.search_bar_input}>输入关键词或粘贴淘宝标题</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  search_bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  search_bar_body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4E4E4',
    height: 30,
    marginVertical: 10,
    borderRadius: 19,
    paddingLeft: 10,
    marginRight: 10,
  },
  search_bar_input: {
    fontSize: 12,
    paddingLeft: 10,
    lineHeight: 38,
    color: '#898989',
  },
  left: {
    flexGrow: 0,
    flexShrink: 0,
    width: 100,
    borderRightWidth: 1,
    borderColor: '#E4E4E4',
  },
  left_item: {
    // flex: 1,
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left_item_active: {
    backgroundColor: '#E94F62',
  },
  left_item_text: {
    color: '#000',
    fontSize: 16,
  },
  left_item_text_active: {
    color: '#fff',
  },
  right: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  right_item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  right_item_image: {
    width: (width - 160) / 3,
    height: (width - 160) / 3,
    borderRadius: 100,
  },
  right_item_text: {
    fontSize: 14,
    paddingVertical: 5,
  },
});
