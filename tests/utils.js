// count total characters(when space is excluded or has been included)
function getCharaterLength(textInput, excludeSpacesCheckbox = false) {
  if (excludeSpacesCheckbox) {
    return textInput.replace(/\s+/g, "").length;
  } else {
    return textInput.length;
  }
}

// count words
function getWordCount(textInput) {
    const words = textInput.match(/\b[a-zA-Z]+(?:['-][a-zA-Z]+)*\b/g) || [];
    return words.length;
}

//count sentences at the detection of sentence ending punctuations
function getSenteceCount(textInput) {
    const sentences = textInput.match(/[^.!?]*[a-zA-Z]+[^.!?]*[.!?]+/g) || [];
    return sentences.length;
    
}

module.exports = { getCharaterLength, getWordCount, getSenteceCount };
