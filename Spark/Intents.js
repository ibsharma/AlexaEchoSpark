require ('Actions.js');

getRecents = (intent, intentSession) => {
	if(intent.slots.Room.hasOwnProperty('value')) {
		var roomValue = intent.slots.Room.value;
		if(attributes in intentSession) {
			// TO DO : What does -1 represent?
			var recentIntent = intentSession.attributes.intentSequence.-1;
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage'];

			if(permissibleIntents.hasOwnProperty(recentIntent)) {
				intentSession.attributes.intentSequence.append('echoSparkRecents');
				var sessionAttribute = intentSession.attributes;
				var output = Actions.echoSparkRecents(roomValue);// Other file
				var shouldEndSession = false;
			} else {
				var sessionAttribute = intentSession.attributes;
				var output = "Can you repeat that, please";
				var shouldEndSession = false;
			}
		} else {
			var sessionAttribute = {'intentSequence': ['echoSparkRecents']};
			intentSession.attributes = sessionAttribute;
			var output = Actions.echoSparkRecents(roomValue);// Other file
			var shouldEndSession = false;
		}
	} else {
		if(intentSession.hasOwnProperty('attributes')) {
			sessionAttribute = intentSession.attributes;
		} else {
			var  sessionAttribute = {};
		}
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getConfirmRoomToMessage = (intent, intentSession) => {
	if(intent.slots.Room.hasOwnProperty('value')) {
		var roomValue = intent.slots.Room.value;
		if(intentSession.hasOwnProperty('attributes')) {
			var recentIntent = intentSession.attributes.intentSequence.-1;
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage'];
			if(permissibleIntents.hasOwnProperty(recentIntent)) {
				intentSession.attributes.intentSequence.append('echoSparkConfirmRoomToMessage');
				var sessionAttribute = intentSession.attributes;
				var output = Actions.echoSparkConfirmRoomToMessage(roomValue);
				intentSession.attributes.echoSparkConfirmRoomToMessage = {'roomId': output};
				var sessionAttribute = intentSession.attributes;
				var shouldEndSession = false;
			} else {
				var sessionAttribute = intentSession.attributes;
				var output = "Can you repeat that, please";
				var shouldEndSession = false;
			}
		} else {
			var sessionAttribute = {'intentSequence': ['echoSparkConfirmRoomToMessage']};
			intentSession.attributes = sessionAttribute;
			var output = Actions.echoSparkConfirmRoomToMessage(roomValue);
			intentSession.attributes.echoSparkConfirmRoomToMessage = {'roomId': output};
			var sessionAttribute = intentSession.attributes;
			var shouldEndSession = false;
		}
	} else {
		if(attributes in intentSession) {
			var sessionAttribute = intentSession.attributes;
		} else {
			var  sessionAttribute = {};
		}
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getSendMessage = (intent, intentSession) => {

}