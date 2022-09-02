
//const hre = require("hardhat");
const main = async () => {
  console.log("deploying process has started");
  SudokuVerifier = await hre.ethers.getContractFactory("SudokuVerifier");
  sudokuVerifier = await SudokuVerifier.deploy();
  await sudokuVerifier.deployed();

  console.log(
    "SudukoVerifier Contract address is : " + sudokuVerifier.address
  );

  Sudoku = await hre.ethers.getContractFactory("Sudoku");
  sudoku = await Sudoku.deploy(sudokuVerifier.address);
  await sudoku.deployed();

  console.log("Suduko address is :" + sudoku.address);
};

const runmain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runmain();
/*
SudukoVerifier contract deployed to addr:0x6A088DDf0BbC3827A577908d8DEd734A9c85Ff62
Suduko contract deployed to addr: 0x61f1a7b4E030A966cCF55207B1995a6d1670A089

*/