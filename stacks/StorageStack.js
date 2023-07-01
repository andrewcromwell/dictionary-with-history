import { Table } from "sst/constructs";

export function StorageStack({ stack, app }) {
  // Create the DynamoDB table
  const table = new Table(stack, "DictionaryLookup", {
    fields: {
      userId: "string",
      word: "string",
      numberOfLookups: "number"
      /*
         The media content and timestamp will also be stored, but
         these will go into a list, and don't need to be specified on
         the table definition. DynamoDB isn't like SQL - we can add
         whatever columns we want, on the fly.
      */
    },
    primaryIndex: { partitionKey: "userId", sortKey: "word" },
    globalIndexes: {
        "GS1": { partitionKey: "userId", sortKey: "numberOfLookups" }
    },
  });

  return {
    table,
  };
}
