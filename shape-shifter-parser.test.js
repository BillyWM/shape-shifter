let parser = require("./shape-shifter-parser.js");

describe('grid expressions', ()=> {
    test("optional 'make' expression", () => {
        let AST = parser.parse(
            `make a 12x13 grid of squares`
        );
    });

    test(`"by" syntax for grids`, ()=> {
        let AST = parser.parse(
            `4 by 5 grid of circles`
        )
    })
})

describe('color expressions', ()=> {
    test('multiple colors', ()=> {
        let AST = parser.parse(
            `5x5 grid of squares
            red green blue black white orange`
        );
    });

    test('single color', ()=> {
        let AST = parser.parse(
            `5x5 grid of squares
            black`
        );
    })
})