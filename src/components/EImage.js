/**
 * 网络图片自适应
 * @author Jim
 * @date 2019/12/13
 * @update 2020/02/04
 */
import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {width} from '../global/Device';

export default class EImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width || width,
      height: this.props.height || width,
      error: false,
    };
  }

  componentDidMount() {
    Image.getSize(this.props.source, (Ewidth, Eheight) => {
      this.setState({
        width: width,
        height: (width / Ewidth) * Eheight,
      });
    });
  }

  render() {
    if (this.state.error) {
      return null;
    }
    return (
      <Image
        style={{
          width: this.state.widget,
          height: this.state.height,
        }}
        source={{uri: this.props.source}}
        onError={() => {
          this.setState({
            error: true,
          });
        }}
      />
    );
  }
}
