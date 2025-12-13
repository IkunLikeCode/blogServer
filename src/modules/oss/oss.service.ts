import { Injectable } from '@nestjs/common';
import { TosClient } from '@volcengine/tos-sdk';
@Injectable()
export class OssService {
  readonly OssClient: TosClient;
  constructor() {
    const accessKeyId = process.env.TOS_ACCESS_KEY;
    const accessKeySecret = process.env.TOS_SECRET_KEY;

    if (!accessKeyId || !accessKeySecret) {
      throw new Error('缺少key值');
    }
    this.OssClient = new TosClient({
      region: 'cn-beijing',
      endpoint: 'tos-cn-beijing.volces.com',
      accessKeyId: accessKeyId || '',
      accessKeySecret: accessKeySecret || '',
      connectionTimeout: 10000,
      requestTimeout: 10000,
    });
  }
}
