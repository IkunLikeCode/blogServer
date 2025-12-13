import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
// 访问控制 Guard：基于环境变量白名单限制接口访问

// 将逗号分隔的字符串解析为去空白的字符串数组
function parseList(s?: string): string[] {
  return (s ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

// 判断传入值是否命中白名单，支持后缀通配（如 *.example.com）
function matchValue(value: string, allowed: string[]): boolean {
  const v = value.toLowerCase();
  return allowed.some((a) => {
    const t = a.toLowerCase();
    if (t.startsWith('*.')) {
      return v.endsWith(t.slice(2));
    }
    return v === t;
  });
}

@Injectable()
export class AccessGuard implements CanActivate {
  // 域名来源白名单（浏览器 Origin）
  private readonly allowedOrigins = parseList(process.env.ALLOWED_ORIGINS);
  // Host 白名单（非浏览器或代理透传的主机名）
  private readonly allowedHosts = parseList(process.env.ALLOWED_HOSTS);
  // IP 白名单（直接按请求 IP 比较）
  private readonly allowedIps = parseList(process.env.ALLOWED_IPS);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const origin = (req.headers.origin as string) || '';
    const host = (req.headers.host as string) || '';
    const ip = (req.ip as string) || '';

    const allowAnyOrigin = this.allowedOrigins.includes('*');
    const allowAnyHost = this.allowedHosts.includes('*');
    const allowAnyIp = this.allowedIps.includes('*');
    if (allowAnyOrigin || allowAnyHost || allowAnyIp) return true;

    // 若未配置任一白名单，直接拒绝（避免默认放行）
    const hasRules =
      this.allowedOrigins.length ||
      this.allowedHosts.length ||
      this.allowedIps.length;
    if (!hasRules) throw new ForbiddenException('Access denied');

    // 只要命中任意一种白名单即放行
    if (origin && matchValue(origin, this.allowedOrigins)) return true;
    if (host && matchValue(host, this.allowedHosts)) return true;
    if (ip && this.allowedIps.includes(ip)) return true;

    // 未命中白名单，拒绝访问
    throw new ForbiddenException('Access denied');
  }
}
