const MIN_COMBO_FREQUENCY = {
  1: Infinity,
  2: Infinity,
  3: 3,
  4: 2,
  5: 2,
  6: 2
};
const MIN_COMBO_MATCH_LENGTH = 3;
const MAX_COMBO_PER_SECTION = 1000;
const TITLE_KEYS = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six"
};

const createRowComparison = () => {
  // let progress = 0;
  // let totalItems;
  const cache = [];
  const createCacheEntry = (indexA, indexB) =>
    `${Math.min(indexA, indexB)},${Math.max(indexA, indexB)}`;
  const addToCache = (indexA, indexB) =>
    cache.push(createCacheEntry(indexA, indexB));
  const checkIsInCache = (indexA, indexB) =>
    cache.includes(createCacheEntry(indexA, indexB));

  return (table, comparison, comboIndex) =>
    table.reduce((acc, row, rowIndex) => {
      postMessage({
        isComplete: false,
        progress: comboIndex + 1
      });

      if (checkIsInCache(comboIndex, rowIndex)) {
        return acc;
      } else {
        addToCache(comboIndex, rowIndex);
      }
      const match = comparison.filter(ball => row.includes(ball)).sort();
      const isMatch = Boolean(match.length >= MIN_COMBO_MATCH_LENGTH);

      return isMatch ? [...acc, match] : acc;
    }, []);
};

const compareTable = (table, compareRows) =>
  table.reduce((acc, row, index) => {
    const data = table.slice(index + 1);

    return [...acc, ...compareRows(data, row, index)];
  }, []);

const getFrequency = matches =>
  matches.reduce((acc, match) => {
    const key = match.join(",");
    const hasKey = acc.hasOwnProperty(key);

    if (hasKey) {
      acc[key].frequency++;
    } else {
      acc[key] = {
        balls: match,
        frequency: 1
      };
    }

    return acc;
  }, {});

const flattenSequence = frequency =>
  Object.values(frequency).reduce(
    (acc, item) => [
      ...acc,
      {
        balls: item.balls,
        // We add "one" onto the frequency as we never test a combination against
        // itself. This would result in various false positives the more matches
        // there were. In that regard simply adding "one" accounts for the
        // "original" match.
        frequency: item.frequency + 1
      }
    ],
    []
  );

const prepareComboData = table =>
  table.reduce(
    (acc, row) => [
      ...acc,
      [
        row.position1,
        row.position2,
        row.position3,
        row.position4,
        row.position5,
        row.position6,
        row.bonusBall1
      ]
    ],
    []
  );

const sortCombinations = table =>
  table
    .filter(
      ({ balls, frequency }) => frequency >= MIN_COMBO_FREQUENCY[balls.length]
    )
    .sort(({ frequency: frequencyA }, { frequency: frequencyB }) =>
      frequencyA > frequencyB ? -1 : 1
    )
    .sort(({ balls: ballsA }, { balls: ballsB }) =>
      ballsA.length > ballsB.length ? -1 : 1
    );

const sectionCombinations = table => {
  const keyValuePairs = table.reduce((acc, row) => {
    const length = row.balls.length;
    const combinations = acc[length] || [];
    const hasRoom = combinations.length < MAX_COMBO_PER_SECTION;

    if (hasRoom) {
      acc[length] = [...combinations, row];
    }

    return acc;
  }, {});

  return Object.entries(keyValuePairs).reduce(
    (acc, [key, combinations]) => [
      ...acc,
      { title: `${TITLE_KEYS[key]} Combinations`, combinations }
    ],
    []
  );
};

// We cannot pass in the master "getBallColor" function into the worker (as per
// the spec). So in order to conform to the type interface for the "combination
// data" we add in a generic  place holder that can be updated once we are back
// on the main thread.
const enrichWithColor = data =>
  data.map(({ title, combinations }) => ({
    title,
    combinations: combinations.map(({ frequency, balls }) => ({
      frequency,
      balls: balls.map(ball => [ball, "blue"])
    }))
  }));

onmessage = function(event) {
  const prepped = prepareComboData(event.data);
  const compareRows = createRowComparison();
  const matches = compareTable(prepped, compareRows);
  const frequencies = getFrequency(matches);
  const flattened = flattenSequence(frequencies);
  const sorted = sortCombinations(flattened);
  const sections = sectionCombinations(sorted);
  const colors = enrichWithColor(sections);

  postMessage({
    isComplete: true,
    combinations: colors
  });

  close();
};
