import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpInterceptor } from './interceptors/http.interceptor';
import { NestInterceptor } from '@nestjs/common';
import { AccessGuard } from './guards/access.guard';
import { HttpExceptionFilter } from './filters/http.exception';
import { AllExceptionFilter } from './filters/all.exception';
import { existsSync, readFileSync } from 'node:fs';

if (existsSync('.env')) {
  const content = readFileSync('.env', 'utf8');
  content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .forEach((l) => {
      const i = l.indexOf('=');
      if (i > 0) {
        const k = l.slice(0, i).trim();
        const v = l.slice(i + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局拦截器：统一成功响应结构
  app.useGlobalInterceptors(new HttpInterceptor() as NestInterceptor);
  // 全局异常过滤器：HttpException 与非 HttpException 分别处理
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter());
  // CORS：仅允许 ALLOWED_ORIGINS 白名单来源，支持 *.example.com 通配后缀
  const allowed = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  const allowAny = allowed.includes('*');
  app.enableCors({
    origin: (origin, callback) => {
      // 若配置为 * 则放行所有来源（便于调试）
      if (allowAny) return callback(null, true);
      // 无 Origin（同源导航、服务器到服务器、部分代理场景）应放行
      if (!origin) return callback(null, true);
      // 白名单为空时拦截（要求明确配置）
      if (!allowed.length) return callback(new Error('Blocked by CORS'), false);
      const o = origin.toLowerCase();
      const ok = allowed.some((a) => {
        const t = a.toLowerCase();
        if (t.startsWith('*.')) return o.endsWith(t.slice(2));
        return o === t;
      });
      callback(ok ? null : new Error('Blocked by CORS'), ok);
    },
    credentials: true,
  });
  app.setGlobalPrefix('blog');
  // 全局 Guard：非浏览器来源或兜底二次校验（Origin/Host/IP）
  app.useGlobalGuards(new AccessGuard());

  await app.listen(process.env.PORT ?? 5050);
}
bootstrap();
