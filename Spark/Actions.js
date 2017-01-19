echoSparkRecents = (roomVal) => {

	var spark = require('Spark.js');
	var roomsListDict = spark.getMethod('rooms');
	var speechOutput = "";
	var roomId;
	if (roomsListDict != "Error") 
	{
		var roomsListParsed = [];
		var roomsMatchList = [];
		var roomsString = "";

		for(var room in roomsListDict.items)
		{
			roomsListParsed.push({'Name': room.title, 'ID':  room.id});
			roomsMatchList.push(room.title);
			roomsString = roomsString + room.title + "\n";
		}
		console.log("This is the List of Rooms For the User:\n" + roomsString);
		console.log("Finding Closest Match...");
		var roomMatch = "";
		console.log("Closest Match for Room Title is: "+roomMatch);
        var stricmp = roomsMatchList.toString().toLowerCase();
		if(stricmp.indexOf(roomVal.toLowerCase())>-1)
		{
			roomMatch = roomVal;
			for(var room in roomsListParsed)
				if(room.Name == roomMatch)
					roomId = room.ID;
			console.log("Room ID is: "+roomId);

			var whatsNewResponse = spark.getMethod('messages', {'roomId': roomId, 'max': '3'});
			if(whatsNewResponse != 'Error')
			{
	 			if(whatsNewResponse.items.length > 0)
	 			{
					var whatsNewList = [];
					for(var messageInfoDict in whatsNewResponse.items)
					{
						var whatsNewDict = {};
						if(messageInfoDict.hasownProperty('text') && messageInfoDict.hasownProperty('personId') && messageInfoDict.personId != "") 
						{
							var messageText = messageInfoDict.text;
							var personId = messageInfoDict.personId;
							var displayNameDict = spark.getMethod('people', {'personId': personId});
							var displayName;
							if(displayNameDict.hasownProperty('displayName') && displayNameDict.displayName !="") 
								displayName = displayNameDict.displayName.replace('\([^)]*\)', '');
							else
								displayName = 'Unknown';
							whatsNewDict = {'Name': displayName, 'Message': messageText};
							whatsNewList.push(whatsNewDict)
						}
						else
							continue;
					}

					console.log("Constructing Alexa Speech Output...");
					speechOutput = "Your most recent messages in spark room " + ": " + roomMatch;
					for(var item in range(whatsNewList.length - 1, -1, -1)) 
					{
						if(item == whatsNewList.length - 1)
							speechOutput = speechOutput + ". Message from " + whatsNewList[item].Name + " .. " + whatsNewList[item].Message; 
						if(item == whatsNewList.length - 2)
							speechOutput = speechOutput + ". Followed by message from " + whatsNewList[item].Name + " .. " + whatsNewList[item].Message;
						if(item == whatsNewList.length - 3)
							speechOutput = speechOutput + ". And finally, from " + whatsNewList[item].Name + " .. " + whatsNewList[item].Message;
					}
				
	 			}
	 			else
	 			{
					console.log("There Are No Messages In This Room");
					speechOutput = "Unfortuantely, there are no messages in spark room: " + roomMatch;
				}
			}
			else
			{
				console.log("There was an issue connecting to Cisco Spark. Please try again in a few minutes.");
				speechOutput = "There was an issue connecting to Cisco Spark. Please try again in a few minutes.";
			}
		}
		else
		{
			console.log("Inappropriate Match");
			speechOutput = "I could not find an appropriate match for the room you mentioned. Please try again.";
		}
	}
	else
	{
		console.log("There was an issue connecting to Cisco Spark. Please try again in a few minutes.");
		speechOutput = "There was an issue connecting to Cisco Spark. Please try again in a few minutes.";
	}
	return speechOutput;
}

recentActivity = () => {

	var spark = require('Spark.js');
	var roomsListDict = spark.getMethod('rooms');
	var speech_output = "";
	if (roomsListDict != "Error") 
	{
		var roomsListParsed = [];
		var lastActivityList = [];
		var roomsString = "";

		for(var roomItem in roomsListDict.items)
		{
			roomsListParsed.push({'Name': roomItem.title, 'ID':  roomItem.id, 'Last Activity': roomItem.lastActivity });
			lastActivityList.push(roomItem.lastActivity);
			roomsString = roomsString + roomItem.title + "\n";
		}
		console.log("This is the List of Rooms For the User:\n" + roomsString);
		console.log("Determining the Rooms With the Most Recent Activity (Up to 5)");
		var lastActivityListParsed = [];

		for(var iteration in range(0,5))
		{
			var mostRecentActivity = Math.max.apply(null, lastActivityList);
			var mostRecentActivityIndex = lastActivityList.indexOf(mostRecentActivity);
			lastActivityListParsed.push(mostRecentActivity);
			lastActivityList.pop(mostRecentActivityIndex);
		}
		var roomListLastActivity = [];
		var roomsStringLastActivity = "";
		var roomIndex = 0;
		speech_output = "You have recent activity in the following last five spark rooms: . ";

		for(var lastActivity in lastActivityListParsed)
		{
			for(var room in roomsListParsed)
			{
				if(room['Last Activity'] == lastActivity)
				{
					roomListLastActivity.push(room);
					speech_output = speech_output + " , " + roomListLastActivity[roomIndex].Name; 
					roomsStringLastActivity = roomsStringLastActivity + roomListLastActivity[roomIndex].Name + "\n";
					roomIndex = roomIndex + 1;
				}
			}
		}
		console.log("This is the List of Rooms With the Most Recent Activity (Up to 5):\n" + roomsStringLastActivity);
		console.log("Alexa Speech Output is: " + speech_output);
	}
	else
		speech_output = "There was an issue connecting to Cisco Spark. Please try again in a few minutes.";

	return speech_output;
}

echoSparkConfirmRoomToMessage = (roomVal) => {

	var spark = require('Spark.js');
	var roomsListDict = spark.getMethod('rooms');
	var speechOutput = "";
	var roomIdValue;
	if(roomsListDict != 'Error')
	{
		var roomsListParsed = [];
		var roomsMatchList = [];
		var roomsString = "";
		
		for(var room in roomsListDict.items)
		{
			roomsListParsed.push({'Name': room.title, 'ID':  room.id});
			roomsMatchList.push(room.title);
			roomsString = roomsString + room.title + "\n";
		}
		console.log("This is the List of Rooms For the User:\n" + roomsString);
		console.log("Finding Closest Match...");
		var roomMatch = ""; 
        var stricmp = roomsMatchList.toString().toLowerCase();
		if(stricmp.indexOf(roomVal.toLowerCase())>-1)
		{
			roomMatch = roomVal;
			console.log("Closest Match for Room Title is: "+roomMatch);
			for(var room in roomsListParsed)
			{
				if(room.Name == roomMatch)
					roomIdValue = room.ID;
			}
		//	speechOutput = "Post Message to Spark Room: " + roomMatch + " . Shall I proceed?";
		}
		else
		{
		//	speechOutput = "I'm not sure what your spark room is. You can try again.";
			roomIdValue = null; 
		}
	}

	else
	{
		//speechOutput = "There is a problem connecting to the Cisco Spark. Please try again in a few minutes.";
		roomIdValue = null; 
	}
	return roomIdValue; //????
}

echoSparkSendMessage = (messageVal, postRoomIdVal) => { 
	
	var spark = require('Spark.js');
	var postResponse = spark.postMethod('messages', {'roomId': postRoomIdVal, 'text': messageVal});
	var speechOutput = "";
	if(postResponse != 'Error')
	{
		speechOutput = "Posting your message";
		return speechOutput;
	}
	else
	{
		speechOutput = "There is a problem connecting to Cisco Spark. Please try again in a few minutes.";
		return speechOutput;
	}
}

range = (start, stop, step=1) => {
  var a=[start], b=start;
  while(b<stop){b+=step;a.push(b)}
  return a;
};