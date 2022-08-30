pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom"

template Soduko() {
    signal input unsolved[9][9];
    signal input solved[9][9];

    component getone[9][9];
    component letnine[9][9];

    var i;
    var j;

    for (i = 0; i < 9 ; i++) {
        for(j = 0; j < 9 ; j++) {
            letnine[i][j] = LessEqThan(32);
            letnine[i][j].in[0] <== solved[i][j];
            letnine[i][j].in[1] <== 9;

            getone[i][j] = GreaterEqthan(32);
            getone[i][j].in[0] <== solved[i][j];
            getone[i][j].in[1] <== 1;
            letnine[i][j] === getone[i][j]; 
        }
    }

    component ieBoard[9][9];
    component izBoard[9][9];
    for(i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            ieBoard[i][j] = isEqual();
            ieBoard[i][j].in[0] <== solved[i][j];
            ieBoard[i][j].in[1] <== unsolved[i][j];

            ieBoard[i][j] = isZero();
            ieBoard[i][j].in <== unsolved[i][j];

            ieBoard[i][j].out === 1 - izBoard[i][j];
        }
    }
}