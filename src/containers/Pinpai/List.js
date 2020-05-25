/**
 * 品牌券列表
 * @author Jim
 * @date 2020/01/20
 * @update 2020/01/28
 */
import React, {Component} from 'react';
import {
  FlatList,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import Axios from 'axios';
import {width} from '../../global/Device';
import Navigation from '../../utils/Navigation';
import {ActivityIndicator} from '@ant-design/react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const default_state = {
  list: [],
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: this.props.sort,
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
    const {
      sort,
      list,
      list_page,
      list_loading,
      list_end,
      list_error,
    } = this.state;
    if (list_loading && list_end) {
      return;
    }
    this.setState(
      {
        list_loading: true,
        list_end: false,
        list_error: false,
      },
      () => {
        Axios.get(
          `https://v2.api.haodanku.com/brand/apikey/mxclub/back/20/min_id/${list_page}/brandcat/${sort}`,
        ).then(res => {
          if (res.data.code === 1) {
            this.setState({
              list_loading: false,
              list:
                list_page === 1 ? res.data.data : list.concat(res.data.data),
              list_page: list_page + 1,
            });
          } else {
            this.setState({
              list_loading: false,
              list_end: true,
            });
          }

          this.rc && this.rc.finishRefresh();
        });
      },
    );
  }

  render() {
    const {list, list_end, list_loading, list_error} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
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
          keyExtractor={(item, index) => String(index)}
          renderItem={({item}) => {
            return (
              <View style={styles.card_body}>
                <View style={styles.card_header}>
                  <View style={styles.card_header_logo_box}>
                    <Image
                      style={styles.card_header_logo}
                      source={{uri: item.brand_logo}}
                      resizeMode={'contain'}
                    />
                  </View>
                  <View style={styles.card_center_box}>
                    <Text style={{fontSize: 18, color: '#fff'}}>
                      {item.fq_brand_name}
                    </Text>
                    <Text style={{color: '#fff'}} numberOfLines={1}>
                      {item.introduce}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.card_more}
                    onPress={() =>
                      Navigation.navigate('PinpaiDetail', {id: item.id})
                    }>
                    <Text style={{color: '#fff'}}>查看更多</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.card_footer}>
                  {item.item.slice(0, 3).map((item, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.card_footer_box}
                        onPress={() =>
                          Navigation.navigate('DetailIndex', {id: item.itemid})
                        }>
                        <Image
                          source={{uri: item.itempic}}
                          style={styles.card_footer_image}
                        />
                        <Text numberOfLines={1}>{item.itemshorttitle}</Text>
                        <Text style={styles.card_footer_price}>
                          券后价￥{item.itemendprice}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
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
    backgroundColor: '#f4f4f4',
  },
  card_body: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  card_header: {
    height: 70,
    backgroundColor: '#999',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card_header_logo_box: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 30,
    top: 10,
    left: 25,
  },
  card_header_logo: {
    width: 46,
    height: 46,
    borderRadius: 200,
  },
  card_center_box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 2.5,
  },
  card_more: {
    position: 'absolute',
    backgroundColor: '#FE7330',
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
  },
  card_footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  card_footer_box: {
    width: (width - 20) / 3,
    paddingHorizontal: 10,
  },
  card_footer_image: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    borderRadius: 10,
    marginVertical: 10,
  },
  card_footer_price: {
    color: 'red',
    fontSize: 14,
    paddingVertical: 5,
  },
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
