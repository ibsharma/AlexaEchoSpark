
var request = require('request');
var sparkDeveloperUrl = 'https://api.ciscospark.com/v1';
var sparkAccessToken = null;

getMethod = (getParam, getData = null) => {
  if(sparkAccessToken == null) {
    return "Invalid Request, Access token required.";
  } else {
    if(getParam == 'rooms') {
      if(getData == null) {
        var url = sparkDeveloperUrl + '/' + getParam + '/';
        return getRequest(url, sparkAccessToken);
      }
      if(getData.hasOwnProperty(roomId) && getData.hasOwnProperty('showSipAddress') && getData instanceof Map) {
        var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.roomId + '?' + 'showSipAddress=' + getData.showSipAddress;
        return getRequest(url, sparkAccessToken);
      }
      if(getData.hasOwnProperty(roomId) && getData instanceof Map) {
        var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.roomId;
        return getRequest(url, sparkAccessToken);
      } else if(getData instanceof Map) {
        var encodedData = encodeQueryData(getData)
        var url = sparkDeveloperUrl + '/' + getParam + '/' + '?' + encodedData;
        return getRequest(url, sparkAccessToken);
      }
    } else if(getParam == 'messages') { 
        if(getData.hasOwnProperty('messageId') && getData instanceof Map) {
          var url = sparkDeveloperUrl + '/' + getParam + '/' + getData.messageId;
          return getRequest(url, sparkAccessToken);
        } else if(getData instanceof Map) {
          var encodedData = encodeQueryData(getData)
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
      // TO DO : 
      // check if isSubset and instanceof
      if((_.some(postData, function(val) { return _.isEqual(val, {'roomId', 'text'});})) 
        && (postData instanceof Map)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else if((_.some(postData, function(val) { return _.isEqual(val, {'toPersonId', 'text'});})) 
        && (postData instanceof Map)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else if((_.some(postData, function(val) { return _.isEqual(val, {'toPersonEmail', 'text'});})) 
        && (postData instanceof Map)) {
          var url = sparkDeveloperUrl + '/' + postData + '/';
          return postRequest(url, sparkAccessToken, postData);
      } else {
        return "Unsupported request";
      }
    }
}


// Helpers

encodeQueryData = (data) => {
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}

getRequest = (requestUrl, accessToken) => {

  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization':'Bearer ' + accessToken
  };
  request({headers: headers, uri: requestUrl}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return JSON.parse(body);
    }
    else
      return "Error";
  });
};

postRequest = (requestUrl, accessToken, postBody) => {
  var json_postBody = JSON.parse(postBody);
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization':'Bearer ' + accessToken
  };
  request({headers: headers, uri: requestUrl, body: json_postBody, method:'POST'}, function (error, response, body){
    if (!error && response.statusCode == 200) {
      return body;
    }
    else
      return "Error";
  });
};
