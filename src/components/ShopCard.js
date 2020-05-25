/**
 * 购物详情卡片
 * @author Jim
 * @date 2019/12/12
 * @update 2020/01/12
 */
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Navigation from '../utils/Navigation';
import {width} from '../global/Device';

export default class ShopCard extends PureComponent {
  render() {
    const {item, index} = this.props.item;
    const {style, imageStyle} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.list_item,
          {marginRight: (index + 1) % 2 ? 5 : null},
          style,
        ]}
        onPress={() => Navigation.navigate('DetailIndex', {id: item.tao_id})}>
        <Image
          style={[styles.list_item_image, imageStyle]}
          source={{
            uri: item.white_image ? item.white_image : item.pict_url,
          }}
        />
        <Text
          style={{
            position: 'absolute',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: '#FE1E1F',
            height: 24,
            lineHeight: 24,
            fontSize: 12,
            paddingHorizontal: 10,
            color: '#fff',
            top: (width - 5) / 2 - 70,
          }}>
          领券省{parseInt(item.coupon_info_money)}元
        </Text>
        <View>
          <Text style={styles.list_item_title} numberOfLines={2}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              marginVertical: 5,
            }}>
            <Text style={{color: '#666666', fontSize: 14}}>券后价</Text>
            <Text style={{fontSize: 14, color: 'red'}}>
              ￥
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {item.quanhou_jiage}
              </Text>
            </Text>
            <Text
              style={{
                color: '#666666',
                marginLeft: 5,
                fontSize: 12,
                textDecorationLine: 'line-through',
              }}>
              ￥{item.size}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  list_item: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: (width - 5) / 2,
    marginTop: 5,
  },
  list_item_image: {
    width: (width - 5) / 2,
    height: (width - 5) / 2,
  },
  list_item_title: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 14,
    height: 50,
  },
});
