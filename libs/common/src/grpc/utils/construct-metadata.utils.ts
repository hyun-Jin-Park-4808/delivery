import { Metadata } from '@grpc/grpc-js';
import { v4 } from 'uuid';

export const constructMetadata = (
  callerClass: string,
  callerMethod: string,
  prevMetadata?: Metadata,
) => {
  const metadata = prevMetadata ?? new Metadata();
  const traceId = metadata.getMap()['trace-id'] ?? v4(); // 전달받은 metadata에 trace-id가 없으면 새로 생성
  metadata.set('trace-id', traceId.toString());
  metadata.set('caller-class', callerClass);
  metadata.set('client-method', callerMethod);
  return metadata;
};
