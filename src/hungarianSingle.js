const findMinCover = require('./koenig');

// ///////////////////////////// SETUP /////////////////////////////

const scores = {
    david: {
        david: Infinity,
        bill: 3,
        paul: 4,
        sam: 1,
    },
    bill: {
        david: 3,
        bill: Infinity,
        paul: 9,
        sam: 7,
    },
    paul: {
        david: 4,
        bill: 9,
        paul: Infinity,
        sam: 6,
    },
    sam: {
        david: 1,
        bill: 7,
        paul: 6,
        sam: Infinity,
    },
};

const originalScores = structuredClone(scores);
console.log('Original weights:', originalScores);
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

console.log('Modified weights:', scores);

let coverAttempt = 0;
let fullCover = false;
let scoreCover;
while (!fullCover) {
    console.log(`Attempt @ Cover #${++coverAttempt}`);

    // Solve 0-edges as minimal vertex cover
    const zeroEdges = [];

    for (const rowKey of rowKeys) {
        const row = scores[rowKey];
        for (const colKey of colKeys) {
            const score = row[colKey];
            if (score === 0) zeroEdges.push([rowKeys.indexOf(rowKey), rowKeys.indexOf(colKey)]);
        }
    }

    const coveredLines = {};
    // console.log(scores);
    // console.log(zeroEdges);

    scoreCover = [...new Set(findMinCover(size, size, zeroEdges)
        .map(rowOrCol =>
            rowOrCol.map((idx) => {
                const name = rowKeys[idx];
                coveredLines[name] = true;
                return name;
            })).flat(1))];

    // console.log('scoreCover', scoreCover);
    const coverSize = scoreCover.length;
    fullCover = coverSize >= size;

    if (!fullCover) {
        let minUncoveredScore = Infinity;
        // Find minimum uncovered score
        for (const rowKey of rowKeys) {
            if (coveredLines[rowKey]) continue;
            const row = scores[rowKey];
            for (const colKey of colKeys) {
                if (coveredLines[colKey]) continue;
                const score = row[colKey];
                if (score < minUncoveredScore) minUncoveredScore = score;
            }
        }

        // Minus from uncovered, add to doubly covered
        for (const rowKey of rowKeys) {
            const rowCovered = coveredLines[rowKey];
            const row = scores[rowKey];
            for (const colKey of colKeys) {
                const colCovered = coveredLines[colKey];
                const numCovered = Math.min((rowCovered ? 1 : 0) + (colCovered ? 1 : 0), rowKey === colKey ? 1 : 2);
                const score = row[colKey];
                if (numCovered === 0) {
                    row[colKey] = score - minUncoveredScore;
                } else if (numCovered === 2) {
                    row[colKey] = score + minUncoveredScore;
                }
            }
        }

        // if (attempt === 3) break;
    }
}

console.log('Found minimal vertex cover:', scoreCover);
console.log('Final modified weights:', scores);

// Pick out the solution based on which lines only have 1 zero
let picked = 0;
const results = [];
const pickedLines = {};
let pickAttempt = 0;
const pickGoal = size / 2;
while (picked < pickGoal) {
    console.log(`Attempt @ Picking optimal assignment #${++pickAttempt}`);
    for (const rowKey of rowKeys) {
        if (pickedLines[rowKey]) continue;
        const row = scores[rowKey];
        let zeroKey = null;
        let multiZeros = false;
        for (const colKey of colKeys) {
            if (pickedLines[colKey]) continue;
            const score = row[colKey];
            if (score === 0) {
                if (zeroKey !== null) {
                    multiZeros = true;
                    break;
                }
                zeroKey = colKey;
            }
        }
        if (!multiZeros) {
            picked++;
            pickedLines[rowKey] = true;
            pickedLines[zeroKey] = true;
            results.push([rowKey, zeroKey]);
        }
        if (picked === pickGoal) break;
    }
}

console.log('Found optimal assignment:', results);
