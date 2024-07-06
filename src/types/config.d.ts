import { tags } from 'typia';

export interface IConfig {
  nodeEnv: string & tags.Enum<'development' | 'production' | 'test'>;
  port: number;
  gateway: IGatewayConfig;
  db: IDBConfig;
  status: IStatusConfig;
}

export interface IGatewayConfig {
  secret: string;
}

export interface IDBConfig {
  url: string;
}

export interface IStatusConfig {
  profile: IProfileStatus;
}

export interface IProfileStatus {
  read: boolean;
  update: boolean;
  delete: boolean;
}
