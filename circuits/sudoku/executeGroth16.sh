#!/bin/bash

# varialble for storing the name of the circuit
CIRCUIT=sudoku

# varialble for storing the number of the ptau file
PTAU=14

if ["$1"]; then
    CIRCUIT=$1
fi

if ["$2"]; then
    CIRCUIT=$2
fi

if [ -f ./ptau/powersOfTau28_hez_final_${PTAU}.ptau]; then
    echo "powerOfTau28_hez_final_${PTAU}.ptau";
else
    echo "Download powerOfTau28_hez_final_${PTAU}.ptau"
    wget -P ./ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${PTAU}.ptau
fi

#Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c

#Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm input.json ${CIRCUIT}_js/witness.wtns

echo "Generate .zkey file"
#generate the zkey file that contain the proving and verification keys together with all phase 2 contribution
snarkjs groth16 setup ${CIRCUIT}.r1cs ptau/powersOfTau28_hez_final_${PTAU}.ptau ${CIRCUIT}_0000.zkey

echo "Contibute to the 2 phase of the ceremony"
#Contribute to the phase 2 of the ceremony
snarkjs zkey contribute ${CIRCUIT}_0000.zkey ${CIRCUIT}_final.zkey --name="first contribution" -v -e="random"

echo "exporting the verification key"
#export the verification key
snarkjs zkey export verificationkey ${CIRCUIT}_final.zkey verificationkey.json

echo "Generate zk-proof"
#export a zk-proof associated to the circuit and the witness 
snarkjs groth16 prove ${CIRCUIT}_final.zkey ${CIRCUIT}_js/witness.wtns proof.json public.json

echo "Verify the proof"
#Verify the proof
snarkjs groth16 verify verificationkey.json public.json proof.json

echo "Generate Solidity verifier"
snarkjs zkey export solidityverifier ${CIRCUIT}_final.zkey ${CIRCUIT}Verifier.sol

sed -i 's/0.6.11;/0.8.4;/g' ${CIRCUIT}Verifier.sol
sed -i "s/contract Verifier/contract ${CIRCUIT^}Verifier/g" ${CIRCUIT}Verifier.sol

echo "Generate and print parameters of call"

snarkjs generatecall | tee parameters.txt


