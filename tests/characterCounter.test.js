const { getCharaterLength, getWordCount, getSenteceCount } = require("./utils");

// test character counts
test("properly counts characters", () => {
  expect(getCharaterLength("I am young and rich")).toBe(19);
  expect(getCharaterLength("I am young and rich", true)).toBe(15);
});

// test word counts
test("properly counts words", () => {
  expect(getWordCount("I am strong")).toBe(3);
  // edge cases(special characters, empty-input, excessive white-space)
  expect(getWordCount("@!##$% *&%#4^$")).toBe(0)
  expect(getWordCount("")).toBe(0)
  expect(getWordCount(`   `)).toBe(0)
  expect(getWordCount("mother-in-law")).toBe(1)


});

// test sentence count
test("properly counts sentences", ()=>{
    expect(getSenteceCount("I am young. I am rich! Who am I?")).toBe(3)
    // edge cases(special characters, empty-input, excessive white-space)
    expect(getSenteceCount("I am young")).toBe(0)
    expect(getSenteceCount("@#^&*? @$%&*&^>.")).toBe(0)
    expect(getSenteceCount("!.#>...")).toBe(0)
})





