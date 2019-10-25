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

describe(`about when the baby last fed`, () => {
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

    xit("should get the hours right, bloomin GMT", async (done) => {
        let now = moment(new Date());
        console.log('time now ' + now.format() + " - hours = " + now.hours());

        await alexa.utter("she's eating");
        alexa.utter("what time did helen last feed")
            .then((alexaResponse) => {
                let output = alexaResponse.response.outputSpeech.ssml;
                expect(output).toContain("the baby last fed at");
                expect(output).toContain(time.getTime(now)); //TODO - this won't always work?!?
                done();
            });
    })
})

describe(`about rubbish bin collection`, () => {
    const inputBuilder = ({
        state = defaultState,
        type = defaultType,
        intent = defaultIntent,
        newSession = false,
        supportedInterfaces = {
            AudioPlayer: {}
        }
    } = {}) => {
        this.currentState = state || defaultState;
        return {
            requestEnvelope: {
                version: '1.0',
                session: {
                    new: newSession,
                    sessionId: 'amzn1.echo-api.session.c0fa2984-f318-46bf-a5d1-a1720ceda19a',
                    application: {},
                    attributes: state,
                    user: {
                        userId: '0235ad7c77fb46564cd2a1d0d4b23c81bb63ac8aa1f3b50a9fc0fbf511aacb59'
                    }
                },
                context: {
                    System: {
                        device: {
                            deviceId: 'amzn1.ask.device.AGTAMALUGJOA3PUTWBRNVZIIWJDH66IQWMAOMZAPHLES3SBGQTBC6Q3KS66WNTNVLISTRH6VEDHCIXXSFOXKMRU3P2BPHOL5EAL53N3D7RYMBTZWB6OKEZDP7P3ND3FLBNTOIDVQDISMREAPVTNP5TUTQLUA',
                            supportedInterfaces
                        }
                    }
                },
                request: {
                    type,
                    requestId: 'amzn1.echo-api.request.aa270596-a198-466a-98ad-8cc95e05774c',
                    timestamp: '2018-06-20T15:33:31Z',
                    locale: 'en-GB',
                    intent
                }
            },
            attributesManager: {
                setSessionAttributes: newState => {
                    this.currentState = {
                        ...this.currentState,
                        ...newState
                    };
                },
                getSessionAttributes: () => this.currentState
            },
            responseBuilder: ResponseFactory.init()
        };
    };

    const testBinCollections = {
        "2018-10-01": ["Dirty"],
        "2018-10-08": ["Paper", "Garden"],
        "2018-10-15": ["Dirty"],
        "2018-10-22": ["Plastic", "Garden"],
        "2018-10-29": ["Dirty"],
        "2018-11-05": ["Paper", "Garden"],
        "2018-11-12": ["Dirty"],
        "2018-11-19": ["Plastic", "Garden"],
        "2018-11-26": ["Dirty"],
        "2018-12-03": ["Paper", "Garden"],
        "2018-12-10": ["Dirty"],
        "2018-12-17": ["Plastic", "Garden"],
        "2018-12-24": ["Dirty"],
        "2018-12-31": ["Paper", "Garden"]
    }

    // beforeAll(async (handlerInput) => {
    //     // let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    //     // persistentAttributes.binCollections = testBinCollections;
    //     // handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
    //     // await handlerInput.attributesManager.savePersistentAttributes();
    // })

    it.skip("should get the slot for the bins skill for the correct 'time of week'", (done) => {

        alexa.utter("which bins should go out next week")
            .then((alexaResponse) => {
                let output = alexaResponse.response.outputSpeech.ssml;
                expect(output).toContain("You haven't told me about NEXT_WEEK yet.");
                done();
            });
    })
})