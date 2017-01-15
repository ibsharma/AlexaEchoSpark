

var sparkDeveloperUrl = 'https://api.ciscospark.com/v1';
var sparkAccessToken = null;

// Check null or None
getMethod = (getParam, getData = null) => {
  if(sparkAccessToken == null) {
    return "Invalid Request, Access token required.";
  } else {
    if(getParam == 'rooms') {
      if(getData == null) {
        var url = sparkDeveloperUrl + '/' + getParam + '/';
        return getRequest(url, sparkAccessToken);
      }
      // TO DO : check if getData instanceof dict ?
      if('roomId' in getData && 'showSipAddress' in getData && getData instanceof dict) {
        var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.roomId + '?' + 'showSipAddress=' + getData.showSipAddress;
        return getRequest(url, sparkAccessToken);
      }
      if('roomId' in getData && getData instanceof dict) {
        var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.roomId;
        return getRequest(url, sparkAccessToken);
      } else if(getData instanceof dict) {
       // TO DO : substitute urllib
        var encodedData = urllib.urlencode(getData)
        var url = sparkDeveloperUrl + '/' + getParam + '/' + '?' + encodedData;
        return getRequest(url, sparkAccessToken);
      }
    } else if(getParam == 'messages') { // TO DO : Check exact usage here
        if('messageId' in getData && getData instanceof dict) {
          var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.messageId;
          return getRequest(url, sparkAccessToken);
        } else if(getData instanceof dict) {
       // TO DO : substitute urllib
          var encodedData = urllib.urlencode(getData)
          var url = sparkDeveloperUrl + '/' + getParam + '/' + '?' + encodedData;
          return getRequest(url, sparkAccessToken);
        } else {
          return "Unsupported request";
        }
    } else {
      return "Unsupported request";
    }
    return "Unsupported request";
  }

}

postMethod = (postParam, postData) => {
  if(sparkAccessToken == null) {
    return "Invalid Request, Access token required.";
  } else {
    if(postParam == 'messages') {
      // TO DO : find a better way to use isSubset
      // check if isSubset and instanceof
      if((_.some(postData, function(val) { return _.isEqual(val, {'roomId', 'text'});})) 
        && (postData instanceof dict)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else if((_.some(postData, function(val) { return _.isEqual(val, {'toPersonId', 'text'});})) 
        && (postData instanceof dict)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else if((_.some(postData, function(val) { return _.isEqual(val, {'toPersonEmail', 'text'});})) 
        && (postData instanceof dict)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else {
        return "Unsupported request";
      }
    }
}


// Helpers

getRequest = (requestUrl, accessToken) => {

}

postRequest = () => {

}