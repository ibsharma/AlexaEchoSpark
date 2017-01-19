var Actions = require ('Actions.js');

getRecents = (intent, intentSession) => {
	if(intent.slots.Room.hasOwnProperty('value')) {
		var roomValue = intent.slots.Room.value;
		var sessionAttribute;
		var output;
		var shouldEndSession;

		if(intentSession.hasOwnProperty('attributes')) {
			var recentIntent = intentSession.attributes.intentSequence[intentSession.attributes.intentSequence.length-1];
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage', 'echoSparkRoomDecline','echoSparkValueConfirm'];

			if(permissibleIntents.hasOwnProperty(recentIntent)) {
				intentSession.attributes.intentSequence.append('echoSparkRecents');
				sessionAttribute = intentSession.attributes;
				output = Actions.echoSparkRecents(roomValue);
				shouldEndSession = false;
			} else {
				sessionAttribute = intentSession.attributes;
				output = "Can you repeat that, please";
				shouldEndSession = false;
			}
		} else {
			sessionAttribute = {'intentSequence': ['echoSparkRecents']};
			intentSession.attributes = sessionAttribute;
			output = Actions.echoSparkRecents(roomValue);
			shouldEndSession = false;
		}
	} else {
		if(intentSession.hasOwnProperty('attributes')) {
			sessionAttribute = intentSession.attributes;
		} else {
			sessionAttribute = {};
		}
		output = "Can you repeat that, please";
		shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getConfirmRoomToMessage = (intent, intentSession) => {
	if(intent.slots.Room.hasOwnProperty('value')) {
		var roomValue = intent.slots.Room.value;
		var sessionAttribute;
		var output;
		var shouldEndSession;

		if(intentSession.hasOwnProperty('attributes')) {
			var recentIntent = intentSession.attributes.intentSequence[intentSession.attributes.intentSequence.length-1];
			var permissibleIntents = ['echoSparkRecents','echoSparkConfirmRoomToMessage','echoSparkSendMessage', 'echoSparkRoomDecline','echoSparkValueConfirm'];
			if(permissibleIntents.hasOwnProperty(recentIntent)) {
				intentSession.attributes.intentSequence.append('echoSparkConfirmRoomToMessage');
				sessionAttribute = intentSession.attributes;
				output = Actions.echoSparkConfirmRoomToMessage(roomValue);
				intentSession.attributes.echoSparkConfirmRoomToMessage = {'roomId': output};
				sessionAttribute = intentSession.attributes;
				shouldEndSession = false;
			} else {
				sessionAttribute = intentSession.attributes;
				output = "Can you repeat that, please";
				shouldEndSession = false;
			}
		} else {
			sessionAttribute = {'intentSequence': ['echoSparkConfirmRoomToMessage']};
			intentSession.attributes = sessionAttribute;
			output = Actions.echoSparkConfirmRoomToMessage(roomValue);
			intentSession.attributes.echoSparkConfirmRoomToMessage = {'roomId': output};
			sessionAttribute = intentSession.attributes;
			shouldEndSession = false;
		}
	} else {
		if(intentSession.hasOwnProperty('attributes')) {
			sessionAttribute = intentSession.attributes;
		} else {
			sessionAttribute = {};
		}
		output = "Can you repeat that, please";
		shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getSendMessage = (intent, intentSession) => {

	var sessionAttribute;
	var output;
	var shouldEndSession;

	if(intent.slots.Message.hasOwnProperty('Message') && intentSession.hasOwnProperty('attributes')) {
		var recentIntent = intentSession.attributes.intentSequence[intentSession.attributes.intentSequence.length-1];
		var message = intent.slots.Message.value;
		if((recentIntent == "echoSparkRoomConfirm" || recentIntent == "echoSparkValueDecline") &&
		  intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('sendMessageValue');
			intentSession.attributes.echoSparkConfirmRoomToMessage.message = message;
			sessionAttribute = intentSession.attributes;
			output = "The message is" + message + " Should I send it";
			shouldEndSession = false;
		} else {
			sessionAttribute = intentSession.attributes;
			output = "Can you repeat that, please";
			shouldEndSession = false;
		}
	} else {
		sessionAttribute = {};
		output = "Can you repeat that, please";
		shouldEndSession = false;
	}
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getYesIntent = (intent, intentSession) => {
	var sessionAttribute;
	var output;

	if(intentSession.hasOwnProperty('attributes')) {
		var recentIntent = intentSession.attributes.intentSequence[intentSession.attributes.intentSequence.length-1];
		if((recentIntent == "sendMessageValue") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null &&
			intentSession.attributes.echoSparkConfirmRoomToMessage.message.length !=0 ) {
			intentSession.attributes.intentSequence.append('echoSparkValueConfirm');
			sessionAttribute = intentSession.attributes;
			var roomId = intentSession.attributes.echoSparkConfirmRoomToMessage.roomId;
			var message = intentSession.attributes.echoSparkConfirmRoomToMessage.message;
			output = Actions.echoSparkSendMessage(message, roomId);
		} else if((recentIntent == "echoSparkConfirmRoomToMessage") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('echoSparkRoomConfirm');
			sessionAttribute = intentSession.attributes;
			output = "Would you like to send the message?"
		} else {
			sessionAttribute = intentSession.attributes;
			output = "Can you repeat that, please";
		}
	} else {
		sessionAttribute = {};
		output = "Can you repeat that, please";
	}
	var shouldEndSession = false;
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute);
}

getNoIntent = (intent, intentSession) => {
	var sessionAttribute;
	var output;

	if(intentSession.hasOwnProperty('attributes')) {
		var recentIntent = intentSession.attributes.intentSequence[intentSession.attributes.intentSequence.length-1];
		if((recentIntent == "sendMessageValue") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null &&
			intentSession.attributes.echoSparkConfirmRoomToMessage.message.length != 0) {
			intentSession.attributes.intentSequence.append('echoSparkValueDecline');
			delete intentSession.attributes.echoSparkConfirmRoomToMessage.message;
			sessionAttribute = intentSession.attributes;
			output = "You can say stop or cancel to exit";
		} else if((recentIntent == "echoSparkConfirmRoomToMessage") && intentSession.attributes.echoSparkConfirmRoomToMessage.roomId != null) {
			intentSession.attributes.intentSequence.append('echoSparkRoomDecline');
			sessionAttribute = intentSession.attributes;
			delete intentSession.attributes.echoSparkConfirmRoomToMessage
			output = "Canceled. You can ask something else now";
		} else {
			sessionAttribute = intentSession.attributes;
			output = "Can you repeat that, please";
		}
	} else {
		sessionAttribute = {};
		output = "Can you repeat that, please";
	}
	var shouldEndSession = false;
	return Spark.generateResponse(buildSpeechletResponse(output, shouldEndSession), sessionAttribute); 
}
