const textArea = document.getElementById("text-input");
const totalCharacters = document.getElementsByClassName("char-count")[0];
const totalWords = document.getElementsByClassName("word-count")[0];
const sumOfSentences = document.getElementsByClassName("sentence-count")[0];
const excludeSpacesCheckbox = document.getElementById("exclude-spaces");
const enableLimitCheckbox = document.getElementById("enable-limit");
const charLimitInput = document.getElementById("char-limit");
const toggleThemeBtn = document.querySelector(".theme-toggle")

// Event Listeners
textArea.addEventListener("input", updateCounts);
excludeSpacesCheckbox.addEventListener("change", updateCounts);
enableLimitCheckbox.addEventListener("change", toggleLimitInput);
charLimitInput.addEventListener("input", updateCounts);
textArea.addEventListener("beforeinput", (e) => {
  const textInput = textArea.value;
  const limit = parseInt(charLimitInput.value);

  const isLimitEnabled = enableLimitCheckbox.checked && !isNaN(limit);

  // Handle normal character input (excluding deletion, arrow keys, etc.)
  if (
    isLimitEnabled &&
    textInput.length > limit &&
    e.inputType.startsWith("insert")
  ) {
    e.preventDefault();
  }
});

// Prevent negative input
charLimitInput.addEventListener("keydown", (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
});

//listen for theme toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
})



// Initialize
charLimitInput.style.display = "none";
updateCounts();
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}




function toggleLimitInput() {
  if (enableLimitCheckbox.checked) {
    charLimitInput.style.display = "block";
    charLimitInput.focus();
  } else {
    charLimitInput.style.display = "none";
    textArea.classList.remove("limit-exceeded");
    document.querySelector(".limit-warning").style.display = "none";
  }
  updateCounts();
}

function updateCounts() {
  const textInput = textArea.value;
  const warningElement = document.querySelector(".limit-warning");
  const warningText = document.querySelector(".warning-txt");

  // Character count
  let charCountLength;
  if (excludeSpacesCheckbox.checked) {
    charCountLength = textInput.replace(/\s+/g, "").length;
  } else {
    charCountLength = textInput.length;
  }

  // Words
  const words = textInput.match(/\b[a-zA-Z]+(?:['-][a-zA-Z]+)*\b/g) || [];
  const wordCount = words.length;



  // Sentences
  const sentences = textInput.match(/\b[a-zA-Z][^.!?]*[.!?]/g) || [] ;
  const sentenceCount =  sentences.length;



  // Update UI
  totalCharacters.textContent = charCountLength.toString().padStart(2, "0");
  totalWords.textContent = wordCount.toString().padStart(2, "0");
  sumOfSentences.textContent = sentenceCount.toString().padStart(2, "0");

  // Handle character limit
  if (enableLimitCheckbox.checked && charLimitInput.value) {
    const limitCheckCount = textInput.length;
    const limit = parseInt(charLimitInput.value);
    if (limitCheckCount > limit) {
      textArea.classList.add("limit-exceeded");
      warningElement.style.display = "flex";
      warningText.textContent = `Limit reached! Your text exceeds ${limit} characters.`;
    } else {
      textArea.classList.remove("limit-exceeded");
      warningElement.style.display = "none";
    }
  } else {
    textArea.classList.remove("limit-exceeded");
    warningElement.style.display = "none";
  }

  updateReadingTime(wordCount);
  updateLetterDensity(textInput);
}

function updateReadingTime(wordCount) {
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const readingTimeElement = document.querySelector(".options span");
  if (readingTimeElement) {
    readingTimeElement.textContent = `Approx. reading time: ${
      readingTimeMinutes > 0 ? "<" : ""
    } ${readingTimeMinutes > 0 ? readingTimeMinutes : "0"} minute${
      readingTimeMinutes !== 1 ? "s" : ""
    }`;
  }
}

function updateLetterDensity(text) {
  const densityContainer = document.querySelector(".letter-density");
  if (!densityContainer) return;

  const placeholder = densityContainer.querySelector("p");
  let seeMoreBtn = document.getElementById("see-more-btn");

  // Clear existing bars but preserve the button
  const existingBars = densityContainer.querySelectorAll(".bar-container");
  existingBars.forEach((el) => el.remove());

  // Create button if it doesn't exist
  if (!seeMoreBtn) {
    seeMoreBtn = createSeeMoreButton();
    densityContainer.appendChild(seeMoreBtn);
  }
  seeMoreBtn.style.display = "none";

  // Show placeholder if no text
  if (!text || !text.trim()) {
    if (placeholder) {
      placeholder.style.display = "block";
    }
    return;
  }

  if (placeholder) placeholder.style.display = "none";

  // Calculate letter frequencies
  const freq = {};
  const letters = text.toLowerCase().replace(/[^a-z]/g, "");
  const totalLetters = letters.length;

  if (totalLetters === 0) {
    if (placeholder) placeholder.style.display = "block";
    return;
  }

  // Count frequencies
  for (let char of letters) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Sort letters by frequency
  const sortedLetters = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

  // Find the maximum frequency to normalize percentages
  const maxFrequency = freq[sortedLetters[0]];

  // Create all bars
  const maxInitialBars = 5;
  const shouldShowSeeMore = sortedLetters.length > maxInitialBars;

  sortedLetters.forEach((letter, index) => {
    const count = freq[letter];
    // Calculate actual percentage and normalized percentage for visualization
    const actualPercentage = ((count / totalLetters) * 100).toFixed(2);
    const normalizedPercentage = (count / maxFrequency) * 100;

    const barHTML = `
      <div class="bar-container ${index >= maxInitialBars ? "hidden-bar" : ""}">
        <div class="letter">${letter.toUpperCase()}</div>
        <div class="progress">
          <div class="bar">
            <div class="fill" style="width: ${normalizedPercentage}%" data-percentage="${actualPercentage}"></div>
          </div>
        </div>
        <div class="count">${count} (${actualPercentage}%)</div>
      </div>
    `;

    densityContainer.insertBefore(
      document.createRange().createContextualFragment(barHTML),
      seeMoreBtn
    );
  });

  // Show "See More" button if needed
  if (shouldShowSeeMore) {
    seeMoreBtn.style.display = "flex";
    seeMoreBtn.innerHTML = `
      <span class="btn-text">See More</span>
      <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
      </svg>
    `;

    // Initialize button state
    let isExpanded = false;

    seeMoreBtn.onclick = () => {
      isExpanded = !isExpanded;
      const chevron = seeMoreBtn.querySelector(".chevron-icon");

      if (isExpanded) {
        seeMoreBtn.querySelector(".btn-text").textContent = "See Less";
        chevron.style.transform = "rotate(180deg)";
        densityContainer
          .querySelectorAll(".hidden-bar")
          .forEach((bar) => bar.classList.remove("hidden-bar"));
      } else {
        seeMoreBtn.querySelector(".btn-text").textContent = "See More";
        chevron.style.transform = "rotate(0deg)";
        const allBars = densityContainer.querySelectorAll(".bar-container");
        allBars.forEach((bar, index) => {
          if (index >= maxInitialBars) {
            bar.classList.add("hidden-bar");
          }
        });
      }
    };
  }
}

function createSeeMoreButton() {
  const btn = document.createElement("button");
  btn.id = "see-more-btn";
  btn.className = "see-more-btn";
  return btn;
}


