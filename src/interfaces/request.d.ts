import { Request } from 'express';

export interface MemberRequest
  extends Request<
    any,
    any,
    any,
    {
      email: string;
      userId: number;
    }
  > {}
