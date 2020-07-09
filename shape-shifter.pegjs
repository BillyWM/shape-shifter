{
    function makeNumber(digits) {
        return parseInt(digits.join(""));
    };

    function makeDimensionedGrid(grid, dim) {
        let gridOut = Object.assign({}, grid);
        gridOut.dimensions = dim;

        return gridOut;
    }

    function makeString() {}
}

start =
    DimensionedGrid / Grid

DimensionedGrid =
    dim:Dimension ___ grid:Grid
            { return makeDimensionedGrid(grid, dim) }

Grid =
    "grid of" ___ children:ShapePlural
            { return { nodeType: "GROUP", groupType: "GRID", children: children }}

Dimension =
    w:Integer _ "by" _ h:Integer
            { return { nodeType: "DIMENSIONS", width: w, height: h } }      /
    w:Integer ___ "x" ___ h:Integer
            { return { nodeType: "DIMENSIONS", width: w, height: h } }

ShapePlural =
    BasicShapePlural / CustomShape

BasicShape =
    // do all regular polygons plus some extras
    // syntax like "17-sided polygon" when we get high enough?
    "circle" / "square" / "triangle" / "hexagon" / "cross" / "line" 

BasicShapePlural =
    "circles" / "squares" / "triangles" / "hexagons" / "crosses" / "lines"


// Identifiers are capitalized e.g. One Pointy Boi
CustomShape =
    CapitalizedWord (___ CapitalizedWord)*

CapitalizedWord =
    [A-Z][a-z]+

Integer =
    digits:[0-9]+   { return makeNumber(digits); }

// required whitespace
_ =
    [ ]+            { return null }

// optional whitespace (3 underscores).
//      less common; longer to draw attention to it
___ = [ ]*          { return null }


// ---------------- todos ----------------------------
// TODO: 147 web colors
// TODO:    pastels as well


