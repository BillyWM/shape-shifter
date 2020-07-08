{
    function flattenStrings(els) {
        els = els.filter(e => !!e);
        return els.join(" ");
    }
}

IntegerWord =
    Integer100to999 / Integer10to99 / IntegerWordOnes
    //  Integer10to99 / IntegerWordOnes
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
Integer1to99 =
    Integer10to99 / IntegerWordSuffixableOnes
Integer10to99 =
    //  "twenty one" to "ninety nine"
    strings:(IntegerWordPreifxableTens ___ IntegerWordSuffixableOnes) { return flattenStrings(strings); } /
    IntegerWordTens /
    IntegerWordTeens
Integer100to999 =
    strings:(IntegerWordSuffixableOnes ___ "hundred" OptionalAnd Integer1to99) { return flattenStrings(strings); } /
    strings:(IntegerWordSuffixableOnes ___ "hundred") { return flattenStrings(strings); }
OptionalAnd =
    (___ "and" ___) / ___
___ =
    [ ]+ { return null }

    //note: peg.js doesn't recognize [\s] as whitespace