import { baseApiUrl } from '../defaults';

export const avatarUrl = user => `${baseApiUrl}/img/avatar-${user.id}.png`;
