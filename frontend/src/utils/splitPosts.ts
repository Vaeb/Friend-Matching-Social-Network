import { GetPostsWeightedQuery } from '../generated/graphql';

export type FullPost = GetPostsWeightedQuery['getPostsWeighted']['posts'][0];

export type SplitPosts = {
    pPosts: FullPost[];
    sPosts: FullPost[];
};

export const splitPosts = (posts: FullPost[]): SplitPosts => {
    const pPosts: FullPost[] = [];
    const sPosts: FullPost[] = [];

    for (const post of posts) {
        if (post.studentsOnly) {
            sPosts.push(post);
        } else {
            pPosts.push(post);
        }
    }

    const groups: SplitPosts = { pPosts, sPosts };

    return groups;
};
