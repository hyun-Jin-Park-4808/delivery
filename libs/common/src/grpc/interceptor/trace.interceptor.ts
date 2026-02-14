import { InterceptingCall } from '@grpc/grpc-js';

export const traceInterceptor = (service: string) => (options, nextCall) => {
  return new InterceptingCall(nextCall(options), {
    start: function (metadata, listener, next) {
      metadata.set('client-service', service); // metadata에 서비스명 넣어주는 인터셉터
      next(metadata, listener);
    },
  });
};
