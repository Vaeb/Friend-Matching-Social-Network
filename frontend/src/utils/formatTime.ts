export const round = (num: number, inc: number) => (inc == 0 ? num : Math.floor(num / inc + 0.5) * inc);

export const toFixedCut = (num: number, decimals: number) => Number(num.toFixed(decimals)).toString();

export const formatTime = (timeRaw: Date | number, calcElapsed = false) => {
    let time: number;
    time = typeof timeRaw === 'object' ? +timeRaw : timeRaw;
    if (calcElapsed) time = +new Date() - time;
    let timeStr: string;
    let formatStr: string;
    let noSuffix = false;

    const numSeconds = round(time / 1000, 1);
    const numMinutes = round(time / (1000 * 60), 1);
    const numHours = round(time / (1000 * 60 * 60), 1);
    const numDays = round(time / (1000 * 60 * 60 * 24), 1);
    const numWeeks = round(time / (1000 * 60 * 60 * 24 * 7), 1);
    const numMonths = round(time / (1000 * 60 * 60 * 24 * 30.42), 1);
    const numYears = round(time / (1000 * 60 * 60 * 24 * 365.2422), 1);

    if (numSeconds < 1) {
        timeStr = toFixedCut(time, 0);
        // formatStr = `${timeStr} millisecond`;
        formatStr = 'Just now';
        noSuffix = true;
    } else if (numMinutes < 1) {
        timeStr = toFixedCut(numSeconds, 1);
        formatStr = `${timeStr} second`;
    } else if (numHours < 1) {
        timeStr = toFixedCut(numMinutes, 1);
        formatStr = `${timeStr} minute`;
    } else if (numDays < 1) {
        timeStr = toFixedCut(numHours, 1);
        formatStr = `${timeStr} hour`;
    } else if (numWeeks < 1) {
        timeStr = toFixedCut(numDays, 1);
        formatStr = `${timeStr} day`;
    } else if (numMonths < 1) {
        timeStr = toFixedCut(numWeeks, 1);
        formatStr = `${timeStr} week`;
    } else if (numYears < 1) {
        timeStr = toFixedCut(numMonths, 1);
        formatStr = `${timeStr} month`;
    } else {
        timeStr = toFixedCut(numYears, 1);
        formatStr = `${timeStr} year`;
    }

    if (noSuffix === false) {
        if (timeStr !== '1') formatStr += 's';
        formatStr += ' ago';
    }

    return formatStr;
};

export const getDateString = (date = new Date()): string => {
    // const iso = date.toISOString();
    // return `${iso.substring(0, 10)} ${iso.substring(11, 19)}`;
    return date.toLocaleString();
};
