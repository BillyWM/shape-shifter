{
    function makeNumber(digits) {
        return parseInt(digits.join(""));
    };
}

// 4x5 grid of circles
// 4 by 5 grid of squares

start =
    dimensioned_grid / grid

dimensioned_grid =
    dimension grid

dimension =
    number "by" number /
    number "x" number

grid =
    "grid of" shape_plural

shape_plural =
    "circles" / "squares"

number =
    digits:[\d]+ { makeNumber(digits); }