const makeMatrix = (arr, reflect = false) => {
    const scores = {};
    const rowTags = [];
    const colTags = [];

    arr.forEach((row, i) => {
        const rowTag = `E${i}`;
        rowTags.push(rowTag);
        scores[rowTag] = {};
        row.forEach((score, j) => {
            if (i === 0) colTags.push(`${reflect ? 'E' : 'J'}${j}`);
            const colTag = colTags[j];
            if (reflect) {
                scores[rowTag][colTag] = rowTag === colTag ? Infinity : (scores[colTag]?.[rowTag] ?? score);
            } else {
                scores[rowTag][colTag] = score;
            }
        });
    });

    return { scores, rowTags, colTags };
};

export const test1 = makeMatrix([
    [482, 437, 512, 518],
    [421, 399, 432, 518],
    [502, 407, 518, 518],
    [414, 402, 411, 518],
]);

export const test2 = makeMatrix([
    [ -2, 520, 512, 518],
    [ -1,  -2, 514, 518],
    [ -1,  -1,  -2, 518],
    [ -1,  -1,  -1,  -2],
], true);

export const test3 = makeMatrix([
    [ -2, 100,  40,  10, 100, 100],
    [ -1,  -2, 100, 100, 100, 100],
    [ -1,  -1,  -2, 100, 100, 100],
    [ -1,  -1,  -1,  -2,  95, 100],
    [ -1,  -1,  -1,  -1,  -2, 100],
    [ -1,  -1,  -1,  -1,  -1,  -2],
], true);

export const testNow = test3;
