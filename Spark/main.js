require ('Spark.js');
require ('Intents.js');
require ('Actions.js');


exports.handler = (event, context, callback) => {

	var sparkAccessToken = MjYyZThjZGQtNTlhMS00ZTI5LWJlZTEtYjVhZDUzODY1YWU1YTJhZDY2ZjYtNTA2;

	//TO DO : Invalid app check

	//TO DO : New session check

	event.session.user.accessToken = sparkAccessToken;

	if(event.request.type == "LaunchRequest") {
		// If it contains an accessToken, assign it to sparkAccessToken.
		if (event.session.user.hasOwnProperty('accessToken')) {
			Spark.sparkAccessToken = event.session.user.accessToken;
			return launchHelper(event.request, event.session);
		} else {
			var sessionAttribute = {};
			var output = "Please login into your Cisco Spark developer account";
			shouldEndSession = true;
			return generateResponse((buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
		}
	} else if(event.request.type == "IntentRequest") {
		if (event.session.user.hasOwnProperty(sparkAccessToken)) { // To DO: OwnProperty?
			Spark.sparkAccessToken = event.session.user.accessToken;
			return intentHelper(event.request, event.session);
		} else {
			var sessionAttribute = {};
			var output = "Please login into your Cisco Spark developer account";
			var shouldEndSession = true;
			return generateResponse((buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
		}
	} else if(event.request.type == "SessionEndedRequest") {
		return sessionEndedHelper(event.request, event.session);
	}


// Here come the Helper functions
	launchHelper = (eventRequest, eventSession) => {
		return getResponse();
	}

	intentHelper = (intentRequest, intentSession) => {
		var intent = intentRequest.intent;
		var intentName = intentRequest.intent.name;

		if(intentName == "echoSparkRecents") {
			return Intents.getRecents(intent, intentSession);
		} else if(intentName == "echoSparkConfirmRoomToMessage") {
			return Intents.getConfirmRoomToMessage(intent, intentSession);
		} else if(intentName == "echoSparkSendMessage") {
			return Intents.getSendMessage(intent, intentSession);
		} else if(intentName == "AMAZON.HelpIntent") {
			return getResponse();
		} else if(intentName == "AMAZON.YesIntent") {
			return Intents.getYesIntent(intent, intentSession);
		} else if(intentName == "AMAZON.NoIntent") {
			return Intents.getNoIntent(intent, intentSession);
		} else {
			// Invalid intent
		}

		return getResponse();
	}

	sessionEndedHelper = (eventRequest, eventSession) => {
		// TO DO
		return '';
	}
	getResponse = () => {
		var output = Actions.recentActivity();
		var sessionAttribute = {'intentSequence': ['welcome']};
		var shouldEndSession = false;

		return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
	}
}