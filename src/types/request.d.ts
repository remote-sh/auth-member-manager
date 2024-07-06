import { Request } from 'express';
import { tags } from 'typia';

export interface IMemberRequestQuery {
  email: string & tags.Format<'email'>;
  userId: number & tags.Type<'uint32'>;
}

export interface IMemberRequest
  extends Request<any, any, any, IMemberRequestQuery> {}
