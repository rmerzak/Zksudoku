const {assert} = require("chai");

const wasm_tester = require("circom_tester").wasm;

describe("Sudoku circuit", function () {
    let SudokuCircuit;

    before(async function() {
        SudokuCircuit = await wasm_tester("sudoku/sudoku.circom");
    });
    it ("Should generate the witness succefully", async function () {
        let input = {
            unsolved: [
                [0, 0, 0, 0, 0, 6, 0, 0, 0],
                [0, 0, 7, 2, 0, 0, 8, 0, 0],
                [9, 0, 6, 8, 0, 0, 0, 1, 0],
                [3, 0, 0, 7, 0, 0, 0, 2, 9],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 5, 0, 0, 0, 7, 0],
                [6, 5, 0, 1, 0, 0, 0, 0, 0],
                [8, 0, 1, 0, 5, 0, 3, 0, 0],
                [7, 9, 2, 0, 0, 0, 0, 0, 4],
              ],
              solved: [
                [1, 8, 4, 3, 7, 6, 2, 9, 5],
                [5, 3, 7, 2, 9, 1, 8, 4, 6],
                [9, 2, 6, 8, 4, 5, 7, 1, 3],
                [3, 6, 5, 7, 1, 8, 4, 2, 9],
                [2, 7, 8, 4, 6, 9, 5, 3, 1],
                [4, 1, 9, 5, 3, 2, 6, 7, 8],
                [6, 5, 3, 1, 2, 4, 9, 8, 7],
                [8, 4, 1, 9, 5, 7, 3, 6, 2],
                [7, 9, 2, 6, 8, 3, 1, 5, 4],
              ],
        };
        const witness = await SudokuCircuit.calculateWitness(input);
        await SudokuCircuit.assertOut(witness, {});
    });
    it("Should fail : there is a number out of bounds", async function() {
        let input = {
            unsolved: [
              [0, 0, 0, 0, 0, 6, 0, 0, 0],
              [0, 0, 7, 2, 0, 0, 8, 0, 0],
              [9, 0, 6, 8, 0, 0, 0, 1, 0],
              [3, 0, 0, 7, 0, 0, 0, 2, 9],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [4, 0, 0, 5, 0, 0, 0, 7, 0],
              [6, 5, 0, 1, 0, 0, 0, 0, 0],
              [8, 0, 1, 0, 5, 0, 3, 0, 0],
              [7, 9, 2, 0, 0, 0, 0, 0, 4],
            ],
            solved: [
              [1, 8, 4, 3, 7, 6, 2, 9, 10],
              [5, 3, 7, 2, 9, 1, 8, 4, 6],
              [9, 2, 6, 8, 4, 5, 7, 1, 3],
              [3, 6, 5, 7, 1, 8, 4, 2, 9],
              [2, 7, 8, 4, 6, 9, 5, 3, 1],
              [4, 1, 9, 5, 3, 2, 6, 7, 8],
              [6, 5, 3, 1, 2, 4, 9, 8, 7],
              [8, 4, 1, 9, 5, 7, 3, 6, 2],
              [7, 9, 2, 6, 8, 3, 1, 5, 4],
            ],
        };
        try {
            await SudokuCircuit.calculateWitness(input);
        } catch (err) {
            assert(err.message.includes("Assert Failed"));
        }
    });
    it("should fail: there is a difference between unsolved and solved matrice initial state", async function() {
        let input = {
            unsolved: [
              [0, 0, 0, 0, 0, 6, 0, 0, 0],
              [0, 0, 7, 2, 0, 0, 8, 0, 0],
              [9, 0, 6, 8, 0, 0, 0, 1, 0],
              [3, 0, 0, 7, 0, 0, 0, 2, 9],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [4, 0, 0, 5, 0, 0, 0, 7, 0],
              [6, 5, 0, 1, 0, 0, 0, 0, 0],
              [8, 0, 1, 0, 5, 0, 3, 0, 0],
              [7, 9, 2, 0, 0, 0, 0, 0, 4],
            ],
            solved: [
              [1, 2, 7, 5, 8, 4, 6, 9, 3],
              [8, 5, 6, 3, 7, 9, 1, 2, 4],
              [3, 4, 9, 6, 2, 1, 8, 7, 5],
              [4, 7, 1, 9, 5, 8, 2, 3, 6],
              [2, 6, 8, 7, 1, 3, 5, 4, 9],
              [9, 3, 5, 4, 6, 2, 7, 1, 8],
              [5, 8, 3, 2, 9, 7, 4, 6, 1],
              [7, 1, 4, 8, 3, 6, 9, 5, 2],
              [6, 9, 2, 1, 4, 5, 3, 8, 7],
            ],
          };
          try {
            await SudokuCircuit.calculateWitness(input);
          } catch (err) {
            assert(err.message.includes("Assert Failed"));
          }
    });
    it("should fail: repeated numbers in a row", async function() {
        let input = {
            unsolved: [
              [0, 0, 0, 0, 0, 6, 0, 0, 0],
              [0, 0, 7, 2, 0, 0, 8, 0, 0],
              [9, 0, 6, 8, 0, 0, 0, 1, 0],
              [3, 0, 0, 7, 0, 0, 0, 2, 9],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [4, 0, 0, 5, 0, 0, 0, 7, 0],
              [6, 5, 0, 1, 0, 0, 0, 0, 0],
              [8, 0, 1, 0, 5, 0, 3, 0, 0],
              [7, 9, 2, 0, 0, 0, 0, 0, 4],
            ],
            solved: [
              [1, 8, 4, 3, 7, 6, 2, 9, 1],
              [5, 3, 7, 2, 9, 1, 8, 4, 6],
              [9, 2, 6, 8, 4, 5, 7, 1, 3],
              [3, 6, 5, 7, 1, 8, 4, 2, 9],
              [2, 7, 8, 4, 6, 9, 5, 3, 1],
              [4, 1, 9, 5, 3, 2, 6, 7, 8],
              [6, 5, 3, 1, 2, 4, 9, 8, 7],
              [8, 4, 1, 9, 5, 7, 3, 6, 2],
              [7, 9, 2, 6, 8, 3, 1, 5, 4],
            ],
          };
          try {
            await SudokuCircuit.calculateWitness(input);
          } catch(err) {
            assert(err.message.includes("Assert Failed"));
          }
    });
    it ("should fail due to repeated numbers in a column",async function() {
        let input = {
            unsolved: [
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            solved: [
              [1, 8, 4, 3, 7, 6, 2, 9, 5],
              [5, 3, 7, 2, 9, 1, 8, 4, 6],
              [9, 2, 6, 8, 4, 5, 7, 1, 3],
              [3, 6, 5, 7, 1, 8, 4, 2, 9],
              [2, 7, 8, 4, 6, 9, 5, 3, 1],
              [7, 1, 9, 5, 3, 2, 6, 7, 8],
              [6, 5, 3, 1, 2, 4, 9, 8, 7],
              [8, 4, 1, 9, 5, 7, 3, 6, 2],
              [4, 9, 2, 6, 8, 3, 1, 5, 7],
            ],
          };
          try {
            await SudokuCircuit.calculateWitness(input);
        } catch (err) {
            assert(err.message.includes("Assert Failed"));
        }
    });
    it ("sould fail: repeated numbers in a square", async function () {
        let input = {
            unsolved: [
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            solved: [
              [1, 8, 4, 3, 7, 6, 2, 9, 5],
              [5, 3, 7, 2, 9, 1, 8, 4, 6],
              [9, 2, 1, 8, 4, 5, 7, 6, 3],
              [3, 6, 5, 7, 1, 8, 4, 2, 9],
              [2, 7, 8, 4, 6, 9, 5, 3, 1],
              [4, 1, 9, 5, 3, 2, 6, 7, 8],
              [6, 5, 3, 1, 2, 4, 9, 8, 7],
              [8, 4, 6, 9, 5, 7, 3, 1, 2],
              [7, 9, 2, 6, 8, 3, 1, 5, 4],
            ],
        };
        try {
            await SudokuCircuit.calculateWitness(input);
        } catch (err) {
            assert(err.message.includes("Assert Failed"));
        }
    });
});