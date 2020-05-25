/**
 * 达人说
 * @author Jim
 * @date 2020/02/04
 * @update 2020/02/04
 */

import React, {Component} from 'react';
import {
  ScrollView,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import Carousel from 'react-native-snap-carousel';
import Axios from 'axios';
import {width} from '../../global/Device';
import Navigation from '../../utils/Navigation';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topdata: [],
      newdata: [],
      clickdata: [],
      sort: 0,
      talent_Category: ['全部', '好物', '潮流', '美食', '生活'],
    };
  }

  componentDidMount() {
    this.GetData();
  }

  /**
   * 获取数据
   */
  GetData() {
    const {sort, topdata, newdata, clickdata} = this.state;
    Axios.get(
      `http://v2.api.haodanku.com/talent_info/apikey/mxclub/talentcat/${sort}`,
    ).then(res => {
      this.setState({
        topdata: res.data.data.topdata,
        newdata: res.data.data.newdata,
        clickdata: res.data.data.clickdata,
      });
    });
  }

  /**
   * 头部渲染
   * @private
   */
  _topRender({item}) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.top}
        onPress={() => Navigation.navigate('TalentArticle', {id: item.id})}>
        <Image style={styles.top_image} source={{uri: item.app_image}} />
        <Text style={styles.top_text}>{item.shorttitle}</Text>
        <View style={styles.top_right}>
          <View style={{padding: 5}}>
            <Text style={[styles.top_right_text, {fontSize: 18}]}>
              {item.itemnum}
            </Text>
            <Text style={styles.top_right_text}>单品</Text>
          </View>
          <Image style={styles.top_right_image} source={{uri: item.image}} />
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * 本周新作渲染
   * @private
   */
  _newRender({item}) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.new}
        onPress={() => Navigation.navigate('TalentArticle', {id: item.id})}>
        <Image style={styles.new_image} source={{uri: item.article_banner}} />
        <Text style={{width: 150, paddingVertical: 10}} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image style={styles.new_head_img} source={{uri: item.head_img}} />
          <Text style={{paddingLeft: 8, fontSize: 12}}>{item.talent_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * 阅读渲染
   * @private
   */
  _clickRender({item}) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.click}
        onPress={() => Navigation.navigate('TalentArticle', {id: item.id})}>
        <Image style={styles.click_image} source={{uri: item.article_banner}} />
        <Text style={styles.click_title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.click_article} numberOfLines={2}>
          {item.article}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {sort, topdata, newdata, clickdata, talent_Category} = this.state;
    return (
      <>
        <Header
          title={'达人说'}
          backgroundColor={'#4B75FC'}
          backColor={'#fff'}
          titleColor={'#fff'}
        />
        <ScrollView style={styles.container}>
          <View style={styles.topBack} />
          <Carousel
            data={topdata}
            renderItem={this._topRender}
            sliderWidth={width}
            itemWidth={(4 * width) / 5}
          />
          <Text style={styles.title}>本周新作</Text>
          <FlatList
            style={{paddingLeft: 10}}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            data={newdata}
            renderItem={this._newRender}
          />
          <Text style={styles.title}>大家都在逛</Text>
          <ScrollView
            contentContainerStyle={{paddingHorizontal: 10}}
            horizontal>
            {talent_Category.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.category,
                    index === sort && styles.category_active,
                  ]}
                  onPress={() => this.setState({sort: index})}>
                  <Text
                    style={[
                      styles.category_text,
                      index === sort && styles.category_active_text,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <FlatList
            style={{paddingBottom: 15}}
            keyExtractor={item => item.id}
            data={
              sort
                ? clickdata.filter(item => item.talentcat === String(sort))
                : clickdata
            }
            renderItem={this._clickRender}
          />
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 30,
    marginBottom: 15,
  },
  topBack: {
    position: 'absolute',
    height: 140,
    width,
    backgroundColor: '#4B75FC',
  },
  top: {
    backgroundColor: '#fff',
    width: (4 * width) / 5,
    marginTop: 20,
    borderRadius: 8,
  },
  top_image: {
    width: (4 * width) / 5,
    height: ((306 / 750) * (4 * width)) / 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  top_text: {
    fontSize: 18,
    height: 60,
    lineHeight: 60,
    paddingHorizontal: 15,
  },
  top_right: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: 'rgba(255,255,255, .8)',
    padding: 5,
    borderRadius: 8,
  },
  top_right_image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  top_right_text: {
    color: '#4B75FC',
    textAlign: 'center',
    height: 24,
    lineHeight: 24,
  },
  new: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  new_image: {
    width: 150,
    height: 50,
  },
  new_head_img: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  category: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  category_active: {
    backgroundColor: '#4B75FC',
  },
  category_text: {
    color: '#000',
  },
  category_active_text: {
    color: '#fff',
  },
  click: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
  },
  click_image: {
    width: width - 50,
    height: (250 / 750) * (width - 50),
    borderRadius: 8,
  },
  click_title: {
    fontSize: 16,
    paddingVertical: 5,
  },
  click_article: {
    fontSize: 14,
    color: '#ccc',
  },
});
