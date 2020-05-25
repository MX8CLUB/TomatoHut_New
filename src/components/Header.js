/**
 * 头部组件
 * @author Jim
 * @date 2020/01/09
 * @update 2020/01/14
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import Navigation from '../utils/Navigation';
import {Icon} from '@ant-design/react-native';
import {StatusBarHeight} from '../global/Device';

const Header = ({
  left,
  title,
  search,
  barStyle,
  backgroundColor,
  StatusBarColor,
  backColor,
  titleColor,
}) => {
  return (
    <View style={[styles.header, backgroundColor && {backgroundColor}]}>
      <StatusBar
        barStyle={barStyle || 'dark-content'}
        translucent={true}
        backgroundColor={StatusBarColor || 'rgba(0,0,0,0)'}
      />
      {left ? (
        left
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.header_back}
          onPress={() => Navigation.pop()}>
          <Icon name={'arrow-left'} color={backColor || '#999999'} />
        </TouchableOpacity>
      )}
      <Text
        style={[styles.header_body_text, {color: titleColor}]}
        numberOfLines={1}>
        {title}
      </Text>
      {search ? (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.header_search}
          onPress={() => Navigation.navigate('SearchIndex')}>
          <Image
            source={require('../images/search_icon.png')}
            style={styles.header_search_icon}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    height: 36 + StatusBarHeight + 10,
    flexDirection: 'row',
    paddingTop: StatusBarHeight + 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    zIndex: 10000,
  },
  header_back: {
    marginLeft: 15,
    marginRight: 5,
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
});

export default Header;
