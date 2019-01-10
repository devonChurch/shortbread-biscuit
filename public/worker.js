const MIN_COMBO_FREQUENCY = 1;
const MIN_COMBO_MATCH_LENGTH = 3;
const MAX_COMBO_PER_SECTION = 10;
const TITLE_KEYS = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six"
};

// const compareRows = (table, comparison) =>
//   table.reduce((acc, row) => {
//     const match = comparison.filter(ball => row.includes(ball)).sort();
//     const isMatch = Boolean(match.length >= MIN_COMBO_MATCH_LENGTH);

//     return isMatch ? [...acc, match] : acc;
//   }, []);

const createRowComparison = () => {
  const cache = [];
  const createCacheEntry = (indexA, indexB) =>
    `${Math.min(indexA, indexB)},${Math.max(indexA, indexB)}`;
  const addToCache = (indexA, indexB) =>
    cache.push(createCacheEntry(indexA, indexB));
  const checkIsInCache = (indexA, indexB) =>
    cache.includes(createCacheEntry(indexA, indexB));

  return (table, comparison, comboIndex) =>
    table.reduce((acc, row, rowIndex) => {
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
    // console.log(`comparing row ${index}`);
    // const data = [...table.slice(0, index), ...table.slice(index + 1)];
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
    (acc, item) => [...acc, { balls: item.balls, frequency: item.frequency }],
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
    .filter(({ frequency }) => frequency >= MIN_COMBO_FREQUENCY)
    .sort(({ frequency: frequencyA }, { frequency: frequencyB }) =>
      frequencyA > frequencyB ? -1 : 1
    )
    .sort(({ balls: ballsA }, { balls: ballsB }) =>
      ballsA.length > ballsB.length ? -1 : 1
    );

const sectionCombinations = table => {
  // debugger;
  const keyValuePairs = table.reduce((acc, row) => {
    const length = row.balls.length;
    const combinations = acc[length] || [];
    const hasRoom = combinations.length < MAX_COMBO_PER_SECTION;

    if (hasRoom) {
      acc[length] = [...combinations, row];
    }

    return acc;
  }, {});
  console.log("keyValuePairs", keyValuePairs);
  // debugger;
  return Object.entries(keyValuePairs).reduce(
    (acc, [key, combinations]) => [
      ...acc,
      { title: `${TITLE_KEYS[key]} Combinations`, combinations }
    ],
    []
  );
};

onmessage = function(event) {
  console.log("inside the worker...", event);

  const prepped = prepareComboData(event.data);
  const compareRows = createRowComparison();
  const matches = compareTable(prepped, compareRows);
  const frequencies = getFrequency(matches);
  const flattened = flattenSequence(frequencies);
  const sorted = sortCombinations(flattened);
  console.log("sorted", sorted);
  const sections = sectionCombinations(sorted);
  console.log("sections", sections);

  postMessage(sections);
};
