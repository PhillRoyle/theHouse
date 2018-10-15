/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const time = require("./timeThings");
const moment = require("moment-timezone");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to The House';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Entered The House', speechText)
      .getResponse();
  },
};

const BabyLastAteAtIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'BabyLastAteAtIntent';
  },
  async handle(handlerInput) {
    let speechText = "OK, I'll remember that.";
    const babyNameSlot = handlerInput.requestEnvelope.request.intent.slots.babyName.value;

    let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    persistentAttributes.babyName = (babyNameSlot) ? babyNameSlot : 'the baby';
    persistentAttributes.fedAtTimestamp = moment.tz(new Date(), 'Europe/London').format();

    handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Baby last ate', speechText)
      .getResponse();
  },
};

const WhenBabyLastAteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WhenBabyLastAteIntent';
  },
  async handle(handlerInput) {
    let speechText = "You haven't told me yet.";
    let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    let savedBabyName = persistentAttributes.babyName;
    if (savedBabyName) {
      let savedTime = time.getTime(moment.tz(persistentAttributes.fedAtTimestamp, 'Europe/London'));
      speechText = `${savedBabyName} last fed at ${savedTime}`;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('When did baby last eat', speechText)
      .getResponse();
  },
};

const getTheBinsSpeech = (whichWeek, thisWeekBinsList) => {
  let binSpeech = null;
  if (thisWeekBinsList) {
    binSpeech = `${whichWeek}, the ${thisWeekBinsList.join(`and`).toString()} will be collected.`
  } else {
    binSpeech = `You haven't told me yet.`;
  }
  return binSpeech;
}

const WhichBinsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WhichBinsIntent';
  },
  async handle(handlerInput) {
    let timeOfWeek = handlerInput.requestEnvelope.request.intent.slots.timeOfWeek.resolutions.resolutionsPerAuthority[0].values[0].value.id || 'THIS_WEEK';

    let weekCommencing = time.whichWeekIsIt(moment(), timeOfWeek);
    console.log("========> week commencing = " + weekCommencing.format());

    let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    console.log("========> persistentAttributes = " + persistentAttributes);
    console.log("========> persistentAttributes = " + JSON.parse(persistentAttributes));
    console.log("========> persistentAttributes = " + JSON.parse(persistentAttributes).binCollections);
    // let binCollections = persistentAttributes.binCollections;
    let binCollections = JSON.stringify(persistentAttributes.binCollections);

    //TODO - match week commencing to binCollections - might be better not to have a set of objects in the json....
    console.log("========> binCollections = " + binCollections);

    let thisWeekBinsList = binCollections.weekCommencing;

    console.log("========> this week's bins = " + thisWeekBinsList);

    return handlerInput.responseBuilder
      .speak(getTheBinsSpeech(timeOfWeek, thisWeekBinsList))
      .withSimpleCard('which bins is it?', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    BabyLastAteAtIntentHandler,
    WhenBabyLastAteIntentHandler,
    WhichBinsIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName("whenBabyFed")
  .withAutoCreateTable(true)
  .lambda();