import { z } from 'zod';

export const EnvSchema = z.object({
  nodeEnv: z.string().default('development'),
  port: z.number().default(3000),
  gateway: z.object({
    secret: z.string(),
  }),
  database: z.object({
    url: z.string(),
  }),
  services: z.object({
    cloud: z.object({
      status: z.boolean().default(true),
      api: z.object({
        url: z.string(),
      }),
    }),
  }),
});

export type Env = z.infer<typeof EnvSchema>;
