import { execSync } from 'child_process';
import fs from 'fs';

const parseFile = (pathToFile) => {
  try {
    return JSON.parse(fs.readFileSync(pathToFile));
  } catch (error) {
    console.error(`Failed to parse file "${pathToFile}"`);
    throw Error(error);
  }
};

const pathToActual = './src/actual.txt';
const pathToExpected = './src/expected.txt';
const actual = parseFile(pathToActual);
const expected = parseFile(pathToExpected);
if (!Array.isArray(actual) || !Array.isArray(expected)) {
  console.error(
    actual,
    'or',
    expected,
    'is not an array, but they both should be.'
  );
  throw Error();
}
actual.sort();
expected.sort();
const pathToSortedActual = 'sortedActual.js';
const pathToSortedExpected = 'sortedExpected.js';
fs.writeFileSync(pathToSortedActual, JSON.stringify(actual, null, 2));
fs.writeFileSync(pathToSortedExpected, JSON.stringify(expected, null, 2));

const command = `git diff --color --no-index ${pathToSortedActual} ${pathToSortedExpected}`;
try {
  execSync(command, { encoding: 'utf-8' });
  console.info('Both inputs match.');
} catch (e) {
  console.info('You need to make the following changes:');
  console.info(e.stdout);
}
console.log(new Date().toLocaleTimeString());
