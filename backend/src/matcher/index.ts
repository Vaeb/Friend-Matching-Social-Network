// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import sourceMapSupport from 'source-map-support';

import { prisma } from '../server';
import { cloneObj } from '../utils';
import findMinCover from './koenig';
import { test1, test2, testNow } from './matchFixtures';

sourceMapSupport.install();

const interval = 1000 * 60 * 60 * 24;
const maxNumber = Number.MAX_SAFE_INTEGER;
// const maxNumber = 1e4;

// eslint-disable-next-line prefer-const
let matchAlgorithmSecond;
const matchAlgorithm = (userScores, rowKeys, colKeys = rowKeys) => {
    const originalUserScores = cloneObj(userScores);
    console.log('Original weights:');
    console.table(originalUserScores);

    const size = rowKeys.length;
    if (size !== colKeys.length) {
        throw new Error('Matrix must be square');
    }
    const userScoresCol = {};
    const smallestInCols = {};

    for (const colKey of colKeys) {
        userScoresCol[colKey] = {};
        smallestInCols[colKey] = Infinity;
    }

    for (const rowKey of rowKeys) {
        for (const colKey of colKeys) {
            Object.defineProperty(userScoresCol[colKey], rowKey, {
                get() {
                    return userScores[rowKey][colKey];
                },
                set(score) {
                    userScores[rowKey][colKey] = score;
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
        const row = userScores[rowKey];
        let smallestInRow = Infinity;
        const colScore = {};
        // Find smallest in row
        for (const colKey of colKeys) {
            const score = row[colKey] ?? 0;
            if (score < smallestInRow) smallestInRow = score;
            colScore[colKey] = score;
        }
        // For each in row, minus smallest :AND: update smallest in each column seen
        for (const colKey of colKeys) {
            const score = colScore[colKey] - smallestInRow;
            // const score = 1e3 + colScore[colKey];
            row[colKey] = score;
            if (score < smallestInCols[colKey]) smallestInCols[colKey] = score;
        }
    }

    console.log('Partially modified weights:');
    console.table(userScores);

    // For each column (in each row), minus smallest
    for (const rowKey of rowKeys) {
        const row = userScores[rowKey];
        for (const colKey of colKeys) {
            row[colKey] -= smallestInCols[colKey];
        }
    }

    console.log('Modified weights:');
    console.table(userScores);

    let coverAttempt = 0;
    let fullCover = false;
    let scoreCover;
    while (!fullCover) {
        if (++coverAttempt > 10000) {
            return matchAlgorithmSecond(originalUserScores, rowKeys, colKeys);
        // if (++coverAttempt > 300000) {
            // return null;
        }
        // console.log(`Attempt @ Cover #${coverAttempt}`);

        // Solve 0-edges as minimal vertex cover
        const zeroEdges = [];

        for (const rowKey of rowKeys) {
            const row = userScores[rowKey];
            for (const colKey of colKeys) {
                const score = row[colKey];
                if (score === 0) zeroEdges.push([rowKeys.indexOf(rowKey), colKeys.indexOf(colKey)]);
            }
        }

        const coveredLines = {};
        // console.log(userScores);
        // console.log(zeroEdges);

        const [coveredRows, coveredCols] = findMinCover(size, size, zeroEdges);
        // console.log('coveredRows', coveredRows, 'coveredCols', coveredCols);
        scoreCover = [];
        for (const idx of coveredRows) {
            const name = rowKeys[idx];
            coveredLines[name] = true;
            scoreCover.push(name);
        }
        for (const idx of coveredCols) {
            const name = colKeys[idx];
            coveredLines[name] = true;
            scoreCover.push(name);
        }
        // console.log('scoreCover', scoreCover);

        const modifiedScores = cloneObj(userScores);
        for (const rowKey of rowKeys) {
            const row = modifiedScores[rowKey];
            for (const colKey of colKeys) {
                if (coveredLines[rowKey] || coveredLines[colKey]) {
                    if (rowKey !== colKey && coveredLines[rowKey] && coveredLines[colKey]) {
                        row[colKey] = '*';
                    } else {
                        row[colKey] = '-';
                    }
                }
            }
        }
        // console.log('Covered:');
        // console.table(modifiedScores);

        // scoreCover = [
        //     ...new Set(
        //         findMinCover(size, size, zeroEdges)
        //             .map(rowOrCol =>
        //                 rowOrCol.map((idx) => {
        //                     const name = rowKeys[idx];
        //                     coveredLines[name] = true;
        //                     return name;
        //                 })
        //             )
        //             .flat(1)
        //     ),
        // ];

        // console.log('scoreCover', scoreCover);
        const coverSize = scoreCover.length;
        fullCover = coverSize >= size;

        if (!fullCover) {
            let minUncoveredScore = Infinity;
            // Find minimum uncovered score
            for (const rowKey of rowKeys) {
                if (coveredLines[rowKey]) continue;
                const row = userScores[rowKey];
                for (const colKey of colKeys) {
                    if (coveredLines[colKey]) continue;
                    const score = row[colKey];
                    if (score < minUncoveredScore) minUncoveredScore = score;
                }
            }

            // Minus from uncovered, add to doubly covered
            for (const rowKey of rowKeys) {
                const rowCovered = coveredLines[rowKey];
                const row = userScores[rowKey];
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
        }

        // console.log('New:');
        // console.table(userScores);
    }

    console.log(`[${coverAttempt}]`, 'Found minimal vertex cover:', scoreCover);
    console.log('Final modified weights:');
    console.table(userScores);

    // Pick out the solution based on which lines only have 1 zero
    let picked = 0;
    const results = [];
    const pickedLines = {};
    let pickAttempt = 0;
    const pickGoal = size / 2;
    while (picked < pickGoal) {
        if (++pickAttempt > 10) {
            return matchAlgorithmSecond(originalUserScores, rowKeys, colKeys);
            // return null;
        }
        // console.log(111, pickAttempt);
        // console.log(`Attempt @ Picking optimal assignment #${++pickAttempt}`);
        for (const rowKey of rowKeys) {
            if (pickedLines[rowKey]) continue;
            const row = userScores[rowKey];
            // console.log(rowKey, JSON.stringify(row));
            let zeroKey = null;
            let multiZeros = false;
            for (const colKey of colKeys) {
                if (pickedLines[colKey]) continue;
                const score = row[colKey];
                if (score === 0) {
                    // console.log('got 0', colKey);
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

    console.log(`[${pickAttempt}]`, 'Found optimal assignment:');
    console.table(results);

    return results;
};

matchAlgorithmSecond = (userScores, rowKeys, colKeys = rowKeys) => {
    const allPairs = [];
    const seenPairs = {};
    const seenMatches = {};
    const matches = [];
    const maxMatches = Math.floor(rowKeys.length / 2);
    for (const rowKey of rowKeys) {
        const row = userScores[rowKey];
        for (const colKey of colKeys) {
            const score = row[colKey];
            if (score === Infinity || seenPairs[`${colKey}-${rowKey}`]) continue;
            seenPairs[`${rowKey}-${colKey}`] = true;
            allPairs.push({ rowKey, colKey, score: score ? -score : 0 });
        }
    }
    allPairs.sort((a, b) => b.score - a.score);
    console.log('allPairs', allPairs);
    for (const { rowKey, colKey } of allPairs) {
        if (!seenMatches[rowKey] && !seenMatches[colKey]) {
            seenMatches[rowKey] = true;
            seenMatches[colKey] = true;
            matches.push([rowKey, colKey]);
            if (matches.length >= maxMatches) break;
        }
    }
    console.log('matches2:');
    console.table(matches);
    return matches;
};

type CompatibilityRelation = {
    id1: number;
    id2: number;
    compatibility: number;
    manual: boolean;
    auto: boolean;
    username1: string;
    username2: string;
    last1: string;
    last2: string;
    freq1: number;
    freq2: number;
};

const matchSubset = async (matchType, university, baseDateIso, userScores, userMap, callback = (a?: any, b?: any): any => undefined) => {
    const users = Object.keys(userMap);

    if (users.length < 2) {
        console.log(`[${university.shortName}] [${matchType}]:`, 'Not enough users to match!');
        return [];
    }

    if (users.length % 2 === 1) {
        const extraTag = '__NO_MATCH__';
        userMap[extraTag] = -1;
        userScores[extraTag] = { [extraTag]: Infinity };
        for (const tag of users) {
            userScores[tag][extraTag] = 0;
            userScores[extraTag][tag] = 0;
        }
        users.push(extraTag);
    }

    console.log('Users', users);
    // console.log('User scores:');
    // console.table(userScores);

    const matches = matchAlgorithm(cloneObj(userScores), users);
    if (matches == null) {
        console.log(`[${university.shortName}] [${matchType}]:`, 'Matching failed.');
        return [];
    }

    const matchedIds = [];
    const updateRows = [];
    for (const [tag1, tag2] of matches) {
        const id1 = userMap[tag1];
        const id2 = userMap[tag2];
        const originalScore = userScores[tag1][tag2];
        console.log(id1, id2, userScores[tag1][tag2]);
        if (id1 === -1 || id2 === -1 || originalScore === undefined || originalScore >= 0) continue; // negated score
        console.log(`[${university.shortName}]`, 'Found match:', tag1, tag2, id1, id2);
        matchedIds.push(id1, id2);   
        if (id1 < id2) {
            updateRows.push({ user1Id: id1, user2Id: id2 });
        } else {
            updateRows.push({ user1Id: id2, user2Id: id1 });
        }
    }
    console.log('matchedIds', matchedIds);
    console.log('updateRows', updateRows);

    await callback(matchedIds, updateRows);

    // await prisma.userRelation.updateMany({
    //     where: {
    //         OR: updateRows, // Primary key combo
    //     },
    //     data: { haveMatched: true, matchDate: baseDate },
    // });

    if (matchType === 'Auto') {
        const bulkRows = updateRows.map(({ user1Id, user2Id }) =>
            `(${user1Id}, ${user2Id}, true, '${baseDateIso}', timezone('utc', now()))`
        );

        const queryUpsertRows = `
            INSERT INTO user_relations
                ("user1Id", "user2Id", "haveMatched", "matchDate", "updatedAt")
            VALUES
                ${bulkRows.join(', ')}
            ON CONFLICT ("user1Id", "user2Id") DO UPDATE
                SET "haveMatched" = excluded."haveMatched", "matchDate" = excluded."matchDate", "updatedAt" = excluded."updatedAt";
        `;

        console.log(queryUpsertRows);
        const numUpdated = await prisma.$executeRawUnsafe(queryUpsertRows);

        console.log(`[${university.name}] [${matchType}]: Added new matches!! ${numUpdated} user_relations rows (haveMatched)`);
    }

    return matches;
};

const doMatch = async () => {
    const baseDate = new Date(+new Date() - (1000 * 60 * 60)); // Safety window
    const baseDateIso = baseDate.toISOString();

    const universities = await prisma.university.findMany();
    for (const university of universities) {
        console.log('Processing university', university.name);
        const compatibleRelations: CompatibilityRelation[] = await prisma.$queryRaw`
            SELECT "user1Id" as "id1", "user2Id" as "id2", "compatibility",
                (ms1."manualEnabled" = true AND ms1."nextManualMatchId" IS NULL
                    AND ms2."manualEnabled" = true AND ms2."nextManualMatchId" IS NULL) as "manual",
                (ms1."autoFreq" <> 0 AND CURRENT_DATE >= ms1."lastAutoMatched"::DATE + ms1."autoFreq"
                    AND ms2."autoFreq" <> 0 AND CURRENT_DATE >= ms2."lastAutoMatched"::DATE + ms2."autoFreq") as "auto",
                u1."username" as "username1", u2."username" as "username2",
                ms1."lastAutoMatched" as last1, ms2."lastAutoMatched" as last2, ms1."autoFreq" as freq1, ms2."autoFreq" as freq2
            FROM user_relations
            JOIN match_settings ms1
                ON "user1Id" = ms1."userId" AND ms1."universityId" = ${university.id}
                    AND ((ms1."manualEnabled" = true AND ms1."nextManualMatchId" IS NULL) OR (ms1."autoFreq" <> 0 AND CURRENT_DATE >= ms1."lastAutoMatched"::DATE + ms1."autoFreq"))
            JOIN match_settings ms2
                ON "user2Id" = ms2."userId" AND ms2."universityId" = ${university.id}
                    AND ((ms2."manualEnabled" = true AND ms2."nextManualMatchId" IS NULL) OR (ms2."autoFreq" <> 0 AND CURRENT_DATE >= ms2."lastAutoMatched"::DATE + ms2."autoFreq"))
            JOIN users u1 ON "user1Id" = u1."id"
            JOIN users u2 ON "user2Id" = u2."id"
            WHERE compatibility > 0 AND "haveMatched" = false AND "areFriends" = false;
        `;
        console.table(compatibleRelations);

        const autoUserMap = {};
        const autoUserScores = {};
        const manualUsersMap = {};
        const manualUserScores = {};

        const fillMap = (c, tag1, tag2, mapUsers, mapScores, negCompatibility) => {
            mapUsers[tag1] = c.id1;
            mapUsers[tag2] = c.id2;
            if (!mapScores[tag1]) mapScores[tag1] = { [tag1]: Infinity };
            if (!mapScores[tag2]) mapScores[tag2] = { [tag2]: Infinity };
            mapScores[tag1][tag2] = negCompatibility;
            mapScores[tag2][tag1] = negCompatibility;
        };

        for (const c of compatibleRelations) {
            const tag1 = `${c.username1}`;
            const tag2 = `${c.username2}`;
            const { auto, manual } = c;
            const negCompatibility = c.compatibility > 0 ? -c.compatibility : c.compatibility;
            if (auto) {
                fillMap(c, tag1, tag2, autoUserMap, autoUserScores, negCompatibility);
            }
            if (manual) {
                fillMap(c, tag1, tag2, manualUsersMap, manualUserScores, negCompatibility);
            }
        }

        console.log(`\n${'-'.repeat(14)}\nAuto:`);
        // const nowDateStr = new Date().toISOString();
        // const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        // const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        const autoMatches = await matchSubset('Auto', university, baseDateIso, autoUserScores, autoUserMap, async (matchedIds) => {
            // console.log('Updating lastAutoMatched');
            const numUpdated = await prisma.matchSettings.updateMany({
                where: {
                    universityId: university.id,
                    userId: { in: matchedIds },
                },
                data: {
                    lastAutoMatched: baseDate,
                    // updatedAt: localISOTime,
                },
            });
            console.log(`[${university.name}] [Auto]: Updated ${numUpdated.count} match_settings rows (lastAutoMatched)`);
        });

        for (const [tag1, tag2] of autoMatches) {
            if (manualUserScores[tag1][tag2] !== undefined) {
                manualUserScores[tag1][tag2] = Infinity;
                manualUserScores[tag2][tag1] = Infinity;
            }
        }

        console.log(`\n\n\n${'-'.repeat(14)}\nManual:`);
        await matchSubset('Manual', university, baseDateIso, manualUserScores, manualUsersMap, async (_, updateRows) => {
            const bulkRows = updateRows.map(({ user1Id, user2Id }) =>
                `(${user1Id}, ${university.id}, ${user2Id}, timezone('utc', now())),
                (${user2Id}, ${university.id}, ${user1Id}, timezone('utc', now()))`
            );

            // console.log('Updating nextManualMatchId');
            const queryUpsertRows = `
                INSERT INTO match_settings
                    ("userId", "universityId", "nextManualMatchId", "updatedAt")
                VALUES
                    ${bulkRows.join(', ')}
                ON CONFLICT ("userId", "universityId") DO UPDATE
                    SET "nextManualMatchId" = excluded."nextManualMatchId", "updatedAt" = excluded."updatedAt";
            `;

            console.log(queryUpsertRows);
            const numUpdated = await prisma.$executeRawUnsafe(queryUpsertRows);
            console.log(`[${university.name}] [Manual]: Updated ${numUpdated} match_settings rows (nextManualMatchId)`);
        });
    }
};

const doTests = async () => {
    const test = testNow;
    console.log(test.rowTags, test.colTags);
    console.table(test.scores);
    const matches = matchAlgorithm(test.scores, test.rowTags, test.colTags);
    console.log('Done!');
};

setInterval(doMatch, interval);
doMatch();
// doTests();
