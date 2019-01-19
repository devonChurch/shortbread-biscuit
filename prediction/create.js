const fs = require("fs");
const path = require("path");
const brain = require("brain.js");
const csvToJson = require("csvtojson");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const DIR_NAME = __dirname;
const INPUT_DIR = path.resolve(DIR_NAME, "../", "public/lotto-numbers.csv");
const MODEL_DIR = path.resolve(`${DIR_NAME}/model.js`);
const PREDICTIONS_DIR = path.resolve(`${DIR_NAME}/predictions.json`);
const OUTPUT_DIR = path.resolve(DIR_NAME, "../", `src/predictions.json`);
const SIZE = 8;
const LAYERS = [50]; // [50];
const ITTERATIONS = 20000; // 20000; // 10;

console.log(
  "---- config ----",
  { DIR_NAME, INPUT_DIR, MODEL_DIR, SIZE, LAYERS, ITTERATIONS },
  "---------------"
);

// console.log("NeuralNetwork", brain.NeuralNetwork); // - Feedforward Neural Network with backpropagation
// console.log("NeuralNetworkGPU", brain.NeuralNetworkGPU); // - Feedforward Neural Network with backpropagation, GPU version
// console.log("RNNTimeStep", brain.recurrent.RNNTimeStep); // - Time Step Recurrent Neural Network or "RNN"
// console.log("LSTMTimeStep", brain.recurrent.LSTMTimeStep); // - Time Step Long Short Term Memory Neural Network or "LSTM"
// console.log("GRUTimeStep", brain.recurrent.GRUTimeStep); // - Time Step Gated Recurrent Unit or "GRU"
// console.log("RNN", brain.recurrent.RNN); // - Recurrent Neural Network or "RNN"
// console.log("LSTM", brain.recurrent.LSTM); // - Long Short Term Memory Neural Network or "LSTM"
// console.log("GRU", brain.recurrent.GRU); // - Gated Recurrent Unit or "GRU"

// const trainingData = [
//   [24, 18, 4, 40, 19, 6, 27],
//   [4, 40, 11, 23, 6, 12, 10],
//   [4, 23, 34, 24, 2, 20, 31],
//   [22, 31, 15, 39, 11, 35, 16],
//   [33, 15, 11, 2, 35, 10, 5],
//   [40, 29, 24, 3, 32, 30, 20],
//   [25, 15, 10, 31, 28, 27, 38],
//   [23, 37, 2, 30, 14, 22, 35],
//   [7, 29, 22, 18, 40, 5, 25],
//   [37, 3, 29, 20, 32, 30, 11],
//   [2, 16, 18, 12, 38, 8, 33],
//   [23, 5, 18, 1, 24, 25, 14],
//   [34, 30, 6, 39, 25, 26, 10],
//   [19, 30, 38, 20, 18, 31, 24],
//   [24, 22, 8, 21, 34, 25, 37],
//   [8, 25, 7, 22, 40, 32, 31],
//   [14, 25, 34, 3, 27, 30, 18],
//   [8, 6, 20, 31, 24, 27, 1],
//   [10, 4, 9, 27, 30, 20, 8],
//   [15, 1, 22, 40, 39, 12, 7],
//   [36, 7, 23, 22, 1, 29, 18],
//   [14, 11, 15, 10, 32, 16, 37],
//   [17, 15, 34, 18, 10, 12, 23],
//   [24, 37, 33, 19, 9, 39, 10],
//   [28, 26, 12, 4, 35, 32, 21],
//   [26, 17, 10, 5, 33, 21, 25],
//   [5, 26, 34, 9, 1, 4, 29],
//   [13, 4, 37, 12, 9, 2, 16],
//   [39, 13, 8, 24, 29, 26, 19],
//   [39, 1, 28, 16, 32, 40, 27],
//   [24, 29, 32, 15, 19, 35, 30],
//   [32, 22, 36, 26, 40, 23, 35],
//   [25, 38, 36, 22, 3, 35, 7],
//   [3, 13, 7, 11, 9, 5, 36],
//   [17, 8, 15, 7, 2, 12, 19],
//   [1, 3, 8, 11, 19, 36, 37],
//   [29, 22, 35, 18, 20, 24, 17],
//   [35, 4, 12, 30, 13, 33, 37],
//   [34, 18, 36, 21, 1, 8, 15],
//   [12, 8, 21, 2, 7, 32, 10],
//   [13, 4, 9, 15, 8, 3, 11],
//   [28, 2, 25, 5, 15, 10, 33],
//   [27, 9, 13, 7, 38, 23, 20],
//   [35, 18, 12, 33, 4, 27, 19],
//   [19, 25, 38, 3, 30, 32, 37],
//   [37, 14, 25, 18, 20, 17, 24],
//   [16, 22, 37, 5, 32, 29, 27],
//   [5, 21, 31, 22, 34, 4, 17],
//   [14, 4, 21, 17, 23, 10, 35],
//   [35, 19, 18, 10, 16, 28, 9],
//   [1, 12, 34, 8, 10, 31, 20],
//   [33, 13, 5, 24, 39, 2, 1],
//   [14, 17, 5, 18, 33, 19, 10],
//   [22, 23, 18, 20, 35, 15, 4],
//   [29, 10, 30, 15, 33, 18, 27],
//   [21, 13, 38, 6, 30, 35, 25],
//   [23, 29, 12, 16, 39, 31, 25],
//   [22, 2, 34, 19, 24, 27, 21],
//   [4, 39, 17, 30, 15, 18, 31],
//   [27, 1, 6, 26, 33, 4, 19],
//   [17, 8, 22, 7, 14, 34, 3],
//   [10, 36, 12, 37, 9, 18, 1],
//   [20, 9, 4, 3, 2, 24, 30],
//   [31, 16, 23, 9, 25, 32, 37],
//   [14, 29, 8, 12, 7, 5, 10],
//   [22, 29, 18, 34, 28, 14, 12],
//   [13, 36, 2, 37, 18, 17, 40],
//   [38, 21, 39, 1, 14, 23, 7],
//   [6, 31, 25, 13, 3, 37, 34],
//   [14, 16, 29, 28, 13, 1, 37],
//   [12, 10, 4, 40, 38, 33, 27],
//   [25, 21, 40, 19, 23, 20, 6],
//   [6, 11, 20, 40, 34, 16, 19],
//   [25, 28, 8, 2, 29, 7, 11],
//   [16, 40, 36, 5, 11, 4, 2],
//   [36, 7, 15, 23, 27, 3, 11],
//   [2, 9, 15, 27, 32, 10, 18],
//   [1, 35, 20, 19, 24, 39, 12],
//   [21, 3, 34, 35, 25, 14, 23],
//   [21, 34, 33, 7, 16, 40, 9],
//   [1, 10, 19, 13, 17, 23, 32],
//   [22, 38, 1, 15, 14, 13, 32],
//   [11, 6, 16, 4, 23, 2, 40],
//   [36, 1, 34, 37, 12, 28, 40],
//   [15, 37, 22, 18, 21, 12, 32],
//   [35, 13, 38, 29, 14, 9, 27],
//   [24, 19, 15, 25, 40, 16, 31],
//   [20, 18, 28, 19, 17, 24, 30],
//   [40, 34, 1, 37, 12, 14, 22],
//   [25, 3, 34, 29, 23, 15, 1],
//   [2, 19, 34, 35, 38, 12, 3],
//   [10, 40, 18, 20, 16, 3, 35],
//   [19, 2, 32, 40, 16, 25, 36],
//   [9, 31, 17, 3, 25, 11, 10],
//   [30, 35, 29, 37, 31, 36, 19],
//   [14, 35, 23, 26, 36, 37, 30],
//   [5, 33, 2, 4, 30, 22, 16],
//   [25, 11, 29, 39, 17, 34, 1],
//   [29, 11, 38, 2, 30, 15, 36],
//   [16, 11, 39, 31, 5, 10, 28],
//   [37, 29, 8, 6, 23, 26, 17],
//   [28, 1, 24, 25, 20, 16, 22],
//   [20, 17, 26, 1, 39, 12, 7],
//   [19, 3, 18, 23, 22, 15, 20],
//   [37, 33, 11, 39, 29, 18, 2],
//   [8, 1, 16, 2, 4, 26, 39],
//   [19, 40, 13, 33, 10, 15, 32]
// ].reverse();

// const trainingData = [
//   [1, 2, 3, 4, 5, 6, 7],
//   [8, 9, 10, 11, 12, 13, 14],
//   [15, 16, 17, 18, 19, 20, 21],
//   [22, 23, 24, 25, 26, 27, 28],
//   [29, 30, 31, 32, 33, 34, 35],
//   [36, 37, 38, 39, 40, 41, 42],
//   [43, 44, 45, 46, 47, 48, 49],
//   [50, 51, 52, 53, 54, 55, 56],
//   [57, 58, 59, 60, 61, 62, 63]
// ].reverse();

const createNetwork = trainingData => {
  const network = new brain.recurrent.LSTMTimeStep({
    inputSize: SIZE,
    outputSize: SIZE,
    hiddenLayers: LAYERS
  });

  network.train(trainingData, {
    iterations: ITTERATIONS,
    callback: ({ error, iterations: currentItteration }) =>
      console.log(`${(currentItteration / ITTERATIONS) * 100}%`, error),
    callbackPeriod: 1000
  });

  return network;
};

const saveNetwork = async network => {
  const stringModel = network.toFunction().toString();
  const fileOutput = `${stringModel};module.exports = anonymous;`;
  await writeFileAsync(MODEL_DIR, fileOutput);
};

const createTrainingData = async () => {
  const lottoCsvBuffer = await readFileAsync(INPUT_DIR);
  const lottoCsvData = lottoCsvBuffer.toString();
  const lottoJsonData = await csvToJson().fromString(lottoCsvData);

  return lottoJsonData
    .map(
      ({
        1: position1, //             "33"
        2: position2, //             "15"
        3: position3, //             "11"
        4: position4, //             "2"
        5: position5, //             "35"
        6: position6, //             "10"
        "Bonus Ball": bonusBall1, // "5"
        "Power Ball": powerBall //   "8"
      }) => [
        +position1,
        +position2,
        +position3,
        +position4,
        +position5,
        +position6,
        +bonusBall1,
        +powerBall
      ]
    )
    .reverse()
    .slice(-500);
};

const makePredictions = (trainingData, network) => {
  debugger;
  const inputs = [
    trainingData.slice(-1),
    trainingData.slice(-2),
    trainingData.slice(-4),
    trainingData.slice(-8)
  ];

  return inputs.map(input => ({
    input,
    output: Object.values(network.run(input)).map(Math.floor)
  }));
};

const savePredictions = async predictions => {
  const fileOutput = JSON.stringify(predictions);
  await writeFileAsync(PREDICTIONS_DIR, fileOutput);
  await writeFileAsync(OUTPUT_DIR, fileOutput);
};

(async () => {
  console.log("create data...");
  const trainingData = await createTrainingData();
  console.log("create network...");
  const network = createNetwork(trainingData);
  console.log("save network...");
  await saveNetwork(network);
  console.log("create predictions...");
  const predictions = makePredictions(trainingData, network);
  console.log("save predictions...");
  await savePredictions(predictions);
})();

// node -e "console.log(require('./src/makePrediction')([[29, 30, 31, 32, 33, 34, 35]]));"
