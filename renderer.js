let Two = require("two.js");
let parser = require("./shape-shifter-parser.js");
import "/index.scss";

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

class Renderer {
    constructor() {
        this.tagList = new Map();

        this.init = this.init.bind(this);
    }

    init() {
        console.log("init...");
        this.findTags();
        this.renderTags();
    }

    findTags() {
        for (let tag of document.getElementsByTagName("shape-shifter")) {
            this.tagList.set(tag, {});
        }

        console.log("found ", this.tagList.size);
    }

    parse(text) {
        return parser.parse(text);
    }

    renderTags() {

        // Update a tag to associate a bound renderer with it
        for (let [tag, obj] of this.tagList.entries()) {
            // let obj = this.tagList.get(tag);
            obj.renderStep = this.renderStep.bind(this, tag);
            this.tagList.set(tag, obj);
            this.render(tag);
        }
    }

    // Render a single element
    render(el) {
        let script = el.innerText;
        let AST = this.parse(script);
        console.log("AST", AST);

        window.requestAnimationFrame(this.tagList.get(el).renderStep);
    }

    // TODO: saving bound renderers
    //      hashmap; key: element ref, values bound render function, state information, parsed AST
    renderStep(el, timestamp) {
        window.requestAnimationFrame(this.tagList.get(el).renderStep);
    }
}

let renderer = new Renderer();
window.addEventListener('DOMContentLoaded', renderer.init);