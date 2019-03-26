const ModlListener = require('../ts-src/ModlListener').ModlListener;
import { ModlObject } from '../ts-src/ModlObject';

var assert = require('assert');
let importInput = [
  // ["*I=a:b:c\n" +
  [
    '*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/a.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/b.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/c.modl"\n' +
      'var=%var',
    '{\n' + ' "var": "abc"\n' + '}',
  ],
  [
    '## country\n' +
      '_c = us\n' +
      '## language\n' +
      '_l = en\n' +
      '\n' +
      // "*I=import_config.modl\n" +
      '*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/import_config.modl"\n' +
      '\n' +
      'country = %c\n' +
      'language = %l\n' +
      'time_zone = %tz',
    '[\n' + '  {"country": "us"},\n' + '  {"language": "en"},\n' + '  {"time_zone": "EST"}\n' + ']',
  ],
  [
    '*I="http://config.modl.uk/demo/message-thread.txt"\n' +
      '*class(\n' +
      '  *id=m\n' +
      '  *name=message\n' +
      '  *superclass=map\n' +
      '  *assign=[\n' +
      '    [direction;date_time;message]\n' +
      '  ]\n' +
      '  method=sms\n' +
      ')\n' +
      '\n' +
      'm=out:2018-03-22 15\\:25:Hi\n' +
      'm=in:2018-03-22 15\\:26:Hello, how are you?\n' +
      'm=out:2018-03-22 15\\:25:Hi, good thanks\n' +
      'm=out:2018-03-22 15\\:26:How about you?\n' +
      'm=in:2018-03-22 15\\:26:Yes, fine thanks. What are you up to?\n' +
      'm=out:2018-03-22 15\\:25:Just testing out MODL\n' +
      'm=in:2018-03-22 15\\:26:Cool!',
    '[ {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Hi",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Hello, how are you?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Hi, good thanks",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "How about you?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Yes, fine thanks. What are you up to?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Just testing out MODL",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Cool!",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '} ]\n',
  ],
  [
    '_var=2\n' +
      '*I="http://s3-eu-west-1.amazonaws.com/modltestfiles/testing.txt!"\n' +
      'print=%update_date\n',
    '{\n' + '    "print": "20180921 08:20 2"\n' + '}',
  ],
  // ["*I=demo_config\n" +
  [
    '*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/demo_config.modl"\n' +
      '*class(\n' +
      '  *id=m\n' +
      '  *name=message\n' +
      '  *superclass=map\n' +
      '  *assign=[\n' +
      '    [direction;date_time;message]\n' +
      '  ]\n' +
      '  method=sms\n' +
      ')\n' +
      '\n' +
      'm=out:2018-03-22 15\\:25:Hi\n' +
      'm=in:2018-03-22 15\\:26:Hello, how are you?\n' +
      'm=out:2018-03-22 15\\:25:Hi, good thanks\n' +
      'm=out:2018-03-22 15\\:26:How about you?\n' +
      'm=in:2018-03-22 15\\:26:Yes, fine thanks. What are you up to?\n' +
      'm=out:2018-03-22 15\\:25:Just testing out MODL\n' +
      'm=in:2018-03-22 15\\:26:Cool!',
    '[ {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Hi",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Hello, how are you?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Hi, good thanks",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "How about you?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Yes, fine thanks. What are you up to?",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "out",\n' +
      '    "date_time" : "2018-03-22 15:25",\n' +
      '    "message" : "Just testing out MODL",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '}, {\n' +
      '  "message" : {\n' +
      '    "direction" : "in",\n' +
      '    "date_time" : "2018-03-22 15:26",\n' +
      '    "message" : "Cool!",\n' +
      '    "method" : "sms"\n' +
      '  }\n' +
      '} ]\n',
  ],
  // ["*I=1:2:3\n" +
  [
    '*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/1.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/2.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/3.modl"\n' +
      'the_number=%number',
    '{\n' + ' "the_number": 3\n' + '}',
  ],
  [
    '*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/1.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/2.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/3.modl":"https://s3-eu-west-1.amazonaws.com/modltestfiles/1.modl"\n' +
      'the_number=%number',
    '{\n' + ' "the_number": 1\n' + '}',
  ],
  // ["*I[1;2;3;1]\n" +
  [
    '*I["https://s3-eu-west-1.amazonaws.com/modltestfiles/1.modl";"https://s3-eu-west-1.amazonaws.com/modltestfiles/2.modl";"https://s3-eu-west-1.amazonaws.com/modltestfiles/3.modl";"https://s3-eu-west-1.amazonaws.com/modltestfiles/1.modl"]\n' +
      'the_number=%number',
    '{\n' + ' "the_number": 1\n' + '}',
  ],
  // ["_T=demo\n*I=`%T`_config", ""],
  ['_T=demo\n*I="https://s3-eu-west-1.amazonaws.com/modltestfiles/`%T`_config.modl"', '[]'],
  // ["*I=src/test/test_import_dir/test_import.txt\n" +
  //             "*class(\n" +
  //         "  *id=m\n" +
  //         "  *name=message\n" +
  //         "  *superclass=map\n" +
  //         "  *assign=[\n" +
  //         "    [direction;date_time;message]\n" +
  //         "  ]\n" +
  //         "  method=sms\n" +
  //         ")\n" +
  //         "\n" +
  //         "m=out:2018-03-22 15\\:25:Hi\n" +
  //         "m=in:2018-03-22 15\\:26:Hello, how are you?\n" +
  //         "m=out:2018-03-22 15\\:25:Hi, good thanks\n" +
  //         "m=out:2018-03-22 15\\:26:How about you?\n" +
  //         "m=in:2018-03-22 15\\:26:Yes, fine thanks. What are you up to?\n" +
  //         "m=out:2018-03-22 15\\:25:Just testing out MODL\n" +
  //         "m=in:2018-03-22 15\\:26:Cool!",
  //     "[ {\n" +
  //             "  \"message\" : {\n" +
  //         "    \"direction\" : \"out\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:25\",\n" +
  //         "    \"message\" : \"Hi\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"in\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:26\",\n" +
  //         "    \"message\" : \"Hello, how are you?\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"out\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:25\",\n" +
  //         "    \"message\" : \"Hi, good thanks\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"out\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:26\",\n" +
  //         "    \"message\" : \"How about you?\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"in\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:26\",\n" +
  //         "    \"message\" : \"Yes, fine thanks. What are you up to?\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"out\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:25\",\n" +
  //         "    \"message\" : \"Just testing out MODL\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "}, {\n" +
  //         "  \"message\" : {\n" +
  //         "    \"direction\" : \"in\",\n" +
  //         "    \"date_time\" : \"2018-03-22 15:26\",\n" +
  //         "    \"message\" : \"Cool!\",\n" +
  //         "    \"method\" : \"sms\"\n" +
  //         "  }\n" +
  //         "} ]\n"]
];
describe('Parser', function() {
  describe('imports', function() {
    it('should return the right imports', function() {
      for (let entry of importInput) {
        let input = entry[0];
        let expected = entry[1];
        console.log('INPUT: ' + input + '\nEXPECTED: ' + expected);
        expected = expected
          .replace(new RegExp(' ', 'g'), '')
          .replace(new RegExp('\n', 'g'), '')
          .replace(new RegExp('\r', 'g'), ''); // let output = ModlObjectCreator.parse(input);
        let outputModl = new ModlObject();
        ModlListener.parse(input, outputModl);
        console.log('OUTPUT: ' + JSON.stringify(outputModl) + '\n');
        let output = JSON.stringify(outputModl)
          .replace(new RegExp(' ', 'g'), '')
          .replace(new RegExp('\n', 'g'), '')
          .replace(new RegExp('\r', 'g'), ''); // let output = ModlObjectCreator.parse(input);
        assert.equal(output, expected);
      }
    });
  });
});
