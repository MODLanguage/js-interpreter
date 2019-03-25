import { ModlObject } from '../src/ModlObject';
import { ModlListener } from '../ts-src/ModlListener';

const assert = require('assert');
let parserInput = [
  [
    'o=[test;test;t=Customer Service:44123]',
    '{\n' +
      '  "o" : [ "test", "test", {\n' +
      '    "t" : [ "Customer Service", 44123 ]\n' +
      '  } ]\n' +
      '}',
  ],
  ['o=[test;test]', '{\n' + '  "o" : [ "test", "test" ]\n' + '}'],
  ['o=test', '{\n' + '  "o" : "test"\n' + '}'],
  ['test=[1;2;3]', '{\n' + '  "test": [\n' + '    1,\n' + '    2,\n' + '    3\n' + '  ]\n' + '}'],
  ['test=(one=1)', '{\n' + '  "test": {\n' + '    "one": 1\n' + '  }\n' + '}'],
  [
    'one=1;two=2;three=3',
    '[\n' +
      '  {\n' +
      '    "one": 1\n' +
      '  }\n' +
      '  ,\n' +
      '  {\n' +
      '    "two": 2\n' +
      '  }\n' +
      '  ,\n' +
      '  {\n' +
      '    "three": 3\n' +
      '  }\n' +
      ']',
  ],
  ['test=test', '{\n' + '  "test": "test"\n' + '}'],
  [
    'test(one=1;two=2;three=3)',
    '{\n' + ' "test" : {' + '  "one": 1,\n' + '  "two": 2,\n' + '  "three": 3\n' + '}}',
  ],
  [
    '[o(n=test);o(n=test2)]',
    '[ {\n' +
      '  "o" : {\n' +
      '    "n" : "test"\n' +
      '  }\n' +
      '}, {\n' +
      '  "o" : {\n' +
      '    "n" : "test2"\n' +
      '  }\n' +
      '} ]',
  ],
  [
    'R=0\nnumber=1;number=2;number=3',
    ' [ {\n' +
      '  "R" : 0\n' +
      '}, {\n' +
      '    "number": 1\n' +
      '  }\n' +
      '  ,\n' +
      '  {\n' +
      '    "number": 2\n' +
      '  }\n' +
      '  ,\n' +
      '  {\n' +
      '    "number": 3\n' +
      '  }\n' +
      ']',
  ],
  ['test=(one=1)', '{\n' + '  "test": {\n' + '    "one": 1\n' + '  }\n' + '}'],
  ['test(one=1)', '{\n' + '  "test": {\n' + '    "one": 1\n' + '  }\n' + '}'],
  ['test[1;2;3]', '{\n' + '  "test": [\n' + '    1,\n' + '    2,\n' + '    3\n' + '  ]\n' + '}'],
  [
    'test[number=1;number=2;number=3]',
    '{\n' +
      '  "test": [\n' +
      '    {\n' +
      '      "number": 1\n' +
      '    }\n' +
      '    ,\n' +
      '    {\n' +
      '      "number": 2\n' +
      '    }\n' +
      '    ,\n' +
      '    {\n' +
      '      "number": 3\n' +
      '    }\n' +
      '  ]\n' +
      '}',
  ],
  [
    'o(n=Tesco;s=Every Little Helps)',
    '{\n' +
      '  "o" : {\n' +
      '    "n" : "Tesco",\n' +
      '    "s" : "Every Little Helps"\n' +
      '  }\n' +
      '}',
  ],
  ['o(n=test)', '{\n' + '  "o" : {\n' + '    "n" : "test"\n' + '  }\n' + '}'],
  ['o(n=test);\n', '{\n' + '  "o" : {\n' + '    "n" : "test"\n' + '  }\n' + '}'],
  ['o(\n' + 'n=test\n' + ')', '{\n' + '  "o" : {\n' + '    "n" : "test"\n' + '  }\n' + '}'],
  ['o(n=test);', '{\n' + '  "o" : {\n' + '    "n" : "test"\n' + '  }\n' + '}'],
  [
    'o(n=test)\n' + 'o(n=test2)',
    '[ {\n' +
      '  "o" : {\n' +
      '    "n" : "test"\n' +
      '  }\n' +
      '}, {\n' +
      '  "o" : {\n' +
      '    "n" : "test2"\n' +
      '  }\n' +
      '} ]',
  ],
  [
    'o(n=test);o(n=test2)',
    '[ {\n' +
      '  "o" : {\n' +
      '    "n" : "test"\n' +
      '  }\n' +
      '}, {\n' +
      '  "o" : {\n' +
      '    "n" : "test2"\n' +
      '  }\n' +
      '} ]',
  ],
  ['o=[1;2]', '{\n' + '  "o" : [ 1, 2 ]\n' + '}'],
  ['o=[test1;test2]', '{\n' + '  "o" : [ "test1", "test2" ]\n' + '}'],
  [
    'o(t=test1;t2=test2)',
    '{\n' + '  "o" : {\n' + '    "t" : "test1",\n' + '    "t2" : "test2"\n' + '  }\n' + '}',
  ],
  [
    'o(t(a=test;b=test2);t2(c=test;d=test2))',
    '{\n' +
      '  "o" : {\n' +
      '    "t" : {\n' +
      '      "a" : "test",\n' +
      '      "b" : "test2"\n' +
      '    },\n' +
      '    "t2" : {\n' +
      '      "c" : "test",\n' +
      '      "d" : "test2"\n' +
      '    }\n' +
      '  }\n' +
      '}',
  ],
];
describe('BasicParser', function() {
  describe('translation', function() {
    it('should return the right translation', function() {
      for (let entry of parserInput) {
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
