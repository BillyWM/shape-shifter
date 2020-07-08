{
    function makeNumber(digits) {
        return parseInt(digits.join(""));
    };
}

// 4x5 grid of circles
// 4 by 5 grid of squares

start =
    DimensionedGrid / Grid

DimensionedGrid =
    Dimension ___ Grid

Grid =
    "grid of" ___ ShapePlural

Dimension =
    Integer _ "by" _ Integer      /
    Integer ___ "x" ___ Integer

ShapePlural =
    BasicShapePlural / CustomShape

BasicShape =
    "circle" / "square"

BasicShapePlural =
    "circles" / "squares"


// Identifiers are capitalized e.g. One Pointy Boi
CustomShape =
    CapitalizedWord (___ CapitalizedWord)*


// ------------- primitives -------------------------
// invalid: "...and zero", "ten three"

IntegerWord =
    Integer100to999 / Integer10to99 / IntegerWordOnes
IntegerWordOnes =
    "zero" / IntegerWordSuffixableOnes
IntegerWordSuffixableOnes =
    "one" / "two" / "three" / "four" / "five" / "six" / "seven" / "eight" / "nine"
IntegerWordTens =
    "ten" / IntegerWordPreifxableTens
IntegerWordPreifxableTens =
    "twenty" / "thirty" / "forty" / "fifty" / "sixty" / "seventy" / "eighty" / "ninety"
IntegerWordTeens =
    "eleven" / "twelve" / "thirteen" / "fourteen" / "fifteen" / "sixteen" / "seventeen" /
    "eighteen" / "nineteen"
//Integer0to9 = <would be an alias of integerwordones but can't do that with Peg.js>
Integer10to99 =
    IntegerWordPreifxableTens ___ IntegerWordSuffixableOnes / IntegerWordTens
Integer100to999 =
    IntegerWordSuffixableOnes ___ "hundred" OptionalAnd Integer10to99 / "one hundred"
OptionalAnd =
    ___ "and" ___


CapitalizedWord =
    [A-Z][a-z]+

Integer =
    digits:[\d]+ { makeNumber(digits); }

// required whitespace
_ =
    [\s]+

// optional whitespace (3 underscores).
//      less common; longer to draw attention to it
___ = [\s]*


// ---------------- todos ----------------------------
// TODO: 147 web colors
// TODO:    pastels as well


