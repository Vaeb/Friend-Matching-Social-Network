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
const scoresCol = {};
const smallestInCols = {};

for (const colKey of colKeys) {
    scoresCol[colKey] = {};
    smallestInCols[colKey] = Infinity;
}

for (const rowKey of rowKeys) { // Make alt version of scores indexed by column iterating down row (mirror scores)
    for (const colKey of colKeys) {
        Object.defineProperty(scoresCol[colKey], rowKey, {
            get() { return scores[rowKey][colKey]; },
            set(score) { scores[rowKey][colKey] = score; },
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

for (const rowKey of rowKeys) { // Can do some optimization to get smallest in each column here
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

const assignedInRow = {};
const assignedInCol = {};
const assigned = [];
const crossed = [];
// Assign and Cross zeros
for (const rowKey of rowKeys) {
    const row = scores[rowKey];
    let minZerosInCol; // Guesswork
    for (const colKey of colKeys) {
        const score = row[colKey];
        if (score === 0) {
            if (assignedInRow[rowKey] !== undefined || assignedInCol[colKey] !== undefined) {
                crossed.push([rowKey, colKey]);
            } else {
                assigned.push([rowKey, colKey]);
                assignedInRow[rowKey] = colKey;
                assignedInCol[colKey] = rowKey;
            }
        }
    }
}

const markedRow = {}; // No
const markedCol = {}; // Yes
let newlyMarkedRow = {};
let newlyMarkedCol = {};
let isFirst = true;

console.log('scores', scores);
console.log('assigned', assigned);
console.log('crossed', crossed);
console.log('assignedInRow', assignedInRow);
console.log('assignedInCol', assignedInCol);

let hasMarkedNew = true;
while (hasMarkedNew) {
    hasMarkedNew = false;
    for (const rowKey of rowKeys) {
        const row = scores[rowKey];
        if (isFirst && assignedInRow[rowKey] === undefined) { // No assignments
            markedRow[rowKey] = true;
            newlyMarkedRow[rowKey] = true;
            hasMarkedNew = true;
        }
        const isRowNewlyMarked = newlyMarkedRow[rowKey];
        for (const colKey of colKeys) {
            const score = row[colKey];
            if (!markedCol[colKey] && score === 0 && isRowNewlyMarked) { // Zeros in newly marked rows
                markedCol[colKey] = true;
                newlyMarkedCol[colKey] = true;
                hasMarkedNew = true;
            }
        }
    }

    if (isFirst) console.log('markedRow', markedRow);
    console.log('markedCol', markedCol);

    newlyMarkedRow = {};

    for (const rowKey of rowKeys) {
        const assignedAtCol = assignedInRow[rowKey];
        if (!markedRow[rowKey] && assignedAtCol !== undefined && newlyMarkedCol[assignedAtCol]) {
            markedRow[rowKey] = true;
            newlyMarkedRow[rowKey] = true;
            hasMarkedNew = true;
        }
    }

    newlyMarkedCol = {};
    isFirst = false;

    console.log('markedRow', markedRow);
}
