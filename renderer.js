let Two = require("two.js");
let parser = require("./shape-shifter-parser.js");
import "/index.scss";

// let AST = parser.parse("grid of circles");

// -----------------

// let two = new Two({
//     width: 600,
//     height: 600
// }).appendTo(document.getElementById("renderTarget"));

// let width = 600, height = 600;
// var rect = two.makeRectangle(width / 2, height / 2, 50, 50);
// rect.fill = 'rgb(255, 100, 100)';
// rect.noStroke();
 
// two.render();

// -------------------

let shifterTags = document.getElementsByTagName("shape-shifter");

for (let el of shifterTags) {
    let AST = parser.parse(el.innerText);
    console.log(AST);
}
