import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// 全局异常过滤器：捕获所有未被 HttpExceptionFilter 处理的异常，并统一输出结构化响应

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // 默认状态码与消息
    let status = 500;
    let message = 'Internal Server Error';
    if (exception instanceof HttpException) {
      // 标准 HttpException 直接读取状态码与消息
      status = exception.getStatus();
      message = exception.message;
    } else if (typeof exception?.message === 'string') {
      // 非 HttpException 的错误，尽力从 message 推断
      message = exception.message;
      if (message.toLowerCase().includes('cors')) {
        // CORS 拦截统一返回 403，便于前后端排查
        status = 403;
      }
    }
    // 统一响应结构，保持与项目其余部分一致
    response.status(status).json({
      code: status,
      message,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
