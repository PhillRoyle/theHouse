const va = require("virtual-alexa");
const moment = require("moment-timezone");
const time = require("./timeThings");
let alexa = null;

beforeAll(() => {
    alexa = va.VirtualAlexa.Builder()
        .handler("./index.handler")
        .interactionModelFile("../../models/en-GB.json")
        .create();

    alexa.dynamoDB().mock();
});

it('should open the house upon launch', async () => {
    let alexaResponse = await alexa.launch("the house");
    let output = alexaResponse.response.outputSpeech.ssml;
    expect(output).toContain("Welcome to The House");
})

it("should say I don't know if asked when baby last fed if nothing saved", async (done) => {
    alexa.utter("what time did jim last feed")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("You haven't told me yet.");
            done();
        });
})

it("should accept being told to feed a specific baby", async (done) => {
    alexa.utter("billy is eating")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("OK, I'll remember that.");
            done();
        });
})

it("should accept being told to feed 'she'", async (done) => {
    alexa.utter("she is eating")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("OK, I'll remember that.");
            done();
        });
})

it("should accept being told to feed 'he' with contractions", async (done) => {
    alexa.utter("he's eating")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("OK, I'll remember that.");
            done();
        });
})

it("should say when a specific baby fed if I've already told it", async (done) => {
    await alexa.utter("jim is eating");
    alexa.utter("what time did jim last feed")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("jim last fed at");
            done();
        });
})

it("should get the hours right, bloomin GMT", async (done) => {
    let now = moment(new Date());
    console.log('time now ' + now.format() + " - hours = " + now.hours());

    await alexa.utter("she's eating");
    alexa.utter("what time did helen last feed")
        .then((alexaResponse) => {
            let output = alexaResponse.response.outputSpeech.ssml;
            expect(output).toContain("the baby last fed at");
            expect(output).toContain(time.getTime(now));//TODO - this won't always work?!?
            done();
        });
})