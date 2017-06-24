const ml = require('ml-regression');
const csv = require('csvtojson');
const SLR = ml.SLR; // Simple Linear Regression

const csvFilePath = './src/data/advertising.csv'; // Data
let csvData = []; // parsed Data
let X = []; // Input
let y = []; // Output

let regressionModel;

const readline = require('readline'); // For user prompt to allow predictions

// Add reading user input:
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load the Data
csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    csvData.push(jsonObj);
  })
  .on('done', () => {
    dressData(); // To get data points from JSON Objects
    performRegression();
  });

// Train your model and start predicting.
function performRegression() {
  regressionModel = new SLR(X, y); // Train the model on training data
  console.log(regressionModel.toString(3));
  predictOutput();
}

// Dress Data to get it ready for execution.
function dressData() {
  /**
  * One row of the data object looks like:
  * {
  *   TV: "10",
  *   Radio: "100",
  *   Newspaper: "20",
  *   "Sales": "1000"
  * }
  *
  * Hence, while adding the data points,
  * we need to parse the String value as a Float.
  */
  csvData.forEach((row) => {
    X.push(f(row.Radio));
    y.push(f(row.Sales));
  });
}

function f(s) {
  return parseFloat(s);
}

function predictOutput() {
  // Ask the user for input
  rl.question('Enter input X for prediction (Press CTRL+C to exit) : ', (answer) => {
    // Log output to console
    console.log(`At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer))}`);

    // Add ability to read from / write to files
    const fs = require('fs');
    const path = "./results.txt";
    let data = `At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer))}\r\n`; // \r\n are linebreaks
    const logStream = fs.createWriteStream(path, {'flags': 'a'}); // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

    // Write results into txt file
    logStream.write(data);
    logStream.end('');

    // Initiate predictOutput function
    predictOutput();
  });
}
