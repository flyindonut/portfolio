export interface Comment {
  commentId: string;
  commentStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  userStatus: 'GUEST' | 'VERIFIED';
  firstName: string;
  lastName: string;
  content: string;
  auth0UserId: string;
  auth0Avatar: string;
  createdAt: Date;
  updatedAt: Date;
}