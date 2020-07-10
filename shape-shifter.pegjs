{
    function makeNumber(digits) {
        return parseInt(digits.join(""));
    };

    function makeDimensionedGrid(grid, dim) {
        let gridOut = Object.assign({}, grid);
        gridOut.dimensions = dim;

        return gridOut;
    }

    function flattenAndRemoveNulls(arr) {
        arr = arr.flat(9);
        arr = arr.filter( i => i != null );
        return arr;
    }

    function makeString() {}
}

// TODO next:
//      line-by-line
//      color expressions
//      rotation expressions

start =
    lines:(Line+ SingleLine) { return { lines: lines.flat() } } /
    SingleLine

Line = 
     ___ expr:Expression LineSeparator
        { return expr }

SingleLine =
    ___ expr: Expression
        { return expr }

Expression =
    expr:( GridExpression / ColorExpression )
        { return expr }

// A list of one or more colors
// TODO: cyclic/range expressions with color (red green blue red...)
// TODO: optional commas
ColorExpression =
        first:Color rest:ColorsRest
            { return { nodeType: "COLOR_EXPRESSION", colors: [first, ...rest] } }

Color =
    modifier:(("light" / "dark" / "pastel") _)?
    color:("red" / "green" / "blue" / "yellow" / "white" / "black" / "cyan" / "orange" / "pink")
        { return { nodeType: "COLOR", modifier: modifier, color: color } }

ColorsRest =
    colors:(_ Color)* { return flattenAndRemoveNulls(colors); }

GridExpression = 
    OptionalMake grid:(DimensionedGrid / Grid)
            { return grid }

DimensionedGrid =
    dim:Dimension _ grid:Grid
            { return makeDimensionedGrid(grid, dim) }

Grid =
    "grid of" _ children:ShapePlural
            { return { nodeType: "GROUP", groupType: "GRID", children: children }}

OptionalMake =
    ("make a" _)?
            { return null }

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

LineSeparator = ([\r][\n])+ / [\r\n]+


// ---------------- todos ----------------------------
// TODO: 147 web colors
// TODO:    pastels as well


