export const BODY_LANDMARKS = [
    11, // left shoulder
    12, // right shoulder

    13, // left elbow
    14, // right elbow

    15, // left wrist
    16, // right wrist

    23, // left hip
    24, // right hip

    25, // left knee
    26, // right knee

    27, // left ankle
    28, // right ankle

    29, // left heel
    30, // right heel

    31, // left foot index
    32, // right foot index
];

export const BODY_CONNECTIONS = [
    // плечи
    [11, 12],

    // левая рука
    [11, 13],
    [13, 15],

    // правая рука
    [12, 14],
    [14, 16],

    // корпус
    [11, 23],
    [12, 24],
    [23, 24],

    // левая нога
    [23, 25],
    [25, 27],
    [27, 29],
    [27, 31],

    // правая нога
    [24, 26],
    [26, 28],
    [28, 30],
    [28, 32],
];