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


// function to update reading time
function updateReadingTime(wordCount) {
    const readingTimeMinutes = wordCount / 200; // Calculate reading time
    const readingTimeElement = document.querySelector(".options span");
  
    if (readingTimeElement) {
      readingTimeElement.textContent = `Approx. reading time: ${
        wordCount === 0 ? "0 minutes" : readingTimeMinutes < 1 ? "< 1 minute" : `${Math.ceil(readingTimeMinutes)} minute${Math.ceil(readingTimeMinutes) !== 1 ? "s" : ""}`
      }`;
    }
  }
  

module.exports = { getCharaterLength, getWordCount, getSenteceCount, updateReadingTime };
