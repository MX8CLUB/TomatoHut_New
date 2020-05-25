/**
 * 主页精选
 * @author Jim
 * @date 2019/12/11
 * @update 2020/01/10
 */
import React, {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DefaultHeader,
  SmartRefreshControl,
} from 'react-native-smartrefreshlayout';
import Axios from 'axios';
import {ActivityIndicator, Carousel, Toast} from '@ant-design/react-native';
import ShopCard from '../../components/ShopCard';
import Taobao from '../../utils/Taobao';
import Navigation from '../../utils/Navigation';
import {formatDate} from '../../utils/FormatDate';

const {width, height} = Dimensions.get('window');

// 初始化state
const default_state = {
  list: [],
  list_time: formatDate(new Date()),
  list_page: 1,
  list_loading: false,
  list_error: false,
  list_end: false,
};

export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...default_state,
      carousel: [],
    };
  }

  componentDidMount() {
    this.GetData();
    this.GetCarousel();
  }

  /**
   * 获取数据
   */
  GetData() {
    const {list, list_loading, list_end, list_page, list_time} = this.state;
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
          `https://api.zhetaoke.com:10001/api/api_all.ashx?appkey=e2d693cb18694355a5c227d3d0476823&sort=new&sale_num_start=500&page=${list_page}&end_date_time_yongjin=${list_time}`,
        ).then(res => {
          if (res.data.status === 200) {
            this.setState({
              list_loading: false,
              list:
                list_page === 1
                  ? res.data.content
                  : list.concat(res.data.content),
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

  GetCarousel() {
    Axios.get('https://api.tomatohut.cn/api/Shop/carousel').then(res => {
      this.setState({
        carousel: res.data.data,
      });
    });
  }

  render() {
    const {carousel, list, list_loading, list_end, list_error} = this.state;
    return (
      <ScrollView
        refreshControl={
          <SmartRefreshControl
            ref={ref => (this.rc = ref)}
            renderHeader={<DefaultHeader />}
            onRefresh={() => this.setState(default_state, () => this.GetData())}
          />
        }
        onScroll={e => {
          let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
          let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
          let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
          if (offsetY + oriageScrollHeight + 100 >= contentSizeHeight) {
            // 滑动到底部
            if (list_end || list_error) {
              return;
            }
            this.GetData();
            this.GetCarousel();
          }
        }}
        removeClippedSubviews
        style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E94F62',
            height: 180,
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: '#fff',
              width,
              height: 100,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          />
          <View style={styles.swiper_container}>
            {carousel ? (
              <Carousel
                style={styles.swiper_body}
                autoplay
                infinite
                autoplayInterval={5000}>
                {carousel.map((item, index) => {
                  switch (item.carousel_type) {
                    case 1: {
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={1}
                          onPress={() => {
                            Taobao.GoDetail(item.carousel_url);
                          }}>
                          <Image
                            style={styles.swiper_image}
                            source={{uri: item.carousel_pic}}
                          />
                        </TouchableOpacity>
                      );
                    }
                  }
                })}
              </Carousel>
            ) : null}
          </View>
        </View>
        <View style={styles.button_list}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('FreeShippingIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-9.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              9.9包邮
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('TmallIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-2.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              天猫超市
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('BugIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-1.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              漏洞单
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('RemoteFreeShippingIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-4.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              偏远地区包邮
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('PinpaiIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-3.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              品牌券
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => this.props.tab.tab.goToPage(3)}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-6.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              天猫美妆
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('FastBuyIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-7.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              咚咚抢
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('JuhuasuanIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-8.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              聚划算
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Navigation.navigate('TalentIndex')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-5.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              达人说
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_list_item}
            onPress={() => Taobao.GoDetail('https://try.taobao.com/')}>
            <Image
              style={styles.button_list_item_image}
              source={require('../../images/main-button-10.png')}
            />
            <Text style={styles.button_list_item_text} numberOfLines={1}>
              U先试用
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={1}>
          <Image
            resizeMode={'contain'}
            resizeMethod={'resize'}
            style={{width, height: (364 / 1078) * width, marginTop: 20}}
            source={require('../../images/banner-1.png')}
          />
        </TouchableOpacity>
        <View style={styles.banner}>
          {/*实时榜单*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Navigation.navigate('ShishiIndex')}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item1_image}
              source={require('../../images/banner-2.png')}
            />
          </TouchableOpacity>
          {/*好货推荐*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Navigation.navigate('FastBuyIndex')}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item1_image}
              source={require('../../images/banner-3.png')}
            />
          </TouchableOpacity>
          {/*母婴合集*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.tab.tab.goToPage(2)}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item1_image}
              source={require('../../images/banner-4.png')}
            />
          </TouchableOpacity>
          {/*九块九*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Navigation.navigate('FreeShippingIndex')}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item1_image}
              source={require('../../images/banner-5.png')}
            />
          </TouchableOpacity>
          {/*美妆个护*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.tab.tab.goToPage(3)}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item2_image}
              source={require('../../images/banner-6.png')}
            />
          </TouchableOpacity>
          {/*精品箱包*/}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.tab.tab.goToPage(11)}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item2_image}
              source={require('../../images/banner-7.png')}
            />
          </TouchableOpacity>
          {/*精选单品*/}
          <TouchableOpacity activeOpacity={1}>
            <Image
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.banner_item2_image}
              source={require('../../images/banner-8.png')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={list}
          numColumns={2}
          keyExtractor={item => item.tao_id}
          ListHeaderComponent={
            <Image
              source={require('../../images/main-list-title.png')}
              style={{width, height: (110 / 1080) * width}}
            />
          }
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  carousel: {
    width,
    height: (245 / 600) * width,
  },
  button_list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  button_list_item: {
    width: (width - 30) / 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button_list_item_image: {
    width: (width - 30) / 5 - 30,
    height: (width - 30) / 5 - 30,
  },
  button_list_item_text: {
    fontSize: 12,
    color: '#000',
    marginVertical: 5,
  },
  swiper_container: {
    borderRadius: 10,
    height: (245 / 600) * (width - 30),
    width: width - 30,
  },
  swiper_body: {
    borderRadius: 10,
    // width: width - 30,
  },
  swiper_image: {
    borderRadius: 10,
    width: width - 30,
    height: (245 / 600) * (width - 30),
  },
  banner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#F55C6E',
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  banner_item1_image: {
    width: (width - 45) / 2,
    height: (280 / 490) * ((width - 45) / 2),
    marginTop: 10,
  },
  banner_item2_image: {
    width: (width - 45) / 3,
    height: (394 / 306) * ((width - 45) / 3),
    marginTop: 10,
  },
  list_footer: {
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
  },
});
