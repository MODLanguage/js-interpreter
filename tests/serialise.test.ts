import { ModlArray, ModlMap, ModlObject } from '../src/ModlObject';

var assert = require('assert');

describe('BasicParser', function() {
  describe('translation', function() {
    it('should return the right translation', function() {
      let expected =
        '{"test" : {\n' +
        '    "one" : 1,\n' +
        '    "two" : 2,\n' +
        '    "three" : 3\n' +
        '        }}';
      // build ModlObject
      // let modlObject: ModlObject = new ModlObject();
      // let one : Object = {"one" : new ModlNumber(1)};
      // let onePair: ModlMap<String, ModlValue> = new ModlMap([["one", new ModlNumber(1)]]);
      // let twoPair: ModlMap<String, ModlValue> = new ModlMap([["two", new ModlNumber(2)]]);
      // let threePair: ModlMap<String, ModlValue> = new ModlMap([["three", new ModlNumber(3)]]);
      // // let modlMap: ModlMap<String, ModlValue> = new ModlMap([onePair.entries(), twoPair.entries(), threePair.entries()]);
      // let modlMap: ModlMap<String, ModlValue> = new ModlMap();
      // modlMap.set("one", 1);
      // modlMap.set("two", 2);
      // modlMap.set("three", 3);
      // // // modlMap.addModlPair(onePair);
      // // modlMap.addModlPair(threePair);
      // let mainPair: ModlMap<String, ModlValue>= new ModlMap();
      // mainPair.set("test", modlMap);
      // modlObject.push(mainPair);
      // modlObject["test"]=modlMap;
      let modlArray: ModlArray = new ModlArray();
      modlArray.push(1);
      modlArray.push({ alex: 'blah' } as any);
      modlArray.push(3);
      let modlMap: ModlMap = { one: 1, two: { a: 'b' } as any, three: modlArray };
      modlMap.four = 'four';
      let five: String = 'fiveagain';
      modlMap[five.valueOf()] = 'hehehe';
      // modlMap.five = "hello";
      // let modlObject : Object = {"test": modlMap};
      let modlObject: ModlObject = new ModlObject(); // {"test": modlMap};
      let topModlMap: ModlMap = { test: modlMap };
      modlObject.push(topModlMap);

      // Serialise the ModlObject
      let output: string = JSON.stringify(modlObject);

      // Check it is serialised correctly
      assert.equal(expected, output);
    });
  });
});
