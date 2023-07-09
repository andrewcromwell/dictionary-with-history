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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchHistory, setSearchHistory] = useState(null);

  function validateForm() {
    return fields.word.length > 0 && fields.media.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const searchHistory = await postSearch(fields.word, fields.media);
      setIsSubmitted(true);
      setSearchHistory(searchHistory);
    } catch (e) {
      onError(e);
    }
    setIsLoading(false);
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
                    block
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

  function renderSearchResponse() {
    return (
        <div className="SearchHistory">
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                <a href={"https://en.wiktionary.org/wiki/" + fields.word + "#German"} className="ms-2 fw-bold">Wiktionary</a>
            </ListGroup.Item>
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                <span className="ms-2 fw-bold">You've searched this word {searchHistory.numberOfLookups} time(s)</span>
            </ListGroup.Item>
            {searchHistory.lookups.map(({ lookupDate, mediaContent }) => (
                <ListGroup.Item action className="text-nowrap text-truncate">
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
    <div className="Search">
      {isSubmitted ? renderSearchResponse() : renderSearchPage()}
    </div>
  );
}
