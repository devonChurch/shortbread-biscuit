const MIN_COMBO_FREQUENCY = 3;
const MIN_COMBO_MATCH_LENGTH = 4;

const compareRows = (table, comparison) =>
  table.reduce((acc, row) => {
    const match = comparison.filter(ball => row.includes(ball)).sort();
    const isMatch = Boolean(match.length >= MIN_COMBO_MATCH_LENGTH);

    return isMatch ? [...acc, match] : acc;
  }, []);

const compareTable = table =>
  table.reduce((acc, row, index) => {
    const data = [...table.slice(0, index), ...table.slice(index + 1)];

    return [...acc, ...compareRows(data, row)];
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

const sortCombinations = table => {
  const allCombinations = table
    .filter(({ frequency }) => frequency >= MIN_COMBO_FREQUENCY)
    .sort(({ frequency: frequencyA }, { frequency: frequencyB }) =>
      frequencyA > frequencyB ? -1 : 1
    )
    .sort(({ balls: ballsA }, { balls: ballsB }) =>
      ballsA.length > ballsB.length ? -1 : 1
    );

  return allCombinations.slice(0, 10);
};

// const createComboData = (table) => {
//   const prepped = prepareComboData(table);
//   const matches = compareTable(prepped);
//   const frequencies = getFrequency(matches);
//   const flattened = flattenSequence(frequencies);
//   const sorted = sortCombinations(flattened);

//   return sorted;
// };

onmessage = function(event) {
  console.log("inside the worker...", event);

  const prepped = prepareComboData(event.data);
  const matches = compareTable(prepped);
  const frequencies = getFrequency(matches);
  const flattened = flattenSequence(frequencies);
  const sorted = sortCombinations(flattened);

  postMessage(sorted);
};
