// microservice에서는 webpack을 기본으로 사용하게 된다.
// devtool을 source-map으로 설정하면 빌드된 js 파일들과 ts 파일들의 위치를 연동시켜주고, 연동된 위치를 기반으로 에러 위치를 정확히 받을 수 있다.
module.exports = function (options) {
  return {
    ...options,
    devtool: 'source-map',
  };
};
