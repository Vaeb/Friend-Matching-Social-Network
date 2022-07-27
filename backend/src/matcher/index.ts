// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { prisma } from '../server';
import { cloneObj } from '../utils';
import findMinCover from './koenig';

const interval = 1000 * 60 * 10;
const defaultMatch = Number.MAX_SAFE_INTEGER;
// const defaultMatch = 1e4;

const matchAlgorithm = (compats, allUsers) => {
    const originalCompats = cloneObj(compats);
    console.log('Original weights:', originalCompats);
    const rowKeys = allUsers;
    const colKeys = allUsers; // Assumes every row has same column keys (users rated)
    const size = rowKeys.length;
    if (size !== colKeys.length) {
        throw new Error('Matrix must be square');
    }
    const compatsCol = {};
    const smallestInCols = {};

    for (const colKey of colKeys) {
        compatsCol[colKey] = {};
        smallestInCols[colKey] = Infinity;
    }

    for (const rowKey of rowKeys) {
        for (const colKey of colKeys) {
            Object.defineProperty(compatsCol[colKey], rowKey, {
                get() {
                    return compats[rowKey][colKey];
                },
                set(score) {
                    compats[rowKey][colKey] = score;
                },
                enumerable: true,
            });
        }
    }

    // ///////////////////////////// FUNCS /////////////////////////////

    const getSmallestInRow = row => Object.values(row).reduce((acc: any, v: any) => Math.min(acc, v));
    const addToEachInRow = (row, num) => {
        for (const colKey of colKeys) {
            row[colKey] += num;
        }
    };

    // ///////////////////////////// MAIN /////////////////////////////

    for (const rowKey of rowKeys) {
        // Can do some optimization to get smallest in each column here
        const row = compats[rowKey];
        let smallestInRow = Infinity;
        // Find smallest in row
        for (const colKey of colKeys) {
            const score = row[colKey] ?? defaultMatch;
            if (score < smallestInRow) smallestInRow = score;
        }
        // For each in row, minus smallest :AND: update smallest in each column seen
        for (const colKey of colKeys) {
            const score = (row[colKey] ?? defaultMatch) - smallestInRow;
            row[colKey] = score;
            if (score < smallestInCols[colKey]) smallestInCols[colKey] = score;
        }
    }

    // console.log('QQQModified weights:', compats);

    // For each column (in each row), minus smallest
    for (const rowKey of rowKeys) {
        const row = compats[rowKey];
        for (const colKey of colKeys) {
            row[colKey] -= smallestInCols[colKey];
        }
    }

    console.log('Modified weights:', compats);

    let coverAttempt = 0;
    let fullCover = false;
    let scoreCover;
    while (!fullCover) {
        if (++coverAttempt > 300000) return console.log('Something went wrong');
        // console.log(`Attempt @ Cover #${coverAttempt}`);

        // Solve 0-edges as minimal vertex cover
        const zeroEdges = [];

        for (const rowKey of rowKeys) {
            const row = compats[rowKey];
            for (const colKey of colKeys) {
                const score = row[colKey];
                if (score === 0) zeroEdges.push([rowKeys.indexOf(rowKey), rowKeys.indexOf(colKey)]);
            }
        }

        const coveredLines = {};
        // console.log(compats);
        // console.log(zeroEdges);

        scoreCover = [
            ...new Set(
                findMinCover(size, size, zeroEdges)
                    .map(rowOrCol =>
                        rowOrCol.map((idx) => {
                            const name = rowKeys[idx];
                            coveredLines[name] = true;
                            return name;
                        })
                    )
                    .flat(1)
            ),
        ];

        // console.log('scoreCover', scoreCover);
        const coverSize = scoreCover.length;
        fullCover = coverSize >= size;

        if (!fullCover) {
            let minUncoveredScore = Infinity;
            // Find minimum uncovered score
            for (const rowKey of rowKeys) {
                if (coveredLines[rowKey]) continue;
                const row = compats[rowKey];
                for (const colKey of colKeys) {
                    if (coveredLines[colKey]) continue;
                    const score = row[colKey];
                    if (score < minUncoveredScore) minUncoveredScore = score;
                }
            }

            // Minus from uncovered, add to doubly covered
            for (const rowKey of rowKeys) {
                const rowCovered = coveredLines[rowKey];
                const row = compats[rowKey];
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
    console.log('Final modified weights:', compats);

    // Pick out the solution based on which lines only have 1 zero
    let picked = 0;
    const results = [];
    const pickedLines = {};
    let pickAttempt = 0;
    const pickGoal = size / 2;
    while (picked < pickGoal) {
        // if (++pickAttempt > 4000000) return console.log('Something went wrong @ optimal assignment', picked);
        if (++pickAttempt > 1) return console.log('Something went wrong @ optimal assignment', pickAttempt, picked, pickGoal);
        // console.log(111, pickAttempt);
        // console.log(`Attempt @ Picking optimal assignment #${++pickAttempt}`);
        for (const rowKey of rowKeys) {
            if (pickedLines[rowKey]) continue;
            const row = compats[rowKey];
            // console.log(rowKey, JSON.stringify(row));
            let zeroKey = null;
            let multiZeros = false;
            for (const colKey of colKeys) {
                if (pickedLines[colKey]) continue;
                const score = row[colKey];
                if (score === 0) {
                    console.log('got 0', colKey);
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

    return results;
};

const doMatch = async () => {
    const compatibilitiesBase = await prisma.userRelation.findMany({
        select: {
            user1: { select: { id: true, username: true } },
            user2: { select: { id: true, username: true } },
            compatibility: true,
        },
        where: {
            // NOT: { OR: [{ user1: { username: 'sean1' } }, { user2: { username: 'sean1' } }] },
            // haveMatched: false,
            areFriends: false,
            compatibility: { not: null },
        },
        take: 2,
    });

    const compatibilities = compatibilitiesBase as (typeof compatibilitiesBase[0] & { compatibility: number })[];

    const kMatch = 2;
    const allUsersMap = {};
    const compats = {};
    const fixCompats = (user, userTag) => {
        if (!compats[userTag]) {
            const baseCompats = {};
            for (let i = 1; i <= kMatch; i++) baseCompats[`${user.username}-${i}`] = Infinity;
            compats[userTag] = baseCompats;
        }
    };
    for (let i = 1; i <= kMatch; i++) {
        for (const c of compatibilities) {
            const user1 = `${c.user1.username}-${i}`;
            const user2 = `${c.user2.username}-${i}`;
            fixCompats(c.user1, user1);
            fixCompats(c.user2, user2);
            const compats1 = compats[user1];
            const compats2 = compats[user2];
            compats1[user2] = defaultMatch - c.compatibility;
            compats2[user1] = defaultMatch - c.compatibility;
            console.log(user1, user2, c.compatibility);
            allUsersMap[user1] = c.user1.id;
            allUsersMap[user2] = c.user2.id;
        }
    }

    const allUsers = Object.keys(allUsersMap);
    if (allUsers.length % 2 === 1) {
        const newUser = '__NO_MATCH__';
        compats[newUser] = { [newUser]: Infinity };
        for (const user of allUsers) {
            compats[user][newUser] = defaultMatch;
            compats[newUser][user] = defaultMatch;
        }
        allUsers.push(newUser);
    }

    console.log('allUsers', allUsers);
    // console.log('compats', compats);

    if (allUsers.length === 0) {
        console.log('Not enough users to match!');
        return;
    }

    const result = matchAlgorithm(compats, allUsers);

    // const updateRows = [];
    // for (const pair of result) {
    //     const id1 = allUsersMap[pair[0]];
    //     const id2 = allUsersMap[pair[1]];
    //     if (!id1 || !id2) continue;
    //     updateRows.push({ user1Id: id1, user2Id: id2 }, { user1Id: id2, user2Id: id1 });
    // }

    // console.log(updateRows);

    // const nowDate = new Date();
    // const numUpdated = await prisma.userRelation.updateMany({
    //     where: {
    //         OR: updateRows,
    //     },
    //     data: { haveMatched: true, matchDate: nowDate },
    // });

    // console.log('Added new matches!', numUpdated);
};

// setInterval(doMatch, interval);
doMatch();
