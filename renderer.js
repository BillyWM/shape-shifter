let Two = require("two.js");
let parser = require("./shape-shifter-parser.js");
import "/index.scss";

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

    buidVariableGrid(args = {}) {

    }

    buildScene(el, AST) {

        // Starting with root node...
        // TODO: Root will not always be "GRID" or even "GROUP". Making assumption for now
        // TODO: search for expressions (e.g. color expression) that modify grid expression
        //      semantic analysis pass?
        let root = AST.lines[0];
        let { two, scene } = this.getTagData(el);

        // TODO: Break down into different functions
        //      variable/unspecified grid
        //      maybe function that simply figures out measurements
        switch (root.groupType) {
            case "GRID":
                let modifiers = this.findModifiers(AST, root);
                this.buildGrid({ root, two, scene, modifiers });
                break;
        }
    }

    // Search AST for a grid modifier
    // TODO: Context marking? Go through AST earlier and mark lines as being in "grid" context or not
    findModifiers(AST, startLine) {
        let foundStart = false;
        let modifiers = [];
        let startIndex = AST.lines.findIndex(x => x === startLine);
        for (let i=startIndex; i < AST.lines.length; i++) {
            let line = AST.lines[i];

            if (line.nodeType === "COLOR_EXPRESSION") {
                modifiers.push(line);
            }
        }

        return modifiers;
    }

    buildGrid(args = {}) {
        let { root, two, scene, modifiers } = args;
        let grid = two.makeGroup();
        grid.translation.set(0, 0);

        let numAcross, numDown;
            numAcross = root.dimensions.width
            numDown = root.dimensions.height;

        let maxWidthEach = Math.floor(two.width / numAcross);
        let maxHeightEach = Math.floor(two.height / numDown);

        // TODO: separate each shape slightly
        let shapeType = this.depluralize(root.children);
        switch (shapeType) {
            case "square":

                let sizeEach = Math.min(maxWidthEach, maxHeightEach);

                let offsetX = sizeEach / 2;
                let offsetY = sizeEach / 2;

                // TODO: Different way of doing modifiers entirely
                let colorModifiers = modifiers.filter(x => x.nodeType=="COLOR_EXPRESSION");
                let randomColors = null;

                // TODO: This assumes there's only one color modifier worth considering
                //          Not the correct way to do this
                if (colorModifiers.length) {
                    // TODO: extended colors like "pastel ___"
                    randomColors = colorModifiers[0].colors.map(x => x.color);
                    console.log(randomColors);
                }

                for (let j=0; j < numDown; j++) {
                    for (let i = 0; i < numAcross; i++) {
                        let shape = two.makeRectangle(
                            offsetX, offsetY,
                            sizeEach * .8, sizeEach * .8
                        );
                        shape.fill = randomColors ? this.randomOneOf(...randomColors) : "white";
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
        window.requestAnimationFrame(renderStep);
    }
}

let renderer = new Renderer();
window.addEventListener('DOMContentLoaded', renderer.init);