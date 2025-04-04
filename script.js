// // text input counts and updates
// const textInput = document.querySelector(".text-input")[0]
// const charCount = document.querySelector(".char-count")[0]
// const wordCount = document.querySelector(".word-count")[0]
// const sentenceCount = document.querySelector(".sentence-count")[0]


// textInput.addEventListener("input", function(event) {
//     let text = event.target.value
//     console.log(text)

//     let characterCount = text.length

//     let words = text.trim().split(/\s+/);
//     let wordCount = text.trim() ? words.length : 0;

//     let sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
//     let sentenceCount = sentences.length;


//     // update the UI
//     document.querySelector(".char-count").textContent = characterCount;
//     document.querySelector(".word-count").textContent = wordCount;
//     document.querySelector(".sentence-count").textContent = sentenceCount;
// } )