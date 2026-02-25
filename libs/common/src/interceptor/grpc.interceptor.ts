import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class GrpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToRpc().getData();
    const ctx = context.switchToRpc().getContext();
    const meta = ctx.getMap(); // gRpc Metadata에 넣은 데이터를 map 형태로 반환

    const targetClass = context.getClass().name; // 내가 요청 받은 클래스, 이 인터셉터가 실행된 클래스
    const targetHandler = context.getHandler().name; // 내가 요청 받은 메서드

    const traceId = meta['trace-id'];
    const clientService = meta['client-service'];
    const clientClass = meta['client-class'];
    const clientMethod = meta['client-method'];

    const from = `${clientService}/${clientClass}/${clientMethod}`;
    const to = `${targetClass}/${targetHandler}`;

    const requestTimestamp = new Date();

    const receivedRequestLog = {
      type: 'RECEIVED_REQUEST',
      traceId,
      from,
      to,
      data,
      timestamp: requestTimestamp.toUTCString(),
    };

    console.log(JSON.stringify(receivedRequestLog));

    return next.handle().pipe(
      map((data) => {
        const responseTimestamp = new Date();
        const responseTime = `${+responseTimestamp - +requestTimestamp}ms`;
        const responseLog = {
          type: 'RESPONSE',
          traceId,
          from,
          to,
          data,
          responseTime,
          timestamp: responseTimestamp.toUTCString(),
        };
        console.log(JSON.stringify(responseLog));
        return data;
      }),
    );
  }
}
