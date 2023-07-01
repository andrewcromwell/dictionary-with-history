import { Table } from "sst/node/table";
import handler from "@dictionary-with-history/core/handler";
import dynamoDb from "@dictionary-with-history/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = "123";
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
  // return the created/updated item
  return params.Item;
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