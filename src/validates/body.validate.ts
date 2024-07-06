import { IUpdateMemberBody } from 'src/types/profile';
import { createValidate } from 'typia';

export const validateUpdateMemberBody = createValidate<IUpdateMemberBody>();
