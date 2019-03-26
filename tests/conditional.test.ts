const ModlListener = require('../ts-src/ModlListener').ModlListener;

const ModlObject = require('../ts-src/ModlObject').ModlObject;


var assert = require('assert');
let conditionalInput = [
    ["_number=42\n" +
                "{\n" +
            "  !{number>41}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":[\"International Clients\",14161234567]}"],
    ["_country=gb\n" +
                "{\n" +
            "  !{country=us|gb|au}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":[\"International Clients\",14161234567]}"],
    ["_test=gb\n" +
            "result={test=gb|au?No/?Yes}", "{ \"result\": \"No\" }"],
    ["_input=\"hi apple ios\"\n" +
                "{\n" +
            "  {input=*apple*ios*}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":441270123456}"],
    ["_input=\"An iOS string\"\n" +
                "{\n" +
            "  {input=*iOS*}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":441270123456}"],
    ["_input=\"An iOS string\"\n" +
                "{\n" +
            "  !{input=iOS*}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":441270123456}"],
    ["_number=42\n" +
                "{\n" +
            "  {number>41}?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":441270123456}"],
    [ "_co=ca\n" +
                "{\n" +
            "  co = fr?\n" +
            "    support_number=14161234567\n" +
            "  /?\n" +
            "    support_number=441270123456\n" +
            "}",
        "{\n" +
                " \"support_number\" : 441270123456\n" +
            "}" ],
    ["_country=gb\n" +
                "{\n" +
            "  country=us|gb|au?\n" +
            "    support_number=441270123456\n" +
            "  /?\n" +
            "    support_number=International Clients:14161234567\n" +
            "}",
        "{\"support_number\":441270123456}"],
    [ "_co=ca\n" +
                "_l=fr\n" +
            "{\n" +
            "  { co = ca & l = fr } | co = fr?\n" +
            "    support_number=14161234567\n" +
            "  /?\n" +
            "    support_number=441270123456\n" +
            "}",
        "{\n" +
                " \"support_number\" : 14161234567\n" +
            "}" ]
];

describe('BasicParser', function() {
    describe('translation', function() {
        it('should return the right conditional evaluation', function() {
            for (let entry of conditionalInput) {
                let input = entry[0];
                let expected = entry[1];
                console.log("INPUT: " + input + "\nEXPECTED: " + expected);
                expected = expected.replace(new RegExp(" ", 'g'), "")
                    .replace(new RegExp("\n", 'g'), "")
                    .replace(new RegExp("\r", 'g'), "");                // let output = ModlObjectCreator.parse(input);
                let outputModl = new ModlObject();
                ModlListener.parse(input, outputModl);
                console.log("OUTPUT: " + JSON.stringify(outputModl) + "\n");
                let output = JSON.stringify(outputModl).replace(new RegExp(" ", 'g'), "")
                    .replace(new RegExp("\n", 'g'), "")
                    .replace(new RegExp("\r", 'g'), "");                // let output = ModlObjectCreator.parse(input);
                assert.equal(output, expected);
            }
        });
    });
});
