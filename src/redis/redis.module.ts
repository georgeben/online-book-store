import { Module, OnApplicationShutdown } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS } from './redis.constants';
import { ModuleRef } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: REDIS,
      useFactory: async (configService: ConfigService) => {
        const client = Redis.createClient({
          url: configService.get<string>('REDIS_URL'),
        });
        await client.connect();
        client.on('ready', () =>
          console.log('Successfully connected to redis'),
        );
        return client;
      },
    },
  ],
  exports: [REDIS],
})

/**
 * Handle graceful shutdown
 */
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    console.log(`Shutting down: ${signal}`);
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(REDIS);
      redis.quit();
      redis.on('end', () => {
        console.log('Successfully disconnected from redis');
        resolve();
      });
    });
  }
}
