const findMinCover = require('./koenig');

// ///////////////////////////// SETUP /////////////////////////////

const scores = {
    david: {
        aaa: 0,
        bbb: 1,
        ccc: 1,
    },
    joe: {
        aaa: 3,
        bbb: 9,
        ccc: 8,
    },
    mark: {
        aaa: 4,
        bbb: 7,
        ccc: 6,
    },
    // ryan: [
    //     { user: 'mark', score: 10 },
    // ],
};

// const scores = {
//     a: {
//         aaa: 0,
//         bbb: 1,
//         ccc: 1,
//     },
//     b: {
//         aaa: 3,
//         bbb: 9,
//         ccc: 8,
//     },
//     c: {
//         aaa: 4,
//         bbb: 7,
//         ccc: 6,
//     },
//     d: {
//         aaa: 4,
//         bbb: 7,
//         ccc: 6,
//     },
//     // ryan: [
//     //     { user: 'mark', score: 10 },
//     // ],
// };

const rowKeys = Object.keys(scores);
const colKeys = Object.keys(scores[rowKeys[0]]); // Assumes every row has same column keys (users rated)
const size = rowKeys.length;
if (size !== colKeys.length) {
    throw new Error('Matrix must be square');
}
const scoresCol = {};
const smallestInCols = {};

for (const colKey of colKeys) {
    scoresCol[colKey] = {};
    smallestInCols[colKey] = Infinity;
}

for (const rowKey of rowKeys) {
    // Make alt version of scores indexed by column iterating down row (mirror scores)
    for (const colKey of colKeys) {
        Object.defineProperty(scoresCol[colKey], rowKey, {
            get() {
                return scores[rowKey][colKey];
            },
            set(score) {
                scores[rowKey][colKey] = score;
            },
            enumerable: true,
        });
    }
}

// ///////////////////////////// FUNCS /////////////////////////////

const getSmallestInRow = row => Object.values(row).reduce((acc, v) => Math.min(acc, v));
const addToEachInRow = (row, num) => {
    for (const colKey of colKeys) {
        row[colKey] += num;
    }
};

// ///////////////////////////// MAIN /////////////////////////////

for (const rowKey of rowKeys) {
    // Can do some optimization to get smallest in each column here
    const row = scores[rowKey];
    let smallestInRow = Infinity;
    // Find smallest in row
    for (const colKey of colKeys) {
        const score = row[colKey];
        if (score < smallestInRow) smallestInRow = score;
    }
    // For each in row, minus smallest :AND: update smallest in each column seen
    for (const colKey of colKeys) {
        const score = row[colKey] - smallestInRow;
        row[colKey] = score;
        if (score < smallestInCols[colKey]) smallestInCols[colKey] = score;
    }
}

// For each column (in each row), minus smallest
for (const rowKey of rowKeys) {
    const row = scores[rowKey];
    for (const colKey of colKeys) {
        row[colKey] -= smallestInCols[colKey];
    }
}

// const mapRowToIndex = name => rowKeys.indexOf(name);
// const mapColToIndex = name => colKeys.indexOf(name);
// const mapIndexToRow = idx => rowKeys[idx];
// const mapIndexToCol = idx => colKeys[idx];

let attempt = 0;
let fullCover = false;
let scoreCover;
while (!fullCover) {
    console.log(`(#${++attempt}) Trying to cover`);

    // Solve 0-edges as minimal vertex cover
    const zeroEdges = [];

    for (const rowKey of rowKeys) {
        const row = scores[rowKey];
        for (const colKey of colKeys) {
            const score = row[colKey];
            if (score === 0) zeroEdges.push([rowKeys.indexOf(rowKey), colKeys.indexOf(colKey)]);
        }
    }

    console.log(scores);
    console.log(zeroEdges);
    const coveredRows = {};
    const coveredCols = {};

    scoreCover = findMinCover(size, size, zeroEdges)
        .map((rowOrCol, type) =>
            rowOrCol.map((idx) => {
                if (type === 0) {
                    const name = rowKeys[idx];
                    coveredRows[name] = true;
                    return name;
                }
                if (type === 1) {
                    const name = colKeys[idx];
                    coveredCols[name] = true;
                    return name;
                }
            }));

    const coverSize = scoreCover[0].length + scoreCover[1].length;
    console.log(coverSize, size);
    fullCover = coverSize >= size;

    if (!fullCover) {
        let minUncoveredScore = Infinity;
        for (const rowKey of rowKeys) {
            if (coveredRows[rowKey]) continue;
            const row = scores[rowKey];
            for (const colKey of colKeys) {
                if (coveredCols[colKey]) continue;
                const score = row[colKey];
                if (score < minUncoveredScore) minUncoveredScore = score;
            }
        }

        for (const rowKey of rowKeys) {
            const rowCovered = coveredRows[rowKey];
            const row = scores[rowKey];
            for (const colKey of colKeys) {
                const colCovered = coveredCols[colKey];
                const score = row[colKey];
                console.log(colKey, rowKey, rowCovered, colCovered, score, minUncoveredScore);
                if (rowCovered && colCovered) {
                    row[colKey] = score + minUncoveredScore;
                } else if (!rowCovered && !colCovered) {
                    row[colKey] = score - minUncoveredScore;
                }
            }
        }

        // if (attempt === 3) break;
    }
}

console.log(scores);
console.log(scoreCover);
