/**
 * 商品详情
 * @author Jim
 * @date 2019/12/13
 */
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Carousel, Icon, Toast} from '@ant-design/react-native';
import Axios from 'axios';
import Navigation from '../../utils/Navigation';
import LottieView from 'lottie-react-native';
import EImage from '../../components/EImage';
import Taobao from '../../utils/Taobao';

const {width, height} = Dimensions.get('window');

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      desc: [],
      seller: {},
    };
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 获取数据
   */
  GetData() {
    const {id} = this.props.navigation.state.params;
    Axios.all([
      Axios.get(
        `http://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?jsv=2.4.11&appKey=12574478&t=1538180732308&sign=e93a97b7e9a9a459297f4e689051c895&api=mtop.taobao.detail.getdesc&v=6.0&data={%22id%22%3A%22${id}%22%2C%22type%22%3A%220%22%2C%22f%22%3A%22TB1AsvbfnqWBKNjSZFx8qwpLpla%22}`,
      ),
      Axios.get(
        `https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data={%22itemNumId%22%3A%22${id}%22}`,
      ),
      Axios.post('https://api.tomatohut.cn/api/Shop/gaoyong', {
        id,
      }),
    ])
      .then(
        Axios.spread((desc, detail, gaoyong) => {
          if (gaoyong.data.code !== 200) {
            Toast.offline(gaoyong.data.msg, 3, undefined, false);
            Navigation.pop();
            return;
          }
          /**
           * 处理详情图片
           */
          let descPic = [];

          for (let v of desc.data.data.wdescContent.pages) {
            let uri = v.replace(/<(.*?)>/gi, '');
            if (uri.substring(0, 2) == '//') {
              uri = `https:${uri}`;
            } else if (uri.substring(0, 4) !== 'http') {
              uri = `https://${uri}`;
            }
            if (
              uri.substring(uri.length - 3, uri.length) === 'jpg' ||
              uri.substring(uri.length - 3, uri.length) === 'png'
            ) {
              descPic.push(uri);
            }
          }
          this.setState({
            data: gaoyong.data.data,
            desc: descPic,
            seller: detail.data.data.seller,
            loading: false,
          });
        }),
      )
      .catch(() => {
        Toast.offline('网络错误', 3, undefined, false);
        Navigation.pop();
      });
  }

  render() {
    const {data, desc, seller, loading} = this.state;
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
      <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
        {/*返回按钮*/}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.back_button}
          onPress={() => Navigation.pop()}>
          <Icon name={'arrow-left'} color={'#fff'} />
        </TouchableOpacity>
        <ScrollView removeClippedSubviews>
          <Carousel>
            {data.small_images &&
              [data.pict_url]
                .concat(data.small_images.split('|'))
                .map((item, index) => {
                  return (
                    <Image
                      key={index}
                      source={{uri: item}}
                      style={{width, height: width}}
                    />
                  );
                })}
          </Carousel>
          <View style={styles.body_header}>
            <View style={styles.body_title}>
              <View style={styles.body_icon}>
                <Text style={styles.body_icon_text}>
                  {data.detail.user_type === 0 ? '淘宝' : '天猫'}
                </Text>
              </View>
              <Text style={styles.body_title_text}>
                &emsp;&emsp;&nbsp;&nbsp;{data.detail.title}
              </Text>
            </View>
            <View style={styles.body_price}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.body_price_icon}>
                  <Text style={styles.body_price_icon_text}>券后价</Text>
                </View>
                <Text
                  style={{color: '#FE1E1F', fontSize: 18, fontWeight: 'bold'}}>
                  <Text style={{fontSize: 12}}>￥</Text>
                  <Text>{data.detail.quanhou_jiage}</Text>
                </Text>
              </View>
              <Text style={{color: '#989898', fontSize: 12}}>
                月销{data.detail.volume}笔
              </Text>
              <Text
                style={{
                  color: '#989898',
                  fontSize: 12,
                  textDecorationLine: 'line-through',
                }}>
                ￥{data.detail.size}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => Taobao.GoDetail(data.coupon_click_url)}>
              <ImageBackground
                style={styles.body_header_quan}
                source={require('../../images/detail-quan.png')}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    <Text style={{fontSize: 28}}>
                      {parseInt(data.detail.coupon_info_money)}
                    </Text>
                    元优惠券
                  </Text>
                  <Text style={{fontSize: 12, color: '#fff'}}>
                    使用期间：{data.detail.coupon_start_time} -{' '}
                    {data.detail.coupon_end_time}
                  </Text>
                </View>
                <View style={{flex: 1}} />
              </ImageBackground>
            </TouchableOpacity>
          </View>
          {data.jianjie && (
            <View style={styles.body_tui}>
              <View style={styles.body_tui_icon}>
                <Text style={styles.body_tui_icon_text}>推荐语</Text>
              </View>
              <Text style={styles.body_tui_text}>
                &emsp;&emsp;&emsp;&emsp;&emsp;{data.detail.jianjie}
              </Text>
            </View>
          )}
          <View style={styles.body_shop}>
            <Image
              style={styles.body_shop_icon}
              source={
                seller.shopIcon
                  ? {uri: `https:${seller.shopIcon}`}
                  : require('../../images/tb.jpg')
              }
            />
            <View style={styles.body_shop_right}>
              <Text>{seller.sellerNick}</Text>
              <Text style={{fontSize: 12, color: '#666666'}}>
                宝贝描述:{seller.evaluates[0].score}
                {seller.evaluates[0].levelText}
                &emsp;卖家服务:{seller.evaluates[1].score}
                {seller.evaluates[1].levelText}
                &emsp;物流服务:{seller.evaluates[2].score}
                {seller.evaluates[2].levelText}
              </Text>
            </View>
          </View>
          <View style={styles.body_detail}>
            <View style={styles.body_detail_title}>
              <Text style={styles.body_detail_title_text}>宝贝详情</Text>
            </View>
            {/*{desc ? (*/}
            {/*  <FlatList*/}
            {/*    removeClippedSubviews*/}
            {/*    data={desc}*/}
            {/*    renderItem={({item, index}) => (*/}
            {/*      <EImage key={index} source={item} />*/}
            {/*    )}*/}
            {/*  />*/}
            {/*) : (*/}
            {/*  <FlatList*/}
            {/*    removeClippedSubviews*/}
            {/*    data={data.detail.small_images.split('|')}*/}
            {/*    renderItem={({item, index}) => (*/}
            {/*      <EImage key={index} source={item} />*/}
            {/*    )}*/}
            {/*  />*/}
            {/*)}*/}
          </View>
          {desc.map((item, index) => (
            <EImage key={index} source={item} />
          ))}
        </ScrollView>
        <View style={styles.footer}>
          {/*<TouchableOpacity activeOpacity={1} style={styles.footer_button1}>*/}
          {/*  <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>*/}
          {/*    下单赚*/}
          {/*  </Text>*/}
          {/*  <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>*/}
          {/*    ￥{(data.detail.tkfee3 * 0.5).toFixed(2)}*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.footer_button2}
            onPress={() => Taobao.GoDetail(data.coupon_click_url)}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
              购买省
            </Text>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
              ￥{data.detail.coupon_info_money}
              {/*{parseFloat(*/}
              {/*  parseFloat((data.detail.tkfee3 * 0.5).toFixed(2)) +*/}
              {/*    parseFloat(*/}
              {/*      parseFloat(data.detail.coupon_info_money).toFixed(2),*/}
              {/*    ),*/}
              {/*).toFixed(2)}*/}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  back_button: {
    zIndex: 10,
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  body_header: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  body_icon: {
    position: 'absolute',
    top: 6,
    backgroundColor: 'red',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  body_icon_text: {
    color: '#fff',
  },
  body_title: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  body_title_text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  body_price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  body_price_icon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9003',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  body_price_icon_text: {
    color: '#fff',
    fontSize: 12,
  },
  body_tui: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 2,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  body_tui_icon: {
    position: 'absolute',
    top: 6,
    left: 15,
    backgroundColor: '#F7DBD8',
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  body_tui_icon_text: {
    color: 'red',
    fontSize: 14,
  },
  body_tui_text: {
    color: '#B1B1B1',
    // fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
  },
  body_shop: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 2,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  body_shop_icon: {
    height: 65,
    width: 65,
    borderRadius: 5,
  },
  body_detail: {
    backgroundColor: '#fff',
    marginTop: 2,
  },
  body_detail_title: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body_detail_title_text: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body_shop_right: {
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  body_header_quan: {
    flexDirection: 'row',
    width: width - 30,
    height: (196 / 1026) * (width - 30),
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
  },
  footer_button1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEA00C',
    marginLeft: 10,
    marginVertical: 5,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  footer_button2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD2F1B',
    // marginRight: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 5,
    // borderTopRightRadius: 10,
    // borderBottomRightRadius: 10,
    borderRadius: 10,
  },
});
