const {groth16} = require("snarkjs");

async function exportCalldataGroth16(input, wasmPath, zkeyPath) {
    const {proof :_proof, publicSinal: _publicSinal} = await groth16.fullProve(input, wasmPath, zkeyPath);
    const calldata = await groth16.exportSolidityCallData(_proof, _publicSinal);

    const argv = calldata.replace(/["[\]\s]/g,"").split(",").map((x)=>BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]]
    const Input = [];
    for (let i = 8; i < argv.length; i++) {
        Input.push(argv[i]);
    }
    return {a, b, c, Input};
}

module.exports = {
    exportCalldataGroth16,
}