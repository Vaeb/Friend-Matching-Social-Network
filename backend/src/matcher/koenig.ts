// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import pool from 'typedarray-pool';
import iota from 'iota-array';
import bipartiteMatching from 'bipartite-matching';

const walk = (list, v, adjL, matchL, coverL, matchR, coverR) => {
    if (coverL[v] || matchL[v] >= 0) {
        return;
    }
    while (v >= 0) {
        coverL[v] = 1;
        const adj = adjL[v];
        let next = -1;
        for (let i = 0, l = adj.length; i < l; ++i) {
            const u = adj[i];
            if (coverR[u]) {
                continue;
            }
            next = u;
        }
        if (next < 0) {
            break;
        }
        coverR[next] = 1;
        list.push(next);
        v = matchR[next];
    }
};

const arrToTable = (arr) => arr.reduce((obj, pair) => {
    if (!obj[pair[0]]) obj[pair[0]] = {};
    obj[pair[0]][pair[1]] = 11111111;
    return obj;
}, {});

const bipartiteVertexCover = (n, m, edges) => {
    // console.log('bipartiteMatching data:', n, m);
    // console.table(arrToTable(edges));
    const match = bipartiteMatching(n, m, edges);
    // console.log('Bipartite match:');
    // console.table(arrToTable(match));

    // Initialize adjacency lists
    const adjL = new Array(n);
    const matchL = pool.mallocInt32(n);
    const matchCount = pool.mallocInt32(n);
    const coverL = pool.mallocInt32(n);
    for (let i = 0; i < n; ++i) {
        adjL[i] = [];
        matchL[i] = -1;
        matchCount[i] = 0;
        coverL[i] = 0;
    }
    const adjR = new Array(m);
    const matchR = pool.mallocInt32(m);
    const coverR = pool.mallocInt32(m);
    for (let i = 0; i < m; ++i) {
        adjR[i] = [];
        matchR[i] = -1;
        coverR[i] = 0;
    }

    // Unpack matching
    for (let i = 0, l = match.length; i < l; ++i) {
        const s = match[i][0];
        const t = match[i][1];
        matchL[s] = t;
        matchR[t] = s;
    }

    // Loop over edges
    for (let i = 0, l = edges.length; i < l; ++i) {
        const e = edges[i];
        const s = e[0];
        const t = e[1];
        if (matchL[s] === t) {
            if (!matchCount[s]++) {
                continue;
            }
        }
        adjL[s].push(t);
        adjR[t].push(s);
    }

    // Construct cover
    const left = [];
    const right = [];
    for (let i = 0; i < n; ++i) {
        walk(right, i, adjL, matchL, coverL, matchR, coverR);
    }
    for (let i = 0; i < m; ++i) {
        walk(left, i, adjR, matchR, coverR, matchL, coverL);
    }

    // Clean up any left over edges
    for (let i = 0; i < n; ++i) {
        if (!coverL[i] && matchL[i] >= 0) {
            coverL[i] = 1;
            coverR[matchL[i]] = 1;
            left.push(i);
        }
    }

    // Clean up data
    pool.free(coverR);
    pool.free(matchR);
    pool.free(coverL);
    pool.free(matchCount);
    pool.free(matchL);

    return [left, right];
};

export default bipartiteVertexCover;
