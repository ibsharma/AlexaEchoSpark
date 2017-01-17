require ('Actions.js');

getRecents = (intent, intentSession) => {
	if(intent.slots.Room.hasOwnProperty('value')) {
		var roomValue = intent.slots.Room.value;
		if(intentSession.hasOwnProperty('attributes')) {
			// TO DO : What does -1 represent?
			var recentIntent = intentSession.attributes.intentSequence.-1;
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage', 'echoSparkRoomDecline','echoSparkValueConfirm'];

			if(permissibleIntents.hasOwnProperty(recentIntent)) {
				intentSession.attributes.intentSequence.append('echoSparkRecents');
				var sessionAttribute = intentSession.attributes;
				var output = Actions.echoSparkRecents(roomValue);
				var shouldEndSession = false;
			} else {
				var sessionAttribute = intentSession.attributes;
				var output = "Can you repeat that, please";
				var shouldEndSession = false;
			}
		} else {
			var sessionAttribute = {'intentSequence': ['echoSparkRecents']};
			intentSession.attributes = sessionAttribute;
			var output = Actions.echoSparkRecents(roomValue);
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
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage', 'echoSparkRoomDecline','echoSparkValueConfirm'];
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
		if(intentSession.hasOwnProperty('attributes')) {
			var sessionAttribute = intentSession.attributes;
		} else {
			var sessionAttribute = {};
		}
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getSendMessage = (intent, intentSession) => {
	if(intent.slots.Message.hasOwnProperty('Message') 
		&& intentSession.hasOwnProperty('attributes')) {

		var recentIntent = intentSession.attributes.intentSequence.-1;
		var message = intent.slots.Message.value;

		if((recentIntent == "echoSparkRoomConfirm" || recentIntent == "echoSparkValueDecline") &&
		  intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('sendMessageValue');
			intentSession.attributes.echoSparkConfirmRoomToMessage.message = message;
			var sessionAttribute = intentSession.attributes;
			var output = "The message is" + message + " Should I send it";
			var shouldEndSession = false;
		} else {
			var sessionAttribute = intentSession.attributes;
			var output = "Can you repeat that, please";
			var shouldEndSession = false;
		}
	} else {
		var  sessionAttribute = {};
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getYesIntent = (intent, intentSession) => {
	if(intentSession.hasOwnProperty('attributes')) {
		var recentIntent = intentSession.attributes.intentSequence.-1;
		// TO DO : Check this if condition
		if((recentIntent == "sendMessageValue") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null &&
			intentSession.attributes.echoSparkConfirmRoomToMessage.message) {
			intentSession.attributes.intentSequence.append('echoSparkValueConfirm');
			var sessionAttribute = intentSession.attributes;
			var roomId = intentSession.attributes.echoSparkConfirmRoomToMessage.roomId;
			var message = intentSession.attributes.echoSparkConfirmRoomToMessage.message;
			var output = Actions.echoSparkSendMessage(message, roomId);
			var shouldEndSession = false;

		} else if((recentIntent == "echoSparkConfirmRoomToMessage") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('echoSparkRoomConfirm');
			var sessionAttribute = intentSession.attributes;
			var output = Actions.echoSparkSendMessage(message, roomId);
			var shouldEndSession = false;
		} else {
			var sessionAttribute = intentSession.attributes;
			var output = "Can you repeat that, please";
			var shouldEndSession = false;
		}
	} else {
		var  sessionAttribute = {};
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getNoIntent = (intent, intentSession) => {
	if(intentSession.hasOwnProperty('attributes')) {
		var recentIntent = intentSession.attributes.intentSequence.-1;
		// TO DO : Check this if condition
		if((recentIntent == "sendMessageValue") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null &&
			intentSession.attributes.echoSparkConfirmRoomToMessage.message) {
			intentSession.attributes.intentSequence.append('echoSparkValueDecline');
			delete intentSession.attributes.echoSparkConfirmRoomToMessage.message;
			var sessionAttribute = intentSession.attributes;
			var output = "You can say stop or cancel to exit";
			var shouldEndSession = false;

		} else if((recentIntent == "echoSparkConfirmRoomToMessage") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('echoSparkRoomDecline');
			var sessionAttribute = intentSession.attributes;
			delete intentSession.attributes.echoSparkConfirmRoomToMessage
			var output = "Canceled. You can ask something else now";
			var shouldEndSession = false;
		} else {
			var sessionAttribute = intentSession.attributes;
			var output = "Can you repeat that, please";
			var shouldEndSession = false;
		}
	} else {
		var  sessionAttribute = {};
		var output = "Can you repeat that, please";
		var shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute); 
}
