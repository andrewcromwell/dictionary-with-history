import { Table } from "sst/node/table";
import handler from "@dictionary-with-history/core/handler";
import dynamoDb from "@dictionary-with-history/core/dynamodb";
import { parseWiktionaryDefinition } from "@dictionary-with-history/core/src/parseWiktionaryDefinition";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const existingWordEntry = await getWordByUserID(userId, data.word);
  var params;
  if (!existingWordEntry){

    params = {
      TableName: Table.DictionaryLookup.tableName,
      Item: {
        // The attributes of the item to be created
        userId: userId, // The id of the user
        word: data.word, // The word being looked up
        numberOfLookups: 1, // Parsed from request body
        lookups: [
          {
            lookupDate: Date.now(),
            mediaContent: data.media
          }
        ],
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

  }
  else {

    params = {
      TableName: Table.DictionaryLookup.tableName,
      Item: existingWordEntry
    };
    params.Item.numberOfLookups++;
    params.Item.lookups.push({
      lookupDate: Date.now(),
      mediaContent: data.media
    });

  }

  await dynamoDb.put(params);

  const definition = await getWiktionaryDefinition(data.word);
  const response = {
    lookupInfo: params.Item,
    definition: definition
  };
  // return the created/updated item
  return response;
});

async function getWordByUserID(userId, word){
  const params = {
    TableName: Table.DictionaryLookup.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: userId, // The id of the user
      word: word, // The word being looked up
    },
  };

  const result = await dynamoDb.get(params);

  // Return the retrieved item, even if it's null
  return result.Item;
}

const https = require('https')
async function getWiktionaryDefinition(word){
  const options = {
    hostname: 'en.wiktionary.org',
    port: 443,
    path: '/w/index.php?action=raw&title=' + encodeURIComponent(word),
    method: 'GET'
  };
  const response = await makeRequest(options);

  // Treat any error like a 404
  if (response.statusCode > 400)
    return {
      error: "Not Found on Wiktionary"
    };

  // parse response
  const parsedResponse = parseWiktionaryDefinition(response.responseBody);
  return parsedResponse;
}


function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          responseBody: responseBody
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}
