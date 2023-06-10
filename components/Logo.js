import React from 'react';
import { Image } from 'react-native';

const Logo = () => {
  return (
    <Image
      source={require('../assets/logo.png')} // Thay đường dẫn bằng đường dẫn thực tế của ảnh logo
      style={{ width: 200, height: 200 }} // Cài đặt kích thước cho logo
    />
  );
};

export default Logo;
