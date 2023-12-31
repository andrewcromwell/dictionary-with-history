import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./Search.css";
import { API } from "aws-amplify";
import ListGroup from "react-bootstrap/ListGroup";

export default function Search() {
  const [fields, handleFieldChange] = useFormFields({
    word: "",
    media: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState(null);

  function validateForm() {
    return fields.word.length > 0 && fields.media.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const searchResponse = await postSearch(fields.word, fields.media);
      addKeys(searchResponse);
      setSearchResponse(searchResponse);
      fields.word = "";
      fields.media = "";
    } catch (e) {
      onError(e);
    }
    setIsLoading(false);
  }

  function addKeys(searchResponse){
    if (searchResponse.definition && !searchResponse.definition.error && searchResponse.definition.definitions){
      searchResponse.definition.definitions =
        searchResponse.definition.definitions.map(x =>
          {
            var definition = { ...x, key: crypto.randomUUID() };
            if (definition.meanings){
              definition.meanings = definition.meanings.map(y => { return { meaning: y, key: crypto.randomUUID() } });
            }
            return definition;
          });
    }

    if (searchResponse.lookupInfo && searchResponse.lookupInfo.lookups){
      searchResponse.lookupInfo.lookups =
        searchResponse.lookupInfo.lookups.map(x => { return { ...x, key: crypto.randomUUID() }});
    }
  }

  function postSearch(searchTerm, media) {
    const body = {
        word: searchTerm,
        media: media,
    };

    return API.post("dictionary-with-history", "/lookup-word", {
      body: body,
    });
  }

  function renderSearchPage() {
    return (
        <div className="Search">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="word">
              <Form.Label>Search Term</Form.Label>
              <Form.Control
                value={fields.word}
                type="text"
                as="input"
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="media">
              <Form.Label>Media Content</Form.Label>
              <Form.Control
                value={fields.media}
                type="text"
                as="input"
                onChange={handleFieldChange}
              />
            </Form.Group>
            <div className="d-grid gap-2 mt-3">
                <LoaderButton
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Search
                </LoaderButton>
            </div>
          </Form>
        </div>
      );
  }

  function showDefinition(word, definition) {
    if (definition.error){
      return (
        <>
          <span className="text-muted">{definition.error}</span>
        </>
      );
    }
    return (
      <>
      <p className="h2">{word}</p>
        {searchResponse.definition.definitions.map(({ partOfSpeech, meanings, key }) => (
          <div key={key}>
            <span className="fw-bold">{partOfSpeech.trim()}</span>
            <br />
            <ol>
              {meanings.map(m => (
                <li key={m.key}>
                  <span className="text-muted">
                  {m.meaning.trim()}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </>
    );
  }
  function renderSearchResponse() {
    const definitionDisplay = showDefinition(searchResponse.word, searchResponse.definition);
    const searchHistory = searchResponse.lookupInfo;
    return (
        <div className="SearchHistory">
            {definitionDisplay}
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                <a href={"https://en.wiktionary.org/wiki/" + searchResponse.word + "#German"} className="ms-2 fw-bold">Wiktionary</a>
            </ListGroup.Item>
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                <span className="ms-2 fw-bold">You've searched this word {searchHistory.numberOfLookups} time(s)</span>
            </ListGroup.Item>
            {searchHistory.lookups.map(({ lookupDate, mediaContent, key }) => (
                <ListGroup.Item action className="text-nowrap text-truncate" key={key}>
                    <span className="text-muted">Media Content: {mediaContent.trim()}</span>
                    <br />
                    <span className="text-muted">
                    Searched on: {new Date(lookupDate).toLocaleString()}
                    </span>
                </ListGroup.Item>
            ))}
        </div>
      );
  }

  return (
    <>
    <div id="Search">
      {renderSearchPage()}
    </div>
    <div id="Results">
      {searchResponse ? renderSearchResponse() : <></>}
    </div>
    </>
  );
}
