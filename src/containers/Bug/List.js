/**
 * 漏洞单列表
 * @author Jim
 * @date 2019/12/19
 * @update 2019/12/19
 */
import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator} from '@ant-design/react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import Axios from 'axios';
import ShopCard from '../../components/ShopCard';
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
      list_cid: this.props.cid,
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
      list_cid,
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
        Axios.post('https://api.tomatohut.cn/api/Shop/louDongDan', {
          cid: list_cid,
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

  render() {
    const {list, list_loading, list_end, list_error} = this.state;
    return (
      <FlatList
        refreshControl={
          <SmartRefreshControl
            ref={ref => (this.rc = ref)}
            renderHeader={<DefaultHeader />}
            onRefresh={() => this.setState(default_state, () => this.GetData())}
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
    );
  }
}

const styles = StyleSheet.create({
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
