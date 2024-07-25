function fetchAndAnalyzeSentiment() {
  var spreadsheetId = '1yYyRiKZFGM56jZMJ-5jm7wGk-yu9_sG5m9vbbpg89So';  // Replace with your spreadsheet ID
  var sheetName = 'Sheet1';  // Replace with the name of the sheet where you want to write data
  var apiUrl = 'https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/reviews';  // Replace with your API Gateway URL
  var languageApiKey = 'AIzaSyDzaH0x6wjylD7Wyu7YFebqZRikZcFT1Zw';  // Replace with your Google Cloud Natural Language API Key

  try {
    // Fetch data from the API
    var response = UrlFetchApp.fetch(apiUrl);
    var data = JSON.parse(response.getContentText());

    // Open the specified spreadsheet and sheet
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error('Sheet with name "' + sheetName + '" not found');
    }

    // Clear existing content in the sheet
    sheet.clear();

    // Check if data is an array of objects
    if (Array.isArray(data) && data.length > 0) {
      var headers = Object.keys(data[0]).concat(['sentiment', 'sentiment_polarity']); // Add sentiment and sentiment_polarity as new headers
      var rows = data.map(item => {
        var review = item.review;
        var sentimentData = analyzeSentiment(review, languageApiKey);
        return [...Object.values(item), sentimentData.sentiment, sentimentData.polarity];
      });

      // Set headers and data in the sheet
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    } else {
      Logger.log('No data or data is not in expected format');
    }
  } catch (e) {
    Logger.log('Error fetching data: ' + e.message);
  }
}

function analyzeSentiment(text, apiKey) {
  var endpoint = 'https://language.googleapis.com/v1/documents:analyzeSentiment?key=' + apiKey;
  var payload = {
    document: {
      type: 'PLAIN_TEXT',
      content: text
    }
  };

  var options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(endpoint, options);
  var sentimentData = JSON.parse(response.getContentText());

  // Extract sentiment score
  var sentimentScore = sentimentData.documentSentiment.score;
  
  // Determine sentiment label
  var sentimentLabel = 'Neutral';
  if (sentimentScore > 0) {
    sentimentLabel = 'Positive';
  } else if (sentimentScore < 0) {
    sentimentLabel = 'Negative';
  }
  
  return {
    sentiment: sentimentLabel,
    polarity: sentimentScore
  };
}
