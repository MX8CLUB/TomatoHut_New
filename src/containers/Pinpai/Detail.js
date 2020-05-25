/**
 * 品牌详情
 * @author Jim
 * @date 2020/02/03
 * @update 2020/02/03
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import Axios from 'axios';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import Navigation from '../../utils/Navigation';
import {ActivityIndicator} from '@ant-design/react-native';
import ShopCard from '../../components/ShopCard';
import EImage from '../../components/EImage';

const default_state = {
  data: {},
  list: [],
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};
export default class Detail extends Component {
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
    const {
      data,
      list,
      list_page,
      list_loading,
      list_error,
      list_end,
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
          `http://v2.api.haodanku.com/singlebrand/apikey/mxclub/id/${id}/min_id/${list_page}`,
        ).then(res => {
          if (res.data.data.items.length !== 0) {
            this.setState({
              list_loading: false,
              data: list_page === 1 ? res.data.data : data,
              list:
                list_page === 1
                  ? res.data.data.items
                  : list.concat(res.data.data.items),
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

  /**
   * 渲染头部
   * @private
   */
  _renderHeader() {
    const {data} = this.state;
    return (
      <View>
        {data.brand_logo ? <EImage source={data.brand_logo} /> : null}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 8,
            marginVertical: 8,
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 8,
          }}>
          <Text style={{textAlign: 'center', fontSize: 16}}>
            {data.tb_brand_name}
          </Text>
          <Text style={{color: '#666666'}}>&ensp;&ensp;{data.introduce}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {list, list_end, list_loading, list_error} = this.state;

    return (
      <View style={styles.container}>
        <Header title={'品牌详情'} />
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
          ListHeaderComponent={this._renderHeader()}
          onEndReached={() => !list_end && !list_error && this.GetData()}
          onEndReachedThreshold={0.2}
          data={list}
          numColumns={2}
          keyExtractor={(item, index) => String(index)}
          renderItem={item => {
            return (
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
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
