/**
 * 设备基础信息
 * @author Jim
 * @date 2020/01/12
 * @update 2020/01/12
 */
import {Dimensions, StatusBar} from 'react-native';

// 设备宽高
const {width, height} = Dimensions.get('window');
// 设备状态栏高度
const StatusBarHeight = StatusBar.currentHeight;
export {width, height, StatusBarHeight};
