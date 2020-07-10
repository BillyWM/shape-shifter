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
            this.tagList.set(tag, {
                renderStep: null,
                two: null,
                scene: []
            });
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
            // this.tagList.set(tag, obj);
            this.renderInit(tag);
        }
    }

    getRenderFunction(el) {
        return this.getTagData(el).renderStep;
    }

    getTagData(el) {
        return this.tagList.get(el);
    }

    // Render a single element
    renderInit(el) {
        let script = el.textContent.trim();
        let AST = this.parse(script);
        console.log("AST", AST);

        // TODO: remove properly
        el.innerHTML = null;

        let obj = this.getTagData(el);
        let { renderStep } = obj;
        obj.two = new Two({
            width: 600,
            height: 600,
            // type: Two.Types.canvas
            type: Two.Types.webgl
        });
        obj.two.appendTo(el);

        this.buildScene(el, AST);

        window.requestAnimationFrame(renderStep);
    }

    buildScene(el, AST) {

        // Starting with root node...
        // TODO: Root will not always be "GRID" or even "GROUP". Making assumption for now
        let root = AST.lines[0];
        let { two, scene } = this.getTagData(el);

        switch (root.groupType) {
            case "GRID":
                let { width, height } = root.dimensions;
                let grid = two.makeGroup();
                grid.translation.set(0, 0);

                let maxWidthEach = Math.floor(two.width / width);
                let maxHeightEach = Math.floor(two.height / height);

                // TODO: separate each shape slightly
                let shapeType = this.depluralize(root.children);
                switch (shapeType) {
                    case "square":

                        let sizeEach = Math.min(maxWidthEach, maxHeightEach);
                        console.log("sizes", sizeEach, maxWidthEach, maxHeightEach);

                        let offsetX = sizeEach / 2;
                        let offsetY = sizeEach / 2;

                        for (let j=0; j < height; j++) {
                            for (let i = 0; i < width; i++) {
                                let shape = two.makeRectangle(
                                    offsetX, offsetY,
                                    sizeEach * .8, sizeEach * .8
                                );
                                shape.fill = this.randomOneOf("red", "green", "blue");
                                shape.noStroke();
                                grid.add(shape);
                                scene.push(shape);

                                offsetX += maxWidthEach;
                            }
                            offsetX = sizeEach / 2;
                            offsetY += sizeEach;
                        }
                    break;
                }

        }

        // this.addShape(el, { type: "square", size: 50, color: "red" });
    }

    randomInt(min = 1, max = 1) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    randomOneOf(...args) {
        // passed in an array? 
        if (args.length === 1 && Array.isArray(args[0])) {
            args = [...args];
        }

        let choice = this.randomInt(0, args.length - 1);

        return args[choice];
    }

    depluralize(shapePlural) {
        let mapping = {
            "squares": "square"
        }

        return mapping[shapePlural];
    }

    addShape(el, shapeParams = {}) {
        let { two, scene } = this.getTagData(el);
        let { type } = shapeParams;
        switch (type) {
            case "square":
                let { size, color } = shapeParams;
                let rect = two.makeRectangle(275, 275, size, size);
                rect.fill = color;
                rect.noStroke();
                scene.push(rect);
                break;
        }
    }

    // TODO: saving bound renderers
    //      hashmap; key: element ref, values bound render function, state information, parsed AST
    renderStep(el, timestamp) {

        let  { two, renderStep, scene } = this.getTagData(el);

        for (let shape of scene ) {
            shape.rotation += 0.1;
        }

        two.update();

        // console.log(`rendering @ ${timestamp}`);
        window.requestAnimationFrame(renderStep);
    }
}

let renderer = new Renderer();
window.addEventListener('DOMContentLoaded', renderer.init);