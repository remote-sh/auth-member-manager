import { Env, EnvSchema } from 'src/schemas/env.schema';

const parseBoolean = (value: string | undefined): boolean => {
  if (value === 'true' || value === '1' || value === 'yes' || value === 'on') {
    return true;
  }
  if (value === 'false' || value === '0' || value === 'no' || value === 'off') {
    return false;
  }
  throw new Error('Invalid boolean value');
};

export function validate(raw: Record<string, unknown>): Env {
  const config: Env = {
    nodeEnv: raw.NODE_ENV as Env['nodeEnv'],
    port: parseInt(raw.PORT as string) as Env['port'],
    database: {
      url: raw.DATABASE_URL as Env['database']['url'],
    },
    gateway: {
      secret: raw.GATEWAY_SECRET as Env['gateway']['secret'],
    },
    services: {
      cloud: {
        status: parseBoolean(
          raw.CLOUD_SERVICE_STATUS as string,
        ) as Env['services']['cloud']['status'],
        api: {
          url: raw.CLOUD_SERVICE_API_URL as Env['services']['cloud']['api']['url'],
        },
      },
    },
  };

  const result = EnvSchema.safeParse(config);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}
