/**
 * @param {string} s
 * @param {number[][]} queries
 * @return {number[]}
 */
var platesBetweenCandles = function (s, queries) {
  const candlesTillIndex = [];
  const closestLeftCandles = [];
  const closestRightCandles = [];
  let count = 0,
    currentClosestLeftCandle = -1,
    currentClosestRightcandle = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "|") {
      currentClosestLeftCandle = i;
      closestLeftCandles[i] = i;
    } else {
      count++;
      closestLeftCandles[i] = currentClosestLeftCandle;
    }
    candlesTillIndex[i] = count;
  }

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === "|") {
      currentClosestRightcandle = i;
      closestRightCandles[i] = i;
    } else {
      count++;
      closestRightCandles[i] = currentClosestRightcandle;
    }
  }

  const answers = [];
  for (let i = 0; i < queries.length; i++) {
    const leftIndex = queries[i][0],
      rightIndex = queries[i][1];

    const rightClosestCandle = closestRightCandles[leftIndex],
      leftClosestCandle = closestLeftCandles[rightIndex];
    if (rightClosestCandle === -1 || leftClosestCandle === -1) {
      answers.push(0);
    } else {
      const noOfCandles =
        candlesTillIndex[leftClosestCandle] -
        candlesTillIndex[rightClosestCandle];
      answers.push(noOfCandles < 0 ? 0 : noOfCandles);
    }
  }
  return answers;
};
