/**
 * 主页分类
 * @author Jim
 * @date 2019/12/12
 * @update 2019/12/14
 */
import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ShopCard from '../../components/ShopCard';
import Axios from 'axios';
import {ActivityIndicator, Icon} from '@ant-design/react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import {formatDate} from '../../utils/FormatDate';

// 初始化state
const default_state = {
  list: [],
  list_time: formatDate(new Date()),
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class Classify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...default_state,
      cid: this.props.cid,
      sort: 'new',
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
      cid,
      sort,
      list,
      list_loading,
      list_end,
      list_page,
      list_time,
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
        Axios.post('https://api.tomatohut.cn/api/Shop/superClassifyList', {
          cid,
          sort,
          page: list_page,
          end_date_time_yongjin: list_time,
        })
          .then(res => {
            if (res.data.code === 200) {
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
  ChangeSort(sort) {
    this.setState(
      {
        ...default_state,
        sort,
      },
      () => this.GetData(),
    );
  }

  render() {
    const {sort, list, list_loading, list_end, list_error} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.sort}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sort_item}
            onPress={() => this.ChangeSort('new')}>
            <Text
              style={[
                styles.sort_item_text,
                sort === 'new' && {color: 'red', fontWeight: 'bold'},
              ]}>
              综合
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sort_item}
            onPress={() => this.ChangeSort('date_time')}>
            <Text
              style={[
                styles.sort_item_text,
                sort === 'date_time' && {color: 'red', fontWeight: 'bold'},
              ]}>
              最新
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sort_item}
            onPress={() => this.ChangeSort('total_sale_num_desc')}>
            <Text
              style={[
                styles.sort_item_text,
                sort === 'total_sale_num_desc' && {
                  color: 'red',
                  fontWeight: 'bold',
                },
              ]}>
              销量
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sort_item}
            onPress={() => {
              if (sort === 'price_desc') {
                this.ChangeSort('price_asc');
              } else if (sort === 'price_asc') {
                this.ChangeSort('price_desc');
              } else {
                this.ChangeSort('price_asc');
              }
            }}>
            <Text
              style={[
                styles.sort_item_text,
                (sort === 'price_asc' || sort === 'price_desc') && {
                  color: 'red',
                  fontWeight: 'bold',
                },
              ]}>
              价格
            </Text>
            {sort === 'price_asc' ? (
              <Icon name={'arrow-up'} size={'xxs'} color={'red'} />
            ) : sort === 'price_desc' ? (
              <Icon name={'arrow-down'} size={'xxs'} color={'red'} />
            ) : null}
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={item => item.tao_id}
          data={list}
          numColumns={2}
          refreshControl={
            <SmartRefreshControl
              ref={ref => (this.rc = ref)}
              renderHeader={<DefaultHeader />}
              onRefresh={() =>
                this.setState(default_state, () => this.GetData())
              }
            />
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => !list_end && !list_error && this.GetData()}
          removeClippedSubviews
          renderItem={item => <ShopCard item={item} />}
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
  container: {flex: 1, backgroundColor: '#F4F4F4'},
  sort: {
    zIndex: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  sort_item: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sort_item_text: {
    color: '#000',
  },
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
