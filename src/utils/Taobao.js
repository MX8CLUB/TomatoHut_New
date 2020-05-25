import RNAlibcSdk from 'react-native-alibaichuan';
import TbParams from './TbParams';

/**
 * 跳转二合一领券地址
 * @constructor
 */
function GoDetail(url) {
  RNAlibcSdk.show(
    {
      type: 'url',
      payload: TbParams({
        url: url,
      }),
    },
    (err, info) => {},
  );
}

export default {
  GoDetail,
};
