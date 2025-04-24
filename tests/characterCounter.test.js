/**
 * @jest-environment jsdom
 */
const {
  getCharaterLength,
  getWordCount,
  getSenteceCount,
  updateReadingTime,
} = require("./utils");

describe("text Analysis", () => {
  test("properly counts characters including spaces", () => {
    expect(getCharaterLength("I am young and rich")).toBe(19);
  });

  test("returns correct count excluding spaces", () => {
    expect(getCharaterLength("I am young and rich", true)).toBe(15);
  });

  test("handles empty string", () => {
    expect(getCharaterLength("")).toBe(0);
  });

  // test word counts
  test("properly counts words", () => {
    expect(getWordCount("I am strong")).toBe(3);
    // edge cases(special characters, empty-input, excessive white-space)
    expect(getWordCount("@!##$% *&%#4^$")).toBe(0);
    expect(getWordCount("")).toBe(0);
    expect(getWordCount(`   `)).toBe(0);
    expect(getWordCount("mother-in-law")).toBe(1);
  });

  // test sentence count
  test("properly counts sentences", () => {
    expect(getSenteceCount("I am young. I am rich! Who am I?")).toBe(3);
    // edge cases(special characters, empty-input, excessive white-space)
    expect(getSenteceCount("I am young")).toBe(0);
    expect(getSenteceCount("@#^&*? @$%&*&^>.")).toBe(0);
    expect(getSenteceCount("!.#>...")).toBe(0);
  });
});

// test character counts

// test for proper dom updates
describe("DOM updates", () => {
  test("updates Dom when text is typed", () => {
    document.body.innerHTML = `<textArea id="text-input"></textArea>
        <div class="char-count"></div>
        <div class="word-count"></div>
        <div class="sentence-count"></div>
        `;

    const {
      getCharaterLength,
      getSenteceCount,
      getWordCount,
    } = require("./utils");
    const textArea = document.getElementById("text-input");
    const totalCharacters = document.getElementsByClassName("char-count")[0];
    const totalWords = document.getElementsByClassName("word-count")[0];
    const sumOfSentences = document.getElementsByClassName("sentence-count")[0];

    textArea.value =
      "My name is Samuel. I am 10 years old. Where are you from? I am rich! My mother-in-law is kind.";
    const characterLength = getCharaterLength(textArea.value);
    const wordCount = getWordCount(textArea.value);
    const sentenceCount = getSenteceCount(textArea.value);

    //  updating upon typing
    totalCharacters.textContent = characterLength.toString().padStart(2, "0");
    totalWords.textContent = wordCount.toString().padStart(2, "0");
    sumOfSentences.textContent = sentenceCount.toString().padStart(2, "0");

    expect(totalCharacters.textContent).toBe("94");
    expect(totalWords.textContent).toBe("19");
    expect(sumOfSentences.textContent).toBe("05");
  });

  // test for warnings
  test("warnings properly appear", () => {
    document.body.innerHTML = `
    <textarea id="text-input"></textarea>
    <input type="checkbox" id="enable-limit" />
    <input type="number" id="char-limit"/>
    <div class="limit-warning">
    <span class="warning-txt"></span>
    </div>
  `;

    const textArea = document.getElementById("text-input");
    const enableLimitCheckbox = document.getElementById("enable-limit");
    const charLimitInput = document.getElementById("char-limit");
    const warningElement = document.querySelector(".limit-warning");
    const warningText = document.querySelector(".warning-txt");

    enableLimitCheckbox.checked = true;
    charLimitInput.value = "5";

    textArea.value = "My name";

    if (enableLimitCheckbox.checked && charLimitInput.value) {
      const limitCheckCount = textArea.value.length;
      const limit = parseInt(charLimitInput.value);
      if (limitCheckCount > limit) {
        warningElement.style.display = "flex";
        warningText.textContent = `Limit reached! Your text exceeds ${limit} characters.`;
      } else {
        warningElement.style.display = "none";
      }
    } else {
      warningElement.style.display = "none";
    }

    expect(warningElement.style.display).toBe("flex");
    expect(warningText.textContent).toContain("exceeds 5 characters");
    //   check if an element has a class warning
    expect(document.querySelector(".warning")).toBeFalsy();
    //   check if an element has a class warning-txt
    expect(document.querySelector(".warning-txt")).toBeTruthy();
  });

  // verify estimated reading time updates
  test("properly updates approx reading time", () => {
    document.body.innerHTML = `
    <textarea id="text-input"></textarea>
    <div class="options">
      <span></span>
    </div>
  `;

    const readingTimeElement = document.querySelector(".options span");

    // when wordcount is 5
    updateReadingTime(5);
    expect(readingTimeElement.textContent).toContain(
      "reading time: < 1 minute"
    );

    // when wordcount is 0
    updateReadingTime(0);
    expect(readingTimeElement.textContent).toContain("reading time: 0 minutes");

    // when wordcount is 200
    updateReadingTime(200);
    expect(readingTimeElement.textContent).toContain("reading time: 1 minute");

    // when wordcount is 400
    updateReadingTime(400);
    expect(readingTimeElement.textContent).toContain("reading time: 2 minutes");
  });
});

// test if event handler was called
describe("Event handling", () => {
  test("calls updates on input", () => {
    const mockFn = jest.fn();
    const textArea = document.getElementById("text-input");
    textArea.addEventListener("input", mockFn);

    const event = new Event("input");
    textArea.dispatchEvent(event);

    expect(mockFn).toHaveBeenCalled();
  });
});
