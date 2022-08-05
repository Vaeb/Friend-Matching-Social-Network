import { baseApiUrl, defaultAvatarUrl } from '../defaults';

export const avatarUrl = (user, fallback = false) => user ? `${baseApiUrl}/img/avatar-${user.id}.png` : defaultAvatarUrl;
