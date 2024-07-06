import { Logger } from '@nestjs/common';
import { IConfig } from 'src/types/config';
import { validateConfig } from 'src/validates/config.validate';

const isTrue = (
  value: string | undefined,
  defaultValue: boolean = true,
): boolean => {
  if (value === 'true' || value === '1' || value === 'yes' || value === 'on')
    return true;
  if (value === 'false' || value === '0' || value === 'no' || value === 'off')
    return false;
  if (value === undefined) return defaultValue;
  throw new Error('Invalid boolean value');
};

const logger = new Logger();

export function validate(raw: Record<string, unknown>) {
  const config: IConfig = {
    nodeEnv: (raw.NODE_ENV as string) || 'development',
    port: parseInt(raw.PORT as string) || 3000,
    gateway: {
      secret: raw.GATEWAY_SECRET as string,
    },
    db: {
      url: raw.DATABASE_URL as string,
    },
    status: {
      profile: {
        read: isTrue(raw.STATUS_PROFILE_READ as string),
        update: isTrue(raw.STATUS_PROFILE_UPDATE as string),
        delete: isTrue(raw.STATUS_PROFILE_DELETE as string, false),
      },
    },
  };
  const result = validateConfig(config);
  if (result.success) {
    return config;
  }
  const errorPath = result.errors.map((error) => error.path).join(', ');
  logger.error(`Validation failed for ${errorPath}`);
  throw new Error('Config validation failed');
}
