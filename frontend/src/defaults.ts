export const baseSiteUrl = process.env.NEXT_PUBLIC_ENV === 'PROD' ? 'http://vaeb.io:3000' : 'http://localhost:3000';
export const baseApiUrl = process.env.NEXT_PUBLIC_ENV === 'PROD' ? 'http://vaeb.io:4000' : 'http://localhost:4000';

export const graphqlUrl = `${baseApiUrl}/graphql`;
export const wsUrl = graphqlUrl.replace(/^\w+/, 'ws');

export const defaultAvatarUrl = `${baseApiUrl}/img/Icon-User-2.png`;
// export const defaultAvatarUrl = `${baseApiUrl}/img/Example1.jpg`;
