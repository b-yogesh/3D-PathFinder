var edgesMapping = {
    // vertex : [left, right, top , down]
    0 : [3,1,12,2],
    1 : [0,45,13,2],
    2 : [4,1,0,46],
    3 : [5,0,14,4],
    4 : [6,2,3,47],
    5 : [7,3,15,6],
    6 : [8,4,5,48],
    7 : [9,5,16,8],
    8 : [10,6,7,49],
    9 : [11,7,17,10],
    10 : [11,8,51,9],
    11 : [50,9,18,10],
    12 : [14,13,19,0],
    13 : [12,52,20,1],
    14 : [15,12,21,3],
    15 : [16,14,22,5],
    16 : [17,15,23,7],
    17 : [18,16,24,9],
    18 : [53,17,25,11],
    19 : [21,20,26,12],
    20 : [19,54,27,13],
    21 : [22,19,28,14],
    22 : [23,21,29,15],
    23 : [24,22,30,16],
    24 : [25,23,31,17],
    25 : [55,24,32,18],
    26 : [28,27,33,19],
    27 : [26,56,34,20],
    28 : [29,26,36,21],
    29 : [30,28,38,22],
    30 : [31,29,40,23],
    31 : [32,30,42,24],
    32 : [57,31,44,25],
    33 : [36,34,35,26],
    34 : [33,58,35,27],
    35 : [37,34,59,33],
    36 : [38,33,37,28],
    37 : [39,35,60,36],
    38 : [40,36,39,29],
    39 : [41,37,61,38],
    40 : [42,38,41,30],
    41 : [43,39,40,62],
    42 : [44,40,43,31],
    43 : [44,41,64,42],
    44 : [63,42,43,32],
    45 : [1,65,52,46],
    46 : [47,45,2,66],
    47 : [48,46,4,67],
    48 : [49,47,6,68],
    49 : [51,48,8,69],
    50 : [11,70,53,51],
    51 : [71,10,50,49],
    52 : [13,72,45,54],
    53 : [73,18,55,50],
    54 : [20,74,56,52],
    55 : [75,25,57,53],
    56 : [27,76,58,54],
    57 : [77,32,63,55],
    58 : [34,78,59,56],
    59 : [60,58,79,35],
    60 : [61,59,80,37],
    61 : [62,60,81,39],
    62 : [64,61,82,41],
    63 : [83,44,64,57],
    64 : [63,62,84,43],
    65 : [45,85,72,66],
    66 : [67,65,46,86],
    67 : [68,66,47,87],
    68 : [69,67,48,88],
    69 : [71,68,49,89],
    70 : [73,71,50,90],
    71 : [70,69,51,91],
    72 : [52,92,74,65],
    73 : [70,75,93,53],
    74 : [54,94,76,72],
    75 : [73,77,95,55],
    76 : [56,96,78,74],
    77 : [75,83,97,57],
    78 : [79,76,98,58],
    79 : [80,78,99,59],
    80 : [81,79,100,60],
    81 : [82,80,101,61],
    82 : [84,81,102,62],
    83 : [77,84,103,63],
    84 : [83,82,104,64],
    85 : [92,86,106,65],
    86 : [85,87,107,66],
    87 : [88,86,109,67],
    88 : [87,89,111,68],
    89 : [88,91,113,69],
    90 : [93,91,116,70],
    91 : [90,89,115,71],
    92 : [94,85,118,72],
    93 : [90,95,123,73],
    94 : [96,92,125,74],
    95 : [93,97,130,75],
    96 : [98,94,132,76],
    97 : [95,103,137,77],
    98 : [99,96,139,78],
    99 : [100,98,140,79],
    100 : [101,99,142,80],
    101 : [102,100,144,81],
    102 : [104,101,146,82],
    103 : [97,104,149,83],
    104 : [103,102,148,84],
    105 : [108,106,117,107],
    106 : [118,107,105,85],
    107 : [109,106,105,86],
    108 : [110,105,109,119],
    109 : [111,107,108,87],
    110 : [112,108,120,111],
    111 : [113,109,110,88],
    112 : [114,110,121,113],
    113 : [115,111,112,89],
    114 : [116,112,122,115],
    115 : [116,113,114,91],
    116 : [115,123,114,90],
    117 : [119,118,124,105],
    118 : [117,92,125,106],
    119 : [120,117,126,108],
    120 : [121,119,127,110],
    121 : [122,120,128,112],
    122 : [123,121,129,114],
    123 : [93,122,130,116],
    124 : [126,125,131,117],
    125 : [124,94,132,118],
    126 : [127,124,133,119],
    127 : [128,126,134,120],
    128 : [129,127,135,121],
    129 : [130,128,136,122],
    130 : [95,129,137,123],
    131 : [133,132,138,124],
    132 : [131,96,139,125],
    133 : [134,131,141,126],
    134 : [135,133,143,127],
    135 : [136,134,145,128],
    136 : [137,135,147,129],
    137 : [97,136,149,130],
    138 : [141,139,140,131],
    139 : [138,98,140,132],
    140 : [142,139,138,99],
    141 : [143,138,142,133],
    142 : [144,140,141,100],
    143 : [145,141,144,134],
    144 : [146,142,143,101],
    145 : [147,143,146,135],
    146 : [148,144,145,102],
    147 : [149,145,148,136],
    148 : [149,146,147,104],
    149 : [137,148,147,103],


}

export default edgesMapping;