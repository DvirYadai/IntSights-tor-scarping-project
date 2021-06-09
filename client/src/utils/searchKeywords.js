import { compareTwoStrings } from "string-similarity";

export const searchKeywordsFunc = (newPosts, keywords) => {
  const matches = [];
  for (const word of keywords) {
    newPosts.forEach((post) => {
      let matchPercentage = compareTwoStrings(word, post.title);
      if (matchPercentage) {
        matches.push({
          post,
          keyword: word,
          match: matchPercentage === 1 ? "full match" : "partial match",
        });
      } else {
        matchPercentage = compareTwoStrings(word, post.body);
        if (matchPercentage) {
          matches.push({
            post,
            keyword: word,
            match: matchPercentage === 1 ? "full match" : "partial match",
          });
        }
      }
    });
  }
  return matches;
};
