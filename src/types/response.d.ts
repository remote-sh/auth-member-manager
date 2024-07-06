export interface IReplyData {
  message: string;
  data?: any;
}

export interface IResponseMemberData {
  email: string;
  imageUrl: string | null;
  nickname: string;
  joinDate: Date;
  updateDate: Date;
  provider: string;
}
