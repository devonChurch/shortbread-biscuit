const MIN_COMBO_FREQUENCY = {
  1: Infinity,
  2: 3,
  3: 3,
  4: 2,
  5: 2,
  6: 2,
  7: 2
};
const MIN_COMBO_MATCH_LENGTH = 2;
const MAX_COMBO_PER_SECTION = 1000;
const TITLE_KEYS = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven"
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

const createSections = table =>
  table.reduce((acc, row) => {
    const length = row.balls.length;
    const combinations = acc[length] || [];
    const hasRoom = combinations.length < MAX_COMBO_PER_SECTION;

    if (hasRoom) {
      acc[length] = [...combinations, row];
    }

    return acc;
  }, {});

const createFrequencyGroups = combinations => {
  const frequencyObj = combinations.reduce((acc, { frequency, balls }) => {
    const matches = acc[frequency];

    return {
      ...acc,
      [frequency]: [...(matches || []), balls]
    };
  }, {});

  return Object.entries(frequencyObj)
    .reverse()
    .map(([frequency, matches]) => ({
      frequency: +frequency,
      matches
    }));
};

const createCombinations = items =>
  Object.entries(items).reduce(
    (acc, [key, combinations]) => [
      ...acc,
      {
        title: `${TITLE_KEYS[key]} Combinations`,
        total: +key,
        combinations: createFrequencyGroups(combinations)
      }
    ],
    []
  );

// We cannot pass in the master "getBallColor" function into the worker (as per
// the W3C spec). So in order to conform to the type interface for the "combination
// data" we add in a generic  place holder that can be updated once we are back
// on the main thread.
const enrichWithColor = combinations =>
  combinations.map(({ frequency, balls }) => ({
    frequency,
    balls: balls.map(ball => [ball, "blue"])
  }));

const createAssociation = (combination, [comparisons, ...columns]) => {
  return comparisons.reduce((acc, comparison) => {
    const whiteList = combination.balls.map(([ball]) => ball);
    const match = comparison.balls.filter(([ball]) => whiteList.includes(ball));
    const isMatch = Boolean(match.length === whiteList.length);

    return isMatch
      ? [...acc, comparison, ...createAssociation(comparison, columns)]
      : acc;
  }, []);
};

const createAssociations = items => {
  const [combinations, ...comparisons] = Object.values(items);

  return combinations.reduce((acc, combination) => {
    const association = createAssociation(combination, comparisons);
    const hasAssociation = association.length;

    return hasAssociation ? [...acc, [combination, ...association]] : acc;
  }, []);
};

onmessage = function(event) {
  const prepped = prepareComboData(event.data);
  const compareRows = createRowComparison();
  const matches = compareTable(prepped, compareRows);
  const frequencies = getFrequency(matches);
  const flattened = flattenSequence(frequencies);
  const sorted = sortCombinations(flattened);
  const colors = enrichWithColor(sorted);
  const sections = createSections(colors);
  const associations = createAssociations(sections);
  // console.log(
  //   "associations",
  //   JSON.stringify(associations.slice(0, 10), null, 2)
  // );
  const combinations = createCombinations(sections);
  // console.log(
  //   "combinations",
  //   JSON.stringify(combinations.slice(0, 10), null, 2)
  // );

  postMessage({
    isComplete: true,
    combinations,
    associations
  });

  close();
};
