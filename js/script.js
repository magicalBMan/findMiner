/*jshint esversion: 6 */
let column;
let sxty_Col;
let row;
let miner;
let building;
let side;
let flipped;

function onSubmit() {
    flipped = false;
    miner = parseInt(document.getElementById('miner_Input').value);
    building = document.getElementById('select_Building').value;
    side = document.getElementById('select_Direction').value;
    offset = parseInt(document.getElementById('offset_Input').value);
    console.log(offset);

    switch (building) {
        case 'bldg_60':
            find_Sxty();
            break;
        case 'bldg_C':
            genericFind();
            break;
        case 'bldg_D':
            if (side == "side_West") {
                find_D_West();
            } else {
                find_D_East();
            }
            break;
        case 'bldg_E':
            if (side == "side_West") {
                console.log("running E West");
                find_E_West();
            } else {
                console.log("running E East");
                find_E_East();
            }
            break;
        case 'bldg_F':
            genericFind();
            break;
        case 'nothing':
            failed();
            break;
    }
    // console.log(building, side, miner);
    return false;
}

function genericFind() {
    column = Math.ceil(miner / 342);
    miner = miner % 342 == 0 ? 342 : miner % 342;
    row = 20 - Math.ceil(miner / 18);
    miner = miner % 18 == 0 ? 18 : miner % 18;
    return print_Result();
}

function print_Result() {
    document.getElementById('col_Results').innerHTML = column;
    document.getElementById('row_Results').innerHTML = row;
    if (flipped) {
        miner = 19 - miner;
    }
    document.getElementById('loc_Results').innerHTML = miner;
}

function failed() {
    document.getElementById('col_Results').innerHTML = "";
    document.getElementById('row_Results').innerHTML = "";
    document.getElementById('loc_Results').innerHTML = "";
}

function helper(start, counts) {
    miner = miner - start;
    if (building != 'bldg_60') {
        row = 20 - Math.ceil(miner / counts);
    } else {
        row = 19 - Math.ceil(miner / counts);
    }
    miner = miner % counts == 0 ? counts : miner % counts;
    print_Result();
}

function find_E_East() {
    flipped = true;
    var col_1 = 342;
    var col_5 = 342 * 4 + 330;
    if (miner <= col_1) {
        return genericFind();
    }
    if (miner > col_1 && miner <= col_5) {
        column = 2;
        if (miner <= col_1 + 15 * 4) { // col 2 16-19
            return helper(col_1, 15);
        } else {
            miner += 12;
            return genericFind();
        }
    }
    if (miner > col_5) {
        column = 6;
        if (miner <= col_5 + 14 * 4) {
            return helper(col_5, 14);
        } else {
            miner += 16 + 12;
            return genericFind();
        }
    }
}

/**
C4 R15-R19: 16
C8 R16-R19: 16
*/
function find_E_West() {
    var end_3 = 342 * 3;
    var end_7 = 342 * 6 + 16 * 4 + 15 * 18; // 2386
    if (miner <= end_3) {
        return genericFind();
    } else if (miner <= end_7) { // column 4
        column = 4;
        if (miner <= end_3 + 16 * 5) { // rows 15 - 19
            return helper(end_3, 16);
        }
        miner += 10;
        return genericFind();
    } else if (miner > end_7 && miner <= end_7 + 332) { // col 8
        miner += 2;
        column = 8;
        if (miner <= end_7 + 16 * 4) { // rows 16 - 19
            return helper(end_7, 16);
        }
        miner += 16;
        return genericFind();
    }
    miner += 18;
    return genericFind();
}


function find_D_East() {
    col_3 = 342 * 3;
    end_7 = 342 * 6 + 330;
    if (miner <= col_3) { // col 1 - 3
        return genericFind();
    }
    if (miner > col_3 && miner <= end_7) { // col 4 - 7
        column = 4;
        if (miner <= col_3 + 15 * 4) { // col 4
            return helper(col_3, 15);
        } else {
            miner += 12;
            return genericFind();
        }
    } else {
        column = 8;
        if (miner <= end_7 + 15 * 4) {
            return helper(end_7, 15);
        } else {
            miner += 24;
            return genericFind();
        }
    }
}

/**
C2 R16-R19: 16

C8 R19    : 17
C8 R18    : 16

C9 R19    : 14
C9 R18    : 17

C10 R19   : 16
C10 R18   : 17
*/
function find_D_West() {
    var end_1 = 342;
    var end_7 = 342 * 6 + 334;
    var end_8 = end_7 + 339;
    var end_9 = end_8 + 337;
    if (miner <= end_1) {
        return genericFind();
    }
    if (miner > end_1 && miner <= end_7) { // cols 2 - 7
        if (miner <= end_1 + 16 * 4) {
            column = 2;
            return helper(end_1, 16);
        } else {
            miner += 8;
            return genericFind();
        }
    } else {
        if (miner > end_7 && miner <= end_8) { // col 8
            if (miner <= end_7 + 17) {
                column = 8;
                row = 19;
                miner = 18 - (miner - end_7);
                return print_Result();
            } else if (miner <= end_7 + 17 + 16) {
                column = 8;
                row = 18;
                miner = 17 - (miner - (end_7 + 17));
                return print_Result();
            } else {
                flipped = true;
                miner += 3 + 8;
                return genericFind();
            }
        }
        if (miner > end_8 && miner <= end_9) { // col 9
            if (miner <= end_8 + 14) {
                column = 9;
                row = 19;
                miner = 15 - (miner - end_8);
                return print_Result();
            } else if (miner <= end_8 + 14 + 17) {
                column = 9;
                row = 18;
                miner = 18 - (miner - (end_8 + 14));
                return print_Result();
            } else {
                flipped = true;
                miner += 16;
                return genericFind();
            }
        }
        if (miner > end_9) {
            if (miner <= end_9 + 16) {
                column = 10;
                row = 19;
                miner = 17 - (miner - end_9);
                return print_Result();
            } else if (miner <= end_9 + 16 + 17) {
                column = 10;
                row = 18;
                miner = 18 - (miner - (end_9 + 16));
                return genericFind();
            } else {
                flipped = true;
                miner += 16 + 3;
                return genericFind();
            }
        }
    }
}

function find_Sxty() {
    // var end_I = 235;
    // var end_H = 469;
    // var end_G = 703;
    // var end_F = 937;
    // var end_E = 1099;
    // var end_D = 1333;
    // var end_C = 1567;
    // var end_B = 1801;
    // var left_Col = 126;

    if (miner > 2035) return failed();

    let location = 0;
    let sideNum = 7;
    let row = 18;
    let col_Char_Code = 73.5;
    let left_Side = true;
    let side = 'L';
    miner = miner > 181 ? miner - 1 : miner;

    for (let i = 0; i < miner; i++) {
        location++;

        if (location > sideNum) {
            location = 1;
            row--;

            if (row < 1) {
                row = 18;
                col_Char_Code -= 0.5;
                left_Side = !left_Side;
                sideNum = left_Side ? 7 : 6;
                sideNum = i == 936 ? 3 : sideNum; // one column only has 3 miners
            }
        }
    }
    side = left_Side ? 'L' : 'R';
    document.getElementById('col_Results').innerHTML = String.fromCharCode(col_Char_Code) + ' ' + side;
    document.getElementById('row_Results').innerHTML = row;
    document.getElementById('loc_Results').innerHTML = location;
}