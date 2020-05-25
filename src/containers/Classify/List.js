/**
 * 分类列表
 * @author Jim
 * @date 2019/12/19
 * @update 2019/12/19
 */
import React, {PureComponent} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Axios from 'axios';
import ShopCard from '../../components/ShopCard';
import {ActivityIndicator, Icon} from '@ant-design/react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import Navigation from '../../utils/Navigation';
import {StatusBarHeight} from '../../global/Device';
import {formatDate} from '../../utils/FormatDate';

const default_state = {
  list: [],
  list_time: formatDate(new Date()),
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...default_state,
      sort: 'new',
      cid: this.props.navigation.state.params.cid,
      q: this.props.navigation.state.params.q,
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
      cid,
      q,
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
          sort,
          cid,
          q,
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
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_back}
            onPress={() => Navigation.pop()}>
            <Icon name={'arrow-left'} color={'#999999'} />
          </TouchableOpacity>
          <Text style={styles.header_body_text} numberOfLines={1}>
            {this.props.navigation.state.params.q}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.header_search}
            onPress={() => Navigation.navigate('SearchIndex')}>
            <Image
              source={require('../../images/search_icon.png')}
              style={styles.header_search_icon}
            />
          </TouchableOpacity>
        </View>
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
          keyExtractor={item => item.tao_id}
          numColumns={2}
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
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    height: 36,
    flexDirection: 'row',
    marginTop: StatusBarHeight + 5,
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
  header_body_text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  header_search: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  header_search_icon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
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
