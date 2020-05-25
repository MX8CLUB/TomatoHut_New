/**
 * 偏远地区包邮
 * @author Jim
 * @date 2020/01/09
 * @update 2020/01/10
 */
import React, {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Axios from 'axios';
import ShopCard from '../../components/ShopCard';
import {ActivityIndicator} from '@ant-design/react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import Header from '../../components/Header';
import {default_category} from '../../global/haodanku_category';

const {width, height} = Dimensions.get('window');

const default_state = {
  list: [],
  cat_id: 0,
  min_id: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...default_state,
    };
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 获取数据
   */
  GetData() {
    const {list, list_loading, list_end, min_id, cat_id} = this.state;
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
          `http://v2.api.haodanku.com/get_free_shipping_data/apikey/mxclub/min_id/${min_id}/cat_id/${cat_id}`,
        )
          .then(res => {
            if (res.data.code === 1) {
              this.setState({
                list_loading: false,
                list: min_id === 1 ? res.data.data : list.concat(res.data.data),
                min_id: res.data.min_id,
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

  /**
   * 切换分类
   */
  ChangeSort(cat_id, index) {
    this.setState(
      {
        ...default_state,
        cat_id,
      },
      () => {
        this.refs.fl.scrollToIndex({index, viewPosition: 0.5});
        this.GetData();
      },
    );
  }

  render() {
    const {list, list_loading, list_end, list_error, cat_id} = this.state;
    return (
      <>
        <Header title={'偏远地区包邮'} search />
        <>
          <FlatList
            style={styles.container}
            ListHeaderComponent={
              <View>
                <Image
                  source={require('../../images/RemoteFreeShipping.jpg')}
                  style={{
                    width: width,
                    height: (300 / 750) * width,
                  }}
                />
                <FlatList
                  ref={'fl'}
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    marginHorizontal: 15,
                    paddingVertical: 15,
                    marginVertical: 15,
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={default_category}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{paddingHorizontal: 15}}
                        onPress={() => this.ChangeSort(item.value, index)}>
                        <Text style={[item.value === cat_id && {color: 'red'}]}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            }
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
            numColumns={2}
            renderItem={item => (
              <ShopCard
                item={{
                  index: item.index,
                  item: {
                    tao_id: item.item.itemid,
                    white_image: item.item.itempic,
                    coupon_info_money: item.item.couponmoney,
                    title: item.item.itemtitle,
                    quanhou_jiage: item.item.itemendprice,
                    size: item.item.itemprice,
                  },
                }}
              />
            )}
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
        </>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FC7E41',
    zIndex: -1,
  },
  header_back: {
    marginLeft: 15,
    marginRight: 5,
  },
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
