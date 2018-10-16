const moment = require("moment-timezone");

function ConvertHoursToWord(hours) {
    switch (hours) {
        case 0:
            return "midnight";
        case 12:
            return "noon";
        case 1:
        case 13:
            return "one";
        case 2:
        case 14:
            return "two";
        case 3:
        case 15:
            return "three";
        case 4:
        case 16:
            return "four";
        case 5:
        case 17:
            return "five";
        case 6:
        case 18:
            return "six";
        case 7:
        case 19:
            return "seven";
        case 8:
        case 20:
            return "eight";
        case 9:
        case 21:
            return "nine";
        case 10:
        case 22:
            return "ten";
        case 11:
        case 23:
            return "eleven";
    }
}

function RoundMinutes(minutes) {
    let difference = minutes % 5;
    let roundedMinutes = minutes;
    if (difference <= 2) {
        roundedMinutes -= difference;
    } else {
        roundedMinutes += (5 - difference);
    }
    return roundedMinutes;
}

const MintuesToWord = {
    5: "five past",
    10: "ten past",
    15: "a quarter past",
    20: "twenty past",
    25: "twenty five past",
    30: "half past",
    35: "twenty five to",
    40: "twenty to",
    45: "a quarter to",
    50: "ten to",
    55: "five to"
}

const fetchWeekCommencing = (theMoment) => {

    const binCollectionDay = 5; // i.e. Friday
    const weekCommencingDay = 1; // i.e. Monday
    const dow = theMoment.isoWeekday();
    const formatString = "YYYY-MM-DD";
    let hour = parseInt(theMoment.format("HH"));
    
    // if we haven't yet passed the day of the week that I need:
    if ((dow < binCollectionDay) || ((dow == binCollectionDay) && (hour < 9))) {
        // then just give me this week's instance of that day
        return theMoment.isoWeekday(weekCommencingDay).format(formatString);
    } else {
        // otherwise, give me *next week's* instance of that same day
        return theMoment.add(1, 'weeks').isoWeekday(weekCommencingDay).format(formatString);
    }
}

const whichWeek = (myMoment, timeOfWeek) => {
    myMoment = moment(myMoment);
    const formatString = "YYYY-MM-DD";
    let weekCommencing = null;
    
    if (timeOfWeek == `THIS_WEEK`) {
        weekCommencing = myMoment;
    } else if (timeOfWeek == `NEXT_WEEK`) {
        myMoment.add(7, 'days');
        weekCommencing = myMoment;
    } else {
        console.log(`Oh no, we've got a weird time of the week - ${timeOfWeek}`);
    }
    return myMoment.format(formatString);
}

module.exports = {
    getTime: (moment) => {
        let minutes = moment.minutes();
        let hours = moment.hours();
        let roundedMinutes = RoundMinutes(minutes);

        if (roundedMinutes > 30) {
            hours = (hours + 1) % 24;
        }

        var hourStr = ConvertHoursToWord(hours);
        var minutesStr = MintuesToWord[roundedMinutes];
        var roundingStr = (minutes === roundedMinutes) ? '' : 'about ';

        if ((roundedMinutes === 0 || roundedMinutes === 60) && (hours === 0 || hours === 12)) {
            return roundingStr + hourStr;
        }

        if (roundedMinutes === 0 || roundedMinutes === 60) {
            return roundingStr + hourStr + " o'clock";
        }
        return roundingStr + minutesStr + ' ' + hourStr;
    },
    whichWeekIsIt: (myMoment, timeOfWeek) => {
        return whichWeek(fetchWeekCommencing(myMoment), timeOfWeek);
    }
}