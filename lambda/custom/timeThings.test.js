const myTime = require("./timeThings");
const moment = require("moment-timezone");

describe('all the twelves', () => {
    test('midnight', () => {
        var time = myTime.getTime(moment(new Date('September 20, 2018 00:00:00')));
        expect(time).toBe("midnight");
    });

    test('the time is noon', () => {
        var time = myTime.getTime(moment(new Date('September 20, 2018 12:00:00')));
        expect(time).toBe("noon");
    });
});

describe('on the hour', () => {
    test.each([
        [1, "one o'clock"],
        [2, "two o'clock"],
        [3, "three o'clock"],
        [4, "four o'clock"],
        [13, "one o'clock"],
        [14, "two o'clock"],
        [15, "three o'clock"],
        [16, "four o'clock"]])(
            '%i becomes %s',
            (hour, inWords) => {
                var time = myTime.getTime(moment(new Date('September 20, 2018 ' + hour + ':00:00')));
                expect(time).toBe(inWords);
            }
        );
});

describe('on the minutes', () => {
    test.each([
        ["00", 5, "five past midnight"],
        ["00", 10, "ten past midnight"],
        ["00", 15, "a quarter past midnight"],
        ["00", 20, "twenty past midnight"],
        ["00", 25, "twenty five past midnight"],
        ["00", 30, "half past midnight"],
        ["00", 35, "twenty five to one"],
        ["00", 40, "twenty to one"],
        ["00", 45, "a quarter to one"],
        ["00", 50, "ten to one"],
        ["00", 55, "five to one"]])(
            '%s:%i becomes %s',
            (hour, minutes, inWords) => {
                var time = myTime.getTime(moment(new Date('September 20, 2018 ' + hour + ':' + minutes + ':00')));
                expect(time).toBe(inWords);
            }
        );
});

describe('about the minutes', () => {
    test.each([
        ["13", 11, "about ten past one"],
        ["09", 44, "about a quarter to ten"],
        ["23", 58, "about midnight"],
        ["03", "02", "about three o'clock"],
        ["14", 13, "about a quarter past two"]
    ])(
        '%s:%i becomes %s',
        (hour, minutes, inWords) => {
            var time = myTime.getTime(moment(new Date('September 20, 2018 ' + hour + ':' + minutes + ':00')));
            expect(time).toBe(inWords);
        }
    )
})