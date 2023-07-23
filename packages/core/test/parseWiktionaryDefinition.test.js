import { expect, test } from "vitest";
import { parseWiktionaryDefinition } from "../src/parseWiktionaryDefinition";

const fs = require('fs');
function content(path) {
    return fs.readFileSync(path, 'utf8');
}

test("Parse a simple Noun", () => {
    const definition = content('./packages/core/test/test-cases/01-Bullauge.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "porthole"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a simple Verb", () => {
    const definition = content('./packages/core/test/test-cases/02-gerinnen.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "to coagulate (become congealed)"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a simple Adjective", () => {
    const definition = content('./packages/core/test/test-cases/03-altklug.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "precocious"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a Verb with multiple definitions", () => {
    const definition = content('./packages/core/test/test-cases/04-aufbereiten.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "to process",
                    "to condition"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});


test("Parse a German adjective which exists in other languages", () => {
    const definition = content('./packages/core/test/test-cases/05-blau.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "blue",
                    "drunk",
                    "bruised"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a German noun which exists in other languages", () => {
    const definition = content('./packages/core/test/test-cases/06-Vater.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "father"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a German noun with some templates", () => {
    const definition = content('./packages/core/test/test-cases/07-Katze.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "house cat, Felis silvestris catus",
                    "(specifically) female house cat",
                    "cat (any member of the genus Felis)",
                    "(constellation, historic) the obsolete constellation Felis"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a pejorative German noun", () => {
    const definition = content('./packages/core/test/test-cases/08-Hund.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "dog, hound",
                    "(pejorative) scoundrel; dog (mean or morally reprehensible person)",
                    "A board with casters used to transport heavy objects."
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a legal German noun", () => {
    const definition = content('./packages/core/test/test-cases/09-Gerichtshof.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "(legal) law court; court of justice"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a dated German adjective", () => {
    const definition = content('./packages/core/test/test-cases/10-marode.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "(dated, of a person) ailing, weak",
                    "ramshackle, run-down, scruffy"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a cooking German verb", () => {
    const definition = content('./packages/core/test/test-cases/11-zubereiten.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "(cooking) to prepare"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a transitive/intransitive German verb", () => {
    const definition = content('./packages/core/test/test-cases/12-essen.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "(transitive) to eat",
                    "(intransitive) to eat; to dine"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a reflexive German verb which is also an adjective", () => {
    const definition = content('./packages/core/test/test-cases/13-verhalten.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "(reflexive) to behave",
                    "(reflexive) to be contradistinguished, to be characterized in relation to its environment; (reflexive, impersonal) to be",
                    "(reflexive, legal, _, jargon) to take a stand, to express an assessment of",
                    "(transitive, reflexive, archaic) to repress, to make more slow",
                    "(reflexive, sport, riding) to parry",
                    "(reflexive, regional) to have a good attitude towards oneself",
                    "(reflexive, Austria, Switzerland) to undertake",
                    "(reflexive, archaic, outside, Switzerland) to close with the hand"
                ]
            },
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "restrained"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse another German verb which is also an adjective", () => {
    const definition = content('./packages/core/test/test-cases/14-ergeben.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "(transitive) to yield, produce",
                    "(reflexive) to surrender",
                    "(reflexive) to arise, result, turn out",
                    "(reflexive, impersonal) to happen"
                ]
            },
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "loyal, devoted, humble, obedient"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse yet another German verb which is also an adjective", () => {
    const definition = content('./packages/core/test/test-cases/15-vergeben.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Verb",
                meanings: [
                    "(transitive, or, intransitive, + dative) to forgive",
                    "(transitive) to assign; to allocate; to give (a job); to give or set (a task); to award (a contract), to give away [+ an (accusative)]"
                ]
            },
            {
                partOfSpeech: "Adjective",
                meanings: [
                    "taken; not free",
                    "(informal) not single: married or in a relationship"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse an adverb which is also a preposition", () => {
    const definition = content('./packages/core/test/test-cases/16-mit.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Preposition",
                meanings: [
                    "with (in the company of; alongside)",
                    "with, by (using as an instrument; by means of)",
                    "with (as an accessory to)",
                    "with (having)",
                    "at (with the age of)",
                    "with, including, with ... included"
                ]
            },
            {
                partOfSpeech: "Adverb",
                meanings: [
                    "among; denotes a belonging of a person or a thing to a group",
                    "also, too (in addition; besides; as well)",
                    "(somewhat, informal) with (something), with it"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse an interjection", () => {
    const definition = content('./packages/core/test/test-cases/17-mein_Gott.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Interjection",
                meanings: [
                    "oh my God",
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a more complicated interjection", () => {
    const definition = content('./packages/core/test/test-cases/18-ach.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Interjection",
                meanings: [
                    "oh, alas (expressing surprise, sorrow, or understanding)",
                    "oh (preceding an offhand or annoyed remark)",
                    "oh (preceding an invocation or address, but rarely a solemn one)"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a conjunction/adverb/interjection", () => {
    const definition = content('./packages/core/test/test-cases/19-also.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Conjunction",
                meanings: [
                    "so, therefore"
                ]
            },
            {
                partOfSpeech: "Adverb",
                meanings: [
                    "then, thus, so, hence (Used to connect a sentence or clause with previous information.)",
                    "Used to introduce additional information about something previously mentioned.",
                    "(dated) thus, in this way"
                ]
            },
            {
                partOfSpeech: "Interjection",
                meanings: [
                    "alright (Indicates agreement with something.)",
                    "so (Used as a lead-in or to start a new topic.)",
                    "Used to resume an interrupted train of thought.",
                    "An intensifier, indicates an emotional connection to the statement."
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a pronoun", () => {
    const definition = content('./packages/core/test/test-cases/20-ich.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Pronoun",
                meanings: [
                    "I (first person singular nominative (subject) pronoun)"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a noun with two separate etymologies", () => {
    const definition = content('./packages/core/test/test-cases/21-Kluft.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        definitions: [
            {
                partOfSpeech: "Noun",
                meanings: [
                    "cleft, fissure, joint",
                    "gap, gulf, rift"
                ]
            },
            {
                partOfSpeech: "Noun",
                meanings: [
                    "uniform, outfit, suit, garb, attire used for a specific activity"
                ]
            }
        ]
    };

    expect(expectedResult).toEqual(parsed);
});

test("Parse a word with no German definition", () => {
    const definition = content('./packages/core/test/test-cases/22-Kund.txt');

    const parsed = parseWiktionaryDefinition(definition);

    const expectedResult = {
        error: "Couldn't retrieve definition. German definition doesn't exist."
    };

    expect(expectedResult).toEqual(parsed);
});