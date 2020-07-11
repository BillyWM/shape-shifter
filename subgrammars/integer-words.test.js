const parser = require("./integer-words.js");

// https://gist.github.com/subfuzion/808f91bfdfb88c7d5ed7

let storedTrace = [];
let tracer = {
    //result is obj with rule, type, location
    trace: (result) => {
        // if (result.type === 'rule.enter') {
        //     console.log(result.rule);
        // }
        
        // console.log(result);
    }
}

let parse = (str) => {
    let AST = parser.parse(str, { tracer: tracer });
    return AST;
}

let accepts = (strings, ...keys) => {
    if (!Array.isArray(strings)) strings = [strings];
    let word = strings[0];

    if (keys.length) {
        let outStr = "";
        let strs = [...strings];
        while (strs.length || keys.length) {
            let str = strs.shift();
            let k = keys.shift();
            outStr = `${outStr}${str}${k || ""}`;

        }
        word = outStr;
    }

    test(word, ()=> {
        expect(parse(word)).toBe(word);
    })
}

let singles = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
let teens = ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
let tens = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

test('does nothing', ()=> {
    expect(true).toBe(true);
})

// describe('parsing 1 to 9', () => {
//     for (let one of singles) accepts(`${one}`);
// });

// describe('parsing 21 to 99', ()=> {
//     for (let ten of tens) {
//         for (let one of singles) {
//             accepts`${ten} ${one}`;
//         }
//     }    
// });

// describe('parsing 11 to 19', ()=> {
//     for (let teen of ["ten", ...teens]) {
//         accepts`${teen}`;
//     }
// })

// describe('parsing 10, 20, 30....', ()=> {
//     for (let ten of tens) accepts(`${ten}`);
// });

// describe("parsing 100 to 999....", ()=> {
//     for (let one of singles) {

//         accepts`${one} hundred`;

//         for (let ten of tens) {

//             for (let trailing of singles) {
//                 accepts`${one} hundred ${ten} ${trailing}`;
//             }

//             accepts`${one} hundred ${ten}`;
//         }

//         for (let suffix of ["ten", ...teens, ...singles]) {
//             accepts`${one} hundred ${suffix}`;
//         }
//     }
// })