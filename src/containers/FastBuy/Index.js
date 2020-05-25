/**
 * 咚咚抢
 * @author Jim
 * @date 2020/01/10
 * @update 2020/01/12
 */
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import {StatusBarHeight, width} from '../../global/Device';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import {ActivityIndicator, Toast} from '@ant-design/react-native';
import Axios from 'axios';
import Navigation from '../../utils/Navigation';

/**
 * .昨天的0点，2.昨天10点，3.昨天12点，4.昨天15点，5.昨天20点，
 * 6.今天的0点，7.今天10点，8.今天12点，9.今天15点，10.今天20点，
 * 11.明天的0点，12.明天10点，13.明天12点，14.明天15点，15.明天20点
 * @type {Array}
 */
const hour_type = [
  {title: '00:00'},
  {title: '10:00'},
  {title: '12:00'},
  {title: '15:00'},
  {title: '20:00'},
  {title: '00:00'},
  {title: '10:00'},
  {title: '12:00'},
  {title: '15:00'},
  {title: '20:00'},
  {title: '00:00'},
  {title: '10:00'},
  {title: '12:00'},
  {title: '15:00'},
  {title: '20:00'},
];

let hours = new Date().getHours();
let type;
if (hours < 10) {
  type = 6;
} else if (hours < 12) {
  type = 7;
} else if (hours < 15) {
  type = 8;
} else if (hours < 20) {
  type = 9;
} else {
  type = 10;
}

const default_state = {
  type,
  list_type: type,
  list: [],
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...default_state,
    };
  }

  componentDidMount() {
    this.GetData();
    /**
     * 因为Android在初始化View的时候先进行测量，
     * 调用Android View自带的onMeasure进行测量，然后再调用View中的onLayout方法进行布局，
     * 如果在这之前RN 调用ListView的scrollTo方法，并不会起作用。所以可以过一段时间后再调用就不会存在问题。
     *
     * @url https://blog.csdn.net/gongziwushuang/article/details/88530707
     */
    setTimeout(
      () => this.refs.fl.scrollToIndex({index: type - 1, viewPosition: 0.5}),
      500,
    );
  }

  /**
   * 获取数据
   */
  GetData() {
    const {
      type,
      list_type,
      list,
      list_loading,
      list_end,
      list_page,
    } = this.state;
    if (list_loading && list_end) {
      return;
    }
    this.setState(
      {
        list_loading: true,
        list_error: false,
        list_end: false,
      },
      () => {
        Axios.get(
          `http://v2.api.haodanku.com/fastbuy/apikey/mxclub/hour_type/${list_type}/min_id/${list_page}`,
        )
          .then(res => {
            if (res.data.code === 1) {
              this.setState({
                list_loading: false,
                list:
                  list_page === 1 ? res.data.data : list.concat(res.data.data),
                list_page: res.data.min_id,
              });
            } else {
              this.setState({
                list_loading: false,
                list_end: true,
              });
            }
            this.rc && this.rc.finishRefresh();
          })
          .catch(err => {
            this.setState({
              list_loading: false,
              list_error: true,
            });
          });
      },
    );
  }

  changeType(type) {
    this.setState(
      {
        ...default_state,
        list_type: type,
      },
      () => {
        this.GetData();
        this.refs.fl.scrollToIndex({
          index: type - 1,
          viewPosition: 0.5,
        });
      },
    );
  }

  render() {
    const {
      type,
      list_type,
      list,
      list_page,
      list_error,
      list_loading,
      list_end,
    } = this.state;
    return (
      <View style={styles.container}>
        <Header title={'咚咚抢'} search />
        <Image
          style={{width: width, height: (580 / 1125) * width, zIndex: 100}}
          source={require('../../images/fastbuy.jpg')}
        />
        <FlatList
          ref={'fl'}
          style={styles.menu}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hour_type}
          getItemLayout={(data, index) => ({
            length: 90,
            offset: 90 * index,
            index,
          })}
          keyExtractor={(item, index) => String(index)}
          renderItem={({item, index}) => {
            // if (index === hour_type.length - 1) {
            //   list_type === type &&
            //     this.refs.fl.scrollToIndex({
            //       index: type - 1,
            //       viewPosition: 0.5,
            //     });
            // }
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.changeType(index + 1)}
                style={[
                  styles.menu_item,
                  index === list_type - 1 && {backgroundColor: 'red'},
                ]}>
                <Text style={{color: '#fff'}}>{item.title}</Text>
                <Text style={{color: '#fff'}}>
                  {index < 5
                    ? '昨日开抢'
                    : index > 9
                    ? '明日开抢'
                    : index < type - 1
                    ? '已开抢'
                    : index > type - 1
                    ? '即将开抢'
                    : '正在疯抢'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <FlatList
          style={{paddingVertical: 5}}
          refreshControl={
            <SmartRefreshControl
              ref={ref => (this.rc = ref)}
              renderHeader={<DefaultHeader />}
              onRefresh={() =>
                this.setState(default_state, () => this.GetData())
              }
            />
          }
          onEndReached={() => !list_end && !list_error && this.GetData()}
          onEndReachedThreshold={0.2}
          data={list}
          keyExtractor={item => item.itemid}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.list_box}
                activeOpacity={1}
                onPress={() => {
                  if (list_type > type) {
                    Toast.info('即将开抢，请耐心等待！', 2, undefined, false);
                  } else {
                    Navigation.navigate('DetailIndex', {id: item.itemid});
                  }
                }}>
                <Image source={{uri: item.itempic}} style={styles.list_img} />
                <View style={styles.list_body}>
                  <View>
                    <Text numberOfLines={1} style={styles.list_body_title}>
                      {item.itemshorttitle}
                    </Text>
                    <Text style={styles.list_body_desc}>
                      {item.short_itemdesc}
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <ImageBackground
                        source={require('../../images/quanbg.png')}
                        style={{
                          width: 60,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: '#FC973A'}}>
                          {item.couponmoney}元券
                        </Text>
                      </ImageBackground>
                      <Text style={{color: '#ccc', fontSize: 12}}>
                        已抢{item.todaysale}件
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <Text style={{color: '#F62D23', fontSize: 12}}>
                        券后￥
                        <Text style={{fontSize: 14}}>{item.itemendprice}</Text>
                      </Text>
                      <ImageBackground
                        source={require('../../images/dqbtn.png')}
                        style={{
                          width: 66,
                          height: 26,
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 10,
                        }}
                        imageStyle={list_type > type && {tintColor: 'green'}}>
                        <Text style={{fontSize: 12, color: '#FFF'}}>
                          {list_type > type ? '即将开抢' : '马上抢'}
                        </Text>
                      </ImageBackground>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            list_end ? (
              <Text style={styles.list_footer}>已经到底了~</Text>
            ) : list_error ? (
              <Text style={styles.list_footer}>网络有点问题~</Text>
            ) : (
              <View style={{height: 30, justifyContent: 'center'}}>
                <ActivityIndicator color={'#F55C6E'} text={'加载中'} />
              </View>
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  menu: {
    zIndex: 100,
    position: 'absolute',
    top: (580 / 1125) * width + StatusBarHeight,
    backgroundColor: '#484545',
    // backgroundColor: 'rgba(0,0,0,0)',
  },
  menu_item: {
    width: 90,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list_box: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
  },
  list_img: {
    height: 140,
    width: 140,
    borderRadius: 10,
  },
  list_body: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'space-between',
  },
  list_body_title: {
    color: '#000',
  },
  list_body_desc: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
