export function parseWiktionaryDefinition(wikiDefinition) {
    const justTheGermanDefinition = getJustTheGermanDefinition(wikiDefinition);
    if (justTheGermanDefinition != "") {
        const germanDefinitionParsed = parseGermanDefinition(justTheGermanDefinition);
        return germanDefinitionParsed;
    }

    return "";
}

function getJustTheGermanDefinition(wikiDefinition) {
    const germanRegex = /==German==/g;
    if (wikiDefinition.match(germanRegex)) {
        const languageRegex = /^==[a-zA-Z ]+==$/gm;
        const languageSections = wikiDefinition.split(languageRegex);
        const languages = [...wikiDefinition.matchAll(languageRegex)].map(x => x[0]);


        const germanIndex = languages.indexOf("==German==");
        const germanSection = languageSections[germanIndex + 1];

        return germanSection.trim();

    } else {
        return "";
    }
}

function parseGermanDefinition(germanDefinition) {
    var result = {
        definitions: []
    };
    const subSectionRegex = /^====?[a-zA-Z ]+====?$/gm;
    const subSections = germanDefinition.split(subSectionRegex);
    const subSectionHeaders = [...germanDefinition.matchAll(subSectionRegex)].map(x => x[0].replaceAll("=", ""));

    const zippedSections = subSectionHeaders.map(function (e, i) {
        return [e, subSections[i + 1]];
    });

    const partsOfSpeech =
        ["Conjunction", "Noun", "Verb", "Adjective",
            "Preposition", "Adverb", "Interjection", "Pronoun"];
    for (const subsectionHeaderIndex in zippedSections) {
        const subSectionHeader = zippedSections[subsectionHeaderIndex][0];
        const subSection = zippedSections[subsectionHeaderIndex][1];
        const partOfSpeechIndex = partsOfSpeech.indexOf(subSectionHeader);
        if (partOfSpeechIndex == -1)
            continue;

        const meaningRegex = /^# (.*)$/gm;
        const definitions = [...subSection.matchAll(meaningRegex)].map(x => x[1]);

        const partOfSpeechResult = {
            partOfSpeech: partsOfSpeech[partOfSpeechIndex].replace(/=/g, ""),
            meanings: definitions.map(x => {
                var retVal = x.replace(/[\[\]]/g, "")
                    .replace(/\{\{m\|mul\|([a-zA-Z ]+?)\}\}/g, "$1")
                    .replace(/\{\{ngd\|([^}]+?)\}\}/g, "$1")
                    .replace(/\{\{gloss\|([^}]+?)\}\}/g, "($1)")
                    .replace(/\{\{non-gloss definition\|([^}]+?)\}\}/g, "$1")
                    .replace(/\{\{\+preo\|de\|(\w+)\|(accusative|dative|genitive)\}\}/g, "[+ $1 ($2)]")
                    .replace(/#\w+\|\w+/g, "")
                    .trim();

                const lbDeTemplates = [...retVal.matchAll(/\{\{lb\|de\|([a-zA-Z _|+]+?)\}\}/g)].map(x => {
                    return {
                        wholeTemplate: x[0],
                        innerText: x[1]
                    };
                }
                );
                for (const lbDeIndex in lbDeTemplates) {
                    const lbDe = lbDeTemplates[lbDeIndex].innerText;
                    const notes = lbDe.split(/\|/g);
                    const commafiedNotes = notes.join(", ");
                    const replacementText = "(" + commafiedNotes + ")";
                    retVal = retVal.replaceAll(lbDeTemplates[lbDeIndex].wholeTemplate, replacementText);
                }
                return retVal;
            })
        };

        result.definitions.push(partOfSpeechResult);
    }
    return result;
}