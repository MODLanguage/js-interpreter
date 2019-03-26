import * as punycode from 'punycode';
import {
  ArrayConditionalReturn,
  MapConditionalReturn,
  ModlArray,
  ModlMap,
  ModlObject,
  ModlPair,
  TopLevelConditionalReturn,
  ValueConditionalReturn,
} from './ModlObject';

const antlr4 = require('antlr4/index');
const MODLLexer = require('../gen/MODLLexer');
const MODLParser = require('../gen/MODLParser');
const ModlParserListener = require('../gen/MODLParserListener').MODLParserListener;

// TODO: Define types
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let keys; // = {};
let objectIndex; //  = [];
let loadedClasses;
const NUMBER_REGEXP = new RegExp('^[0-9]*$');

const REFERENCE_REGEXP = new RegExp('%[\\w\\[\\].,%()]*');

const GRAVE_REGEXP = new RegExp('`[\\w\\[\\],.%()]*`');

export function ModlListener(modlObject, loadedClassesIn, keysIn, objectIndexIn): void {
  this.modlObject = modlObject;
  this.keys = keysIn;
  this.objectIndex = objectIndexIn;
  this.loadedClasses = loadedClassesIn;
  keys = keysIn;
  objectIndex = objectIndexIn;
  loadedClasses = loadedClassesIn;
  // this.modlObject = new ModlObject();

  ModlParserListener.call(this); // inherit default listener
  return this;
}

// inherit default listener
ModlListener.prototype = Object.create(ModlParserListener.prototype);
ModlListener.prototype.constructor = ModlListener;

ModlListener.parse = function(
  input,
  modlObject,
  loadedClassesIn = null,
  keysIn = null,
  objectIndexIn = null,
) {
  // : String) {
  if (objectIndexIn == null) {
    this.objectIndex = [];
  } else {
    this.objectIndex = objectIndexIn;
  }
  if (keysIn == null) {
    this.keys = {};
  } else {
    this.keys = keysIn;
  }
  if (loadedClassesIn == null) {
    this.loadedClasses = {};
    this.initialiseLoadedClasses();
  } else {
    this.loadedClasses = loadedClassesIn;
  }
  this.modlObject = modlObject;
  keys = {};
  const chars = new antlr4.InputStream(input);
  const lexer = new MODLLexer.MODLLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new MODLParser.MODLParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.modl();
  const modl = new ModlListener(modlObject, this.loadedClasses, this.keys, this.objectIndex);
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(modl, tree);

  if (modlObject[0] instanceof ModlArray) {
    console.log('ARRAY!');
  }
  if (modlObject[0] instanceof ModlMap) {
    console.log('MAP!');
  }
  if (modlObject[0] instanceof ModlPair) {
    console.log('PAIR!');
  }

  return modlObject;
};

ModlListener.prototype.enterModl = function(ctx) {
  for (let ctxStructure of ctx.structure()) {
    if (ctxStructure.pair() != null) {
      const pair = this.processPair(ctxStructure.pair());
      if (pair != null) {
        if (Object.keys(pair)[0].startsWith('*I')) {
          let imports = pair[Object.keys(pair)[0]];
          if (!(imports instanceof Array)) {
            imports = [imports];
          }
          for (let importItem of imports) {
            const imported = this.loadImport(importItem);
            for (let struct of imported) {
              if (struct != null && struct.length > 0) {
                this.modlObject.push(struct);
              }
            }
          }
        } else {
          this.modlObject.push(pair);
        }
      }
    } else {
      const structure = this.processStructure(ctxStructure);
      if (structure != null) {
        this.modlObject.push(structure);
      }
    }
  }
};

ModlListener.prototype.loadImport = function(location) {
  let exclamation = false;
  if (location.endsWith('!')) {
    location = location.substring(0, location.length - 1);
  }
  console.log('Importing from ' + location);
  const modlText = this.loadTextFromURI(location);
  console.log('Imported MODL : ' + modlText);

  let outputModl = new ModlObject();
  ModlListener.parse(modlText, outputModl, loadedClasses, keys, objectIndex);

  // TODO Handle "!" at end for signalling!
  return outputModl;
};

ModlListener.prototype.loadTextFromURI = function(location) {
  // read text from URL location
  const request = new XMLHttpRequest();
  request.open('GET', location, false);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      const type = request.getResponseHeader('Content-Type');
      if (type.indexOf('text') !== 1) {
        console.log('HTTP request response : ' + request.responseText);
        return request.responseText;
      }
    }
  };
  request.send(null);
  //request.done; // TODO: Is this done()?
  return request.responseText;
};

ModlListener.prototype.processStructure = function(ctx) {
  // function enterStructure(ctx) {
  // Could be map, array, pair, or topLevelConditional
  if (ctx.pair() != null) {
    const pair = this.processPair(ctx.pair());
    if (pair != null) {
      return pair;
    }
  } else if (ctx.top_level_conditional() != null) {
    const top_level_conditional = this.processTop_level_conditional(ctx.top_level_conditional());
    if (top_level_conditional != null) {
      return top_level_conditional;
    }
  } else if (ctx.map() != null) {
    const map = this.processMap(ctx.map());
    return map;
  } else if (ctx.array() != null) {
    const array = this.processArray(ctx.array());
    return array;
  }
};

ModlListener.prototype.processPair = function(ctx, couldBeString = false) {
  // function enterPair(ctx, couldBeString = false) {
  // key, along with value of either map, array or valueItem
  // var pair = new Map();
  let pair = new ModlPair();
  let _key;
  if (ctx.STRING() != null) {
    // if (couldBeString && ctx.getText().startsWith("%")) { // TODO HACK!
    if (couldBeString && ctx.getText().indexOf('%') >= 0) {
      // TODO HACK!
      _key = this.getString(ctx.getText());
      return _key;
    } else {
      _key = this.getString(ctx.STRING().getText());
    }
  }
  if (ctx.QUOTED() != null) {
    // if (couldBeString && ctx.getText().startsWith("%")) { // TODO HACK!
    if (couldBeString && ctx.getText().indexOf('%') >= 0) {
      // TODO HACK!
      _key = this.getString(getQuoted(ctx.getText()));
      return _key;
    } else {
      _key = this.getString(getQuoted(ctx.QUOTED().getText()));
    }
  }

  let item;
  if (ctx.map() != null) {
    item = this.processMap(ctx.map());
  }
  if (ctx.array() != null) {
    item = this.processArray(ctx.array());
  }
  if (ctx.value_item() != null) {
    item = this.processValue_item(ctx.value_item());
  }

  if (typeof _key == 'string' && _key.startsWith('_')) {
    keys[_key.substring(1, _key.length)] = item;
    console.log('Adding ' + _key + ' to keys : ' + item);
  } else if (typeof _key == 'string' && _key == '?') {
    console.log('Setting object index to ' + item);
    objectIndex = item;
  } else if ((typeof _key == 'string' && _key == '*m') || _key == '*method') {
    this.loadVariableMethod(item);
  } else if ((typeof _key == 'string' && _key == '*c') || _key == '*class') {
    this.loadClass(item);
    // } else if (typeof _key == "string" && _key == "*I" || _key == "*IMPORT") {
    //     return loadImport(item);
  } else if (Object.keys(loadedClasses).includes(_key) && _key != 'o') {
    pair = this.loadClassFrom(_key, item);
    return pair;
  } else {
    pair[_key] = item;
    return pair;
  }
};

function getQuoted(s) {
  // : String) {
  s = s.substring(1, s.length - 1);
  return s;
}

ModlListener.prototype.processValue_item = function(ctx) {
  // function enterValue_item(ctx) {
  if (ctx.value() != null) {
    return this.processValue(ctx.value());
  }
  if (ctx.value_conditional() != null) {
    return this.processValue_conditional(ctx.value_conditional());
  }
};

ModlListener.prototype.processValue = function(ctx) {
  // function enterValue(ctx) {
  if (ctx.map() != null) {
    return this.processMap(ctx.map());
  }
  if (ctx.array() != null) {
    return this.processArray(ctx.array());
  }
  if (ctx.nb_array() != null) {
    return this.processNb_array(ctx.nb_array());
  }
  if (ctx.pair() != null) {
    const pair = this.processPair(ctx.pair(), true);
    if (pair != null) {
      return pair;
    }
  }
  if (ctx.STRING() != null) {
    return this.getString(ctx.STRING().getText());
  }
  if (ctx.QUOTED() != null) {
    return this.getString(getQuoted(ctx.QUOTED().getText()));
  }
  if (ctx.NUMBER() != null) {
    return Number(ctx.NUMBER().getText());
  }
  if (ctx.NULL() != null) {
    return null;
  }
  if (ctx.TRUE() != null) {
    return true;
  }
  if (ctx.FALSE() != null) {
    return false;
  }
};

ModlListener.prototype.processArray = function(ctx) {
  // function enterArray(ctx) {
  // var array = [];
  const array = new ModlArray();
  // array of either arrayItem or nbArray
  // go through the children nodes in order and add them
  // Make either an arrayItem or nbArray as appropriate
  // ctx.parentCtx.indexOf(ctx);
  for (let arr of ctx.children) {
    if (arr.getChildCount() == 0) {
      continue;
    }
    if (arr.array_conditional() != null || arr.array_value_item() != null) {
      const arrayItem = this.processArray_item(arr);
      array.push(arrayItem);
      continue;
    }
    if (arr.array_item() != null) {
      const nbArray = this.enterNb_array(arr);
      array.push(nbArray);
    }
  }
  return array;
};

ModlListener.prototype.processNb_array = function(ctx) {
  const array = new ModlArray();
  for (let arrayItemCtx of ctx.array_item()) {
    const arrayItem = this.processArray_item(arrayItemCtx);
    array.push(arrayItem);
  }
  return array;
};

ModlListener.prototype.processArray_item = function(ctx) {
  if (ctx.array_conditional() != null) {
    const arrayConditional = this.processArray_conditional(ctx.array_conditional());
    return arrayConditional;
  }
  if (ctx.array_value_item() != null) {
    return this.processArray_value_item(ctx.array_value_item());
  }
};

ModlListener.prototype.processArray_value_item = function(ctx) {
  if (ctx.map() != null) {
    return this.enterMap(ctx.map());
  }
  if (ctx.array() != null) {
    return this.processArray(ctx.array());
  }
  if (ctx.pair() != null) {
    const pair = this.processPair(ctx.pair());
    if (pair != null) {
      return pair;
    }
  }
  if (ctx.STRING() != null) {
    return this.getString(ctx.STRING().getText());
  }
  if (ctx.QUOTED() != null) {
    return this.getString(getQuoted(ctx.QUOTED().getText()));
  }
  if (ctx.NUMBER() != null) {
    return Number(ctx.NUMBER().getText());
  }
  if (ctx.NULL() != null) {
    return null;
  }
  if (ctx.TRUE() != null) {
    return true;
  }
  if (ctx.FALSE() != null) {
    return false;
  }
};

ModlListener.prototype.processMap = function(ctx) {
  // function enterMap(ctx) {
  // var map = {};
  const map = new ModlMap();
  for (let ctxMapItem of ctx.map_item()) {
    const mapItem = this.processMap_item(ctxMapItem);
    for (const attrname in mapItem) {
      map[attrname] = mapItem[attrname];
    }
  }
  return map;
};

ModlListener.prototype.processMap_item = function(ctx) {
  // function enterMap_item(ctx) {
  // Either a Pair or a MapConditional
  if (ctx.pair() != null) {
    const pair = this.processPair(ctx.pair());
    if (pair != null) {
      return pair;
    }
  }
  if (ctx.map_conditional() != null) {
    const mapConditional = this.processMap_conditional(ctx.map_conditional());
    return mapConditional;
  }
};

ModlListener.prototype.processTop_level_conditional = function(ctx) {
  // Basically a map of TopLevelCondition -> ToplLevelConditionalReturn

  let conditionalReturn;
  // var topLevelConditionalReturns = {};
  let i;
  for (i = 0; i < ctx.condition_test().length; i++) {
    // var conditionTest = enterCondition_test(ctx.condition_test(i));

    if (this.evaluates(ctx.condition_test(i))) {
      conditionalReturn = this.processTop_level_conditional_return(
        ctx.top_level_conditional_return(i),
      );
      return conditionalReturn;
      // topLevelConditionalReturns[conditionTest] = conditionalReturn;
    }
  }
  if (ctx.top_level_conditional_return().length > ctx.condition_test().length) {
    // var conditionTest = new ConditionTest();
    conditionalReturn = this.processTop_level_conditional_return(
      ctx.top_level_conditional_return(ctx.top_level_conditional_return().length - 1),
    );
    return conditionalReturn;
    // topLevelConditionalReturns[conditionTest] = conditionalReturn;
  }
  // return topLevelConditionalReturns;
  return null;
};

ModlListener.prototype.evaluates = function(ctx) {
  // TODO EVALUATE THE CONDITION_TEST!!!
  return ctx.getText();
};

ModlListener.prototype.processTop_level_conditional_return = function(ctx) {
  const structures = new TopLevelConditionalReturn();
  for (let ctxStructure of ctx.structure()) {
    const structure = this.processStructure(ctxStructure);
    if (structure != null) {
      structures.push(structure);
    }
  }
  if (structures.length == 1) {
    return structures[0];
  }
  return structures;
};

ModlListener.prototype.processValue_conditional = function(ctx) {
  let conditionalReturn;
  // var valueConditionalReturns = {};
  let i;
  for (i = 0; i < ctx.condition_test().length; i++) {
    // var conditionTest = enterCondition_test(ctx.condition_test(i));

    if (this.evaluates(ctx.condition_test(i))) {
      conditionalReturn = this.processValue_conditional_return(ctx.value_conditional_return(i));
      return conditionalReturn;
      // valueConditionalReturns[conditionTest] = conditionalReturn;
    }
  }
  if (ctx.value_conditional_return().length > ctx.condition_test().length) {
    // var conditionTest = new ConditionTest();
    conditionalReturn = this.processValue_conditional_return(
      ctx.value_conditional_return(ctx.value_conditional_return().length - 1),
    );
    return conditionalReturn;
    // valueConditionalReturns[conditionTest] = conditionalReturn;
  }
  // return valueConditionalReturns;
  throw new Error('Could not evaluate value_conditional! : ' + ctx.getText());
};

ModlListener.prototype.processValue_conditional_return = function(ctx) {
  const value_items = new ValueConditionalReturn();
  for (let ctxValueItem of ctx.value_item()) {
    const valueItem = this.processValue_item(ctxValueItem);
    value_items.push(valueItem);
  }
  if (value_items.length == 1) {
    return value_items[0];
  }
  return value_items;
};

ModlListener.prototype.processArray_conditional = function(ctx) {
  let conditionalReturn;
  // var arrayConditionalReturns = {};
  let i;
  for (i = 0; i < ctx.condition_test().length; i++) {
    // var conditionTest = enterCondition_test(ctx.condition_test(i));

    if (this.evaluates(ctx.condition_test(i))) {
      conditionalReturn = this.processArray_conditional_return(ctx.array_conditional_return(i));
      return conditionalReturn;
      // arrayConditionalReturns[conditionTest] = conditionalReturn;
    }
  }
  if (ctx.array_conditional_return().length > ctx.condition_test().length) {
    // var conditionTest = new ConditionTest();
    conditionalReturn = this.processArray_conditional_return(
      ctx.array_conditional_return(ctx.array_conditional_return().length - 1),
    );
    return conditionalReturn;
    // arrayConditionalReturns[conditionTest] = conditionalReturn;
  }
  // return arrayConditionalReturns;
  throw new Error('Could not evaluate array_conditional! : ' + ctx.getText());
};

ModlListener.prototype.processArray_conditional_return = function(ctx) {
  const array_items = new ArrayConditionalReturn();

  // array_item be either array_value_item or array_contional_return !
  for (let i = 0; i < ctx.array_item().length; i++) {
    if (ctx.array_item(i).array_value_item() != null) {
      const arrayValueItem = this.processArray_value_item(ctx.array_item(i).array_value_item());
      array_items.push(arrayValueItem);
    }
    if (ctx.array_item(i).array_conditional() != null) {
      const arrayConditional = this.processArray_conditional(ctx.array_item(i).array_conditional());
      array_items.push(arrayConditional);
    }
  }

  if (array_items.length == 1) {
    return array_items[0];
  }
  return array_items;
};

ModlListener.prototype.processMap_conditional = function(ctx) {
  let conditionalReturn;
  // var mapConditionalReturns = {};
  let i;
  for (i = 0; i < ctx.condition_test().length; i++) {
    // var conditionTest = enterCondition_test(ctx.condition_test(i));

    if (this.evaluates(ctx.condition_test(i))) {
      conditionalReturn = this.processMap_conditional_return(ctx.map_conditional_return(i));
      return conditionalReturn;
      // mapConditionalReturns[conditionTest] = conditionalReturn;
    }
  }
  if (ctx.map_conditional_return().length > ctx.condition_test().length) {
    // var conditionTest = new ConditionTest();
    conditionalReturn = this.processMap_conditional_return(
      ctx.map_conditional_return(ctx.map_conditional_return().length - 1),
    );
    return conditionalReturn;
    // mapConditionalReturns[conditionTest] = conditionalReturn;
  }
  // return mapConditionalReturns;
  throw new Error('Could not evaluate map_conditional! : ' + ctx.getText());
};

ModlListener.prototype.processMap_conditional_return = function(ctx) {
  const map_items = new MapConditionalReturn();

  // array_item be either array_value_item or array_contional_return !
  for (let i = 0; i < ctx.map_item().length; i++) {
    if (ctx.map_item(i).pair() != null) {
      const pair = this.processPair(ctx.map_item(i).pair());
      map_items.push(pair);
    }
    if (ctx.map_item(i).map_conditional() != null) {
      const mapConditionalReturn = this.processMap_conditional(ctx.map_item(i).map_conditional());
      map_items.push(mapConditionalReturn);
    }
  }

  if (map_items.length == 1) {
    return map_items[0];
  }
  return map_items;
};

ModlListener.prototype.evaluates = function(ctx) {
  // enterCondition_test(ctx)
  // : EXCLAM? ( condition | condition_group ) (( AMP | PIPE ) EXCLAM? ( condition | condition_group ) )*
  // Evaluate the condition_test
  // If it turns false at any point, then stop evaluating and return false
  // If it is definitively true, then return true

  // Go through all children - child will be either * | ! or Condition or ConditionGroup
  let result = true;
  let shouldNegate = false;
  let lastOperator = null;
  for (let child of ctx.children) {
    // List of Condition or ConditionGroup, with operators.
    console.log(child.getText());

    if (child.getChildCount() == 0) {
      console.log('evaluates() operator : ' + child.getText());
      if (child.getText() == '!') {
        shouldNegate = true;
        continue;
      }
      lastOperator = child.getText();
      continue;
    }
    let intermediateResult;
    // if (child.condition_test() != null) {
    if (child.getText().startsWith('{')) {
      console.log('condition_group : ' + child.getText());
      intermediateResult = this.evaluate_condition_group(child);
    } else {
      console.log('condition : ' + child.getText());
      intermediateResult = this.evaluate_condition(child);
    }
    if (shouldNegate) {
      intermediateResult = !intermediateResult;
      shouldNegate = false;
    }
    if (lastOperator == null) {
      result = intermediateResult;
      continue;
    }
    if (lastOperator == '&') {
      result = result && intermediateResult;
    }
    if (lastOperator == '|') {
      result = result || intermediateResult;
    }
  }
  return result;
};

ModlListener.prototype.evaluate_condition_group = function(ctx) {
  //   : LCBRAC condition_test (( AMP | PIPE ) condition_test)* RCBRAC
  let result = true;
  let lastOperator = null;
  for (let child of ctx.children) {
    if (child.getChildCount() == 0) {
      if (child.getText() == '{' || child.getText() == '}') {
        continue;
      }
      console.log('condition group operator : ' + child.getText());
      lastOperator = child.getText();
      continue;
    }
    if (child.condition() != null) {
      const ctResult = this.evaluates(child);
      if (lastOperator == null) {
        result = ctResult;
        continue;
      }
      if (lastOperator == '&') {
        result = result && ctResult;
      }
      if (lastOperator == '|') {
        result = result || ctResult;
      }
    }
  }
  return result;
};

ModlListener.prototype.evaluate_condition = function(ctx) {
  // TODO
  let key;
  let operator;
  let value;
  const values = [];
  if (ctx.STRING() != null) {
    key = this.getString(ctx.STRING().getText());
    console.log('Key : ' + key);
  }
  if (ctx.operator() != null) {
    operator = ctx.operator().getText();
    console.log('Condition Operator : ' + operator);
  }
  for (let v of ctx.value()) {
    console.log('Value : ' + v.getText());
    value = this.processValue(v);
    values.push(value);
  }

  if (key == null) {
    const origValue = value;
    if (keys[value] != null) {
      value = keys[value];
    }
    if (value == true) {
      return true;
    }
    if (value == false) {
      return false;
    }
    return keys[origValue] != null || keys[origValue.replace('_', '')] != null;
  }
  if (operator == null) {
    console.log('evaluate_condition returning ' + value);
    return value;
  }
  if (keys[key] != null) {
    console.log('Transforming condition key from ' + key + ' to ' + keys[key]);
    key = keys[key];
  }
  if (typeof key == 'string' && key.startsWith('_')) {
    if (keys[key.substring(1, key.length)] != null) {
      console.log('Transforming condition key from ' + key + ' to ' + keys[key]);
      key = keys[key.substring(1, key.length)];
    }
  }
  if (values.length > 1) {
    // If there is more than one value, and the operator is '=', then check ONE of the values equals to return true
    if (operator == '=') {
      for (let v of values) {
        console.log('Testing ' + v + ' against ' + key + ' for ANY match');
        if (v == key) {
          return true;
        }
      }
    }
    return false;
  }
  if (operator == '=') {
    if (typeof value == 'string' && value.indexOf('*') >= 0) {
      return this.equalsWithWildcards(key, value);
    }
    console.log('evaluate_condition equals returning ' + (key == value));
    return key == value;
  }
  if (typeof value == 'string' && !new RegExp('^[0-9]*$').test(value)) {
    if (keys[value] != null) {
      value = keys[value];
    }
  }
  if (operator == '<=') {
    console.log('evaluate_condition <= returning ' + (key <= value));
    return key <= value;
  }
  if (operator == '>=') {
    console.log('evaluate_condition >= returning ' + (key >= value));
    return key >= value;
  }
  if (operator == '!=') {
    if (typeof value == 'string' && value.indexOf('*') >= 0) {
      return !this.equalsWithWildcards(key, value);
    }
    console.log('evaluate_condition != returning ' + (key == value));
    return key != value;
  }
  if (operator == '>') {
    console.log('evaluate_condition > returning ' + (key > value));
    return key > value;
  }
  if (operator == '<') {
    console.log('evaluate_condition < returning ' + (key < value));
    return key < value;
  }
};

ModlListener.prototype.equalsWithWildcards = function(key, val) {
  console.log('Check equals with wildcards : ' + key + ', ' + val);
  let regex = '';
  if (!val.toString().startsWith('*')) {
    regex = '^';
  } else {
    regex = '.*';
  }

  const splits = val.toString().split('*');
  let i = 0;
  for (let split of splits) {
    if (split == '') {
      continue;
    }
    if (i++ > 0) {
      regex += '.*';
    }
    regex += split;
  }
  if (!val.toString().endsWith('*')) {
    regex += '$';
  } else {
    regex += '.*';
  }
  // return key.matches(regex);
  console.log(regex);
  return new RegExp(regex).test(key);
};

///////////////////////////
// String Transformation //
///////////////////////////

// RULES :
// Implement Elliott's algorithm for string transformation :
// 1 : Find all parts of the sting that are enclosed in graves, e.g `test` where neither of the graves is prefixed with an escape character ~ (tilde) or \ (backslash).
// [ 2: If no parts are found, run “Object Referencing detection” ] - basically go to 4:
// 3 : If parts are found loop through them in turn:
//     If a part begins with a % then run “Object Referencing”, else run “Punycode encoded parts”
//     (Punycode :    // Prefix it with xn— (the letters xn and two dashes) and decode using punycode / IDN library. Replace the full part (including graves) with the decoded value.))
// 4: Find all non-space parts of the string that are prefixed with % (percent sign). These are object references – run “Object Referencing”
// 5: Replace the strings as per the txt document attached "string-replacement.txt"

ModlListener.prototype.getString = function(s) {
  s = this.replaceStringReplacements(s);

  s = this.replaceEscapes(s);

  s = this.replaceGravedParts(s);

  let references = this.getObjectReferences(s);
  while (references != null) {
    for (let reference of references) {
      const replacement = this.replaceObjectReferences(reference);
      if (references == s) {
        return replacement;
      }
      // s = s.replace(new RegExp(reference, "g"), replacement);
      if (reference == replacement) {
        references = null;
        break;
      }
      s = s.replace(reference, replacement);
      // s = s.replace(new RegExp(reference, "g"), replacement);
    }
    references = this.getObjectReferences(s);
  }

  return s;
};

ModlListener.prototype.replaceEscapes = function(s) {
  return JSON.parse('"' + s + '"');
};

ModlListener.prototype.replaceGravedParts = function(s) {
  let graveSections = s.match(GRAVE_REGEXP);
  while (graveSections != null) {
    for (let graveSection of graveSections) {
      const adjustedGraveSection = graveSection.substring(1, graveSection.length - 1);
      if (adjustedGraveSection.startsWith('%')) {
        const replacedRef = this.replaceObjectReferences(adjustedGraveSection);
        s = s.replace(graveSection, replacedRef);
      } else {
        const punycode = this.getPunycodeFor(graveSection);
        s = s.replace(graveSection, punycode);
      }
    }
    graveSections = s.match(GRAVE_REGEXP);
  }
  return s;
};

ModlListener.prototype.getObjectReferences = function(s) {
  return s.match(REFERENCE_REGEXP);
};

ModlListener.prototype.getPunycodeFor = function(stringToTransform) {
  if (stringToTransform == null) {
    return stringToTransform;
  }
  if (stringToTransform.startsWith('`') && stringToTransform.endsWith('`')) {
    stringToTransform = stringToTransform.substring(1, stringToTransform.length - 1);
    const originalString = stringToTransform;
    stringToTransform = 'xn--' + stringToTransform;
    // var newStringToTransform = IDN.toUnicode(stringToTransform);
    try {
      const newStringToTransform = punycode.toUnicode(stringToTransform);
      if (newStringToTransform === stringToTransform) {
        stringToTransform = originalString;
      } else {
        stringToTransform = newStringToTransform;
      }
    } catch (err) {
      return originalString;
    }
  }
  return stringToTransform;
};

/*
Object Referencing
If the reference includes a . (dot / full stop / period) then the reference key should be considered everything to the left of the . (dot / full stop / period).

If the reference includes any part enclosed in [ and ] this is a deep object reference, see deep object referencing instructions and return back to this section.

Replace the reference key with the value of that key. We will call this the subject.

If there was a period in the original string, any part to the right of the first period (until the end of the part not including the end grave) is considered the method chain. Split the method chain by . (dot / full stop / period) and create an array from the methods.

Loop through the array and pass the subject to the named method, transforming the subject. Repeat the process (with the transformed subject) until all methods in the chain have been applied and the subject is fully transformed.

Replace the part originally found (including graves) with the transformed subject.
 */
ModlListener.prototype.replaceObjectReferences = function(s) {
  let subject;
  let key;
  // Generic String transformation
  let candidate;
  // Also does deep object references
  if (s == '%') {
    return s;
  }
  if (s.startsWith('%')) {
    candidate = s.substring(1, s.length);

    let toAdd = '';
    let oldCandidate;
    if (candidate.match(/^\d/)) {
      oldCandidate = candidate;
      // Find the prefix number
      // Is the next character a "." or a "["?
      // If so, then leave the whole thing
      // If not, then take ONLY the number section and leave the rest in toAdd
      const numberPart = candidate.match(/^\d*/)[0];
      const characterAfterNumberPart = candidate.substring(
        numberPart.length,
        numberPart.length + 1,
      );
      if (characterAfterNumberPart == '.' || characterAfterNumberPart == '[') {
        // Don't worry
      } else {
        candidate = numberPart;
        toAdd = oldCandidate.substring(candidate.length, oldCandidate.length) + toAdd;
      }
    }

    // Now get the key - everything to the left of the first "."  - or the whole thing if there is no "."
    // If there is a "[...]" bit at the end of the key, then take the key as everything to the the left of "["
    //      - run deep object referencing on the "[...]" bit once we've resolved the actual key
    key = this.getKeyFrom(candidate);
    subject = this.getSubjectFrom(key);
    if (NUMBER_REGEXP.test(key) && objectIndex.length < parseInt(key)) {
      return '%' + subject + toAdd;
    }
    if (subject == key && !NUMBER_REGEXP.test(key)) {
      return s + toAdd;
    }

    if (oldCandidate != null) {
      candidate = oldCandidate;
    }

    if (key != candidate) {
      subject = this.runDeepReferencing(candidate, subject, key);
    }

    if (key != candidate) {
      subject = this.runStringTransformations(subject, candidate);
    }
    if (toAdd.length > 0) {
      return subject + toAdd;
    }
    return subject;
  }
  if (s.startsWith('_')) {
    candidate = s.substring(1, s.length);
    key = this.getKeyFrom(candidate);
    subject = this.getSubjectFrom(key);
    return subject;
  }
  return s;
};

ModlListener.prototype.runDeepReferencing = function(originalInput, subject, key) {
  // Is the first "[" (if it exists) to the left of the first "." (if there is one, or else the end)?
  let references = originalInput.replace(key, '');
  if (references.indexOf('.') > 0) {
    references = references.substring(0, references.indexOf('.'));
  }
  let index = references.indexOf('[');
  // If so, then go through all the "[...]" blocks in order, running object referencing on them
  while (index >= 0) {
    references = references.substring(index + 1, references.length);
    // Do the next reference!!!
    index = references.indexOf('[');
    if (index < 0) {
      index = references.indexOf(']');
    }
    let reference = references.substring(0, index);
    reference = this.getString(reference);

    let tempSubject = subject[reference];
    // if (typeof subject == "ModlPair") {
    // if (Object.values(subject).length == 1) {
    if (tempSubject == null) {
      // subject = subject.getValue();
      tempSubject = Object.values(subject)[0][reference];
    }

    subject = tempSubject;

    index = references.indexOf('[');
  }
  return subject;
};

const INITCAPS = function(toTransform) {
  return toTransform.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};

const REPLACE = function(toTransform, parameter1, parameter2) {
  return toTransform.replace(parameter1, parameter2);
};

const TRIM = function(toTransform, parameter1) {
  let index = toTransform.indexOf(parameter1);
  if (index < 0) {
    index = toTransform.length;
  }
  return toTransform.substring(0, index);
};

const VARIABLE_METHODS = {
  u: function(toTransform) {
    return toTransform.toUpperCase();
  },
  d: function(toTransform) {
    return toTransform.toLowerCase();
  },
  i: INITCAPS,
  initcap: INITCAPS,
  r: REPLACE,
  replace: REPLACE,
  t: TRIM,
  trim: TRIM,
  // "s" : function() { return toTransform.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})},
  s: function(toTransform) {
    return toTransform.charAt(0).toUpperCase() + toTransform.substring(1, toTransform.length);
  },
  ue: function(toTransform) {
    return encodeURIComponent(toTransform);
  }, // .replace(/%20/g, "+")}
};

ModlListener.prototype.loadVariableMethod = function(methodMap) {
  let id = methodMap['*id'];
  if (id == null) {
    id = methodMap['*i'];
  }
  let methodName = methodMap['*name'];
  if (methodName == null) {
    methodName = methodMap['*n'];
  }
  let methodString = methodMap['*transform'];
  if (methodString == null) {
    methodString = methodMap['*t'];
  }
  if (methodString.startsWith('`')) {
    methodString = methodString.substring(1, methodString.length - 1);
  }
  const methodsAndParams = this.getMethodsAndParams(methodString);
  const newFunction = this.getFunctionForVariableMethod(methodsAndParams);
  VARIABLE_METHODS[methodName] = newFunction;
  VARIABLE_METHODS[id] = newFunction;
};

ModlListener.prototype.getFunctionForVariableMethod = function(methodsAndParams) {
  // NEEDS TO CHAIN!!!
  // should give a function which takes methodsAndParams and also toTransform and returns result
  return function(toTransform) {
    for (let methodAndParam of methodsAndParams) {
      const method = Object.keys(methodAndParam)[0];
      const params = methodAndParam[method];
      if (params == null) {
        toTransform = VARIABLE_METHODS[method].call(null, toTransform);
      } else {
        if (params.indexOf(',') < 0) {
          toTransform = VARIABLE_METHODS[method].call(null, toTransform, params);
        } else {
          const paramsArray = params.split(',');
          toTransform = VARIABLE_METHODS[method].call(
            null,
            toTransform,
            paramsArray[0],
            paramsArray[1],
          );
        }
      }
    }
    return toTransform;
  };
};

ModlListener.prototype.getMethodsAndParams = function(methodString) {
  // Need to go through the methodString, and add a new "apply" in the new function for ech of the vairable methods called!
  // e.g. "replace(-, ).trim(.).initcap"
  // So find the first method and its parameters, and add that to the method list
  // Then continue from the end of the params for the first method, and find the second method and its params, and add that to the lambda
  // Keep going until we reach the end of the methodString
  const methodsAndParams = [];
  while (methodString.indexOf('(') > 0 || methodString.length > 0) {
    // Find the next method
    // This can either be by the first bracket, or the first "." - whichever comes first
    const bracketIndex = methodString.indexOf('(');
    const dotIndex = methodString.indexOf('.');
    const endOfStringIndex = methodString.length;
    let actualIndex = bracketIndex;
    if (actualIndex < 0) {
      actualIndex = dotIndex;
    } else {
      if (dotIndex > 0) {
        actualIndex = Math.min(dotIndex, bracketIndex);
      }
    }
    if (actualIndex < 0) {
      actualIndex = endOfStringIndex;
    }

    const intermediateMethodName = methodString.substring(0, actualIndex);

    // Get the parameters
    // If we split on a "(", then we need to find the closing ")" - the stuff inbetween these are the params
    // If we split on ".", then there are no params
    let params = null;
    let endIndex = endOfStringIndex;
    if (actualIndex == bracketIndex) {
      const closeBracketIndex = methodString.indexOf(')');
      params = methodString.substring(bracketIndex + 1, closeBracketIndex);
      endIndex = closeBracketIndex + 1;
      if (endIndex < methodString.length) {
        endIndex++;
      }
    } else {
      if (actualIndex == dotIndex) {
        endIndex = actualIndex + 1;
      }
    }

    // We can build up all the method names and parameters, as we do here
    //  - and then we can build up the whole new function in ONE lambda, with a series of function calls
    //  - each one operating on the last
    //
    const methodAndParam = {};
    methodAndParam[intermediateMethodName] = params;
    methodsAndParams.push(methodAndParam);

    // Adjust the method string
    methodString = methodString.substring(endIndex, methodString.length);
  }
  return methodsAndParams;
};

ModlListener.prototype.runStringTransformations = function(subject, originalInput) {
  // Is there anything to the right of the first "."?
  // If so, then run through them one by one. As long as they are variable methods, then apply them
  // If we have something which is not recognised as a variable method, then just append the text from then on.
  while (true) {
    let indexOfDot = originalInput.indexOf('.');
    if (indexOfDot < 0) {
      return subject;
      // indexOfDot = originalInput.length;
    }
    const postfix = originalInput.substring(indexOfDot + 1, originalInput.length);
    let method = postfix;
    let parameter1;
    let parameter2;
    if (postfix.indexOf('(') >= 0) {
      // We have some parameters.
      method = postfix.substring(0, postfix.indexOf('('));
      const parameterString = postfix.substring(postfix.indexOf('(') + 1, postfix.length - 1);
      const parameters = parameterString.split(',');
      parameter1 = parameters[0];
      if (parameters.length > 1) {
        parameter2 = parameters[1];
      }
    }
    if (VARIABLE_METHODS[method] != null) {
      // APPLY THE VARIABLE METHOD TO THE STRING!
      console.log('FOUND VARIABLE METHOD ' + postfix + '!');
      // toTransform = subject;
      if (parameter1 != null && parameter2 != null) {
        subject = VARIABLE_METHODS[method].call(null, subject, parameter1, parameter2);
      } else if (parameter1 != null) {
        subject = VARIABLE_METHODS[method].call(null, subject, parameter1);
      } else {
        subject = VARIABLE_METHODS[method].call(null, subject);
      }
    } else {
      return subject + '.' + postfix;
    }
    indexOfDot = postfix.indexOf('.');
    if (indexOfDot < 0) {
      indexOfDot = postfix.length;
    }
    originalInput = postfix.substring(indexOfDot + 1, originalInput.length);
  }
  // return subject + (originalInput.substring(subject.length + 1, originalInput.length));
};

ModlListener.prototype.getSubjectFrom = function(key) {
  console.log('Checking regexp for ' + key);
  if (NUMBER_REGEXP.test(key)) {
    console.log('Looking up object index ' + key);
    if (objectIndex.length >= key) {
      return objectIndex[key];
    }
  }

  if (keys[key] != null) {
    return keys[key];
  }
  if (key.startsWith('_')) {
    key = key.substring(1, key.length);
    if (keys[key] != null) {
      return keys[key];
    }
  }
  // throw new Error("Couldn't find " + s);
  return key;
};

ModlListener.prototype.getKeyFrom = function(input) {
  let index = input.indexOf('.');
  if (index >= 0) {
    input = input.substring(0, index);
  }
  index = input.indexOf('[');
  if (index >= 0) {
    input = input.substring(0, index);
  }
  return input;
};

const REPLACEMENTS = {
  '~\\': '\\',
  '\\\\': '\\',
  '~~': '~',
  '\\~': '~',

  '~(': '(',
  '\\(': '(',
  '~)': ')',
  '\\)': ')',

  '~[': '[',
  '\\[': '[',
  '~]': ']',
  '\\]': ']',

  '~{': '{',
  '\\{': '{',
  '~}': '}',
  '\\}': '}',

  '~;': ';',
  '\\;': ';',
  '~:': ':',
  '\\:': ':',

  '~`': '`',
  '\\`': '`',
  '~"': '"',
  '\\"': '"',

  '~=': '=',
  '\\=': '=',
  '~/': '/',
  '\\/': '/',

  '<': '<',
  '\\<': '<',
  '~>': '>',
  '\\>': '>',

  '~&': '&',
  '\\&': '&',

  '!': '!',
  '\\!': '!',
  '~|': '|',
  '\\|': '|',

  '\\t': '\t',
  '\\n': '\n',
  '\\b': '\b',
  '\\f': '\f',
  '\\r': '\r',
};

//  STRING REPLACEMENTS
ModlListener.prototype.replaceStringReplacements = function(stringToTransform) {
  for (let key of Object.keys(REPLACEMENTS)) {
    const toReplace = key;
    const replacement = REPLACEMENTS[key];
    if (stringToTransform.indexOf(toReplace) > -1) {
      stringToTransform = stringToTransform.replace(toReplace, replacement);
    }
  }

  return stringToTransform;
};

ModlListener.initialiseLoadedClasses = function() {
  const loadedClass = {};
  loadedClass['*superclass'] = 'map';
  loadedClass['*name'] = 'o';
  loadedClass['*output'] = 'map';

  this.loadedClasses['o'] = loadedClass;
};

// CLASS LOADER
ModlListener.prototype.loadClass = function(inputMap) {
  // TODO We need to load the new class
  // Load in the new klass
  const loadedClass = {};
  let id = inputMap['*id'];
  if (id == null) {
    id = inputMap['*i'];
  }
  if (id == null) {
    throw new Error("Can't find *id in *class");
  }
  loadedClasses[id] = loadedClass;
  let superclass = inputMap['*superclass'];
  if (superclass == null) {
    superclass = inputMap['*s'];
  }
  loadedClass['*superclass'] = superclass;
  let name = inputMap['*name'];
  if (name == null) {
    name = inputMap['*n'];
  }
  if (name == null) {
    name = id;
  }
  // Remember to see if there is a superclass - if so, then copy all its values in first
  const superKlass = loadedClasses[superclass];
  if (superclass != null) {
    if (superclass.toUpperCase() == superclass) {
      throw new Error(
        "Can't derive from " + superclass + ', as it in upper case and therefore fixed',
      );
    }
  }
  if (superKlass != null) {
    for (let key of Object.keys(superKlass)) {
      loadedClass[key] = superKlass[key];
    }
  }

  // Go through the structure and find all the new values and add them (replacing any already there from superklass)
  // for (RawModlObject.Pair mapItem : ((ModlObject.Map)((ModlObject.Pair)structure).getModlValue()).getPairs()) {
  for (let mapKey of Object.keys(inputMap)) {
    // Remember to avoid "_id" and "_sc" !
    if (mapKey == '*id' || mapKey == '*i' || mapKey == '*superclass' || mapKey == '*s') {
      continue;
    }
    if (mapKey == '*assign' || mapKey == '*a') {
      if (inputMap[mapKey] instanceof ModlArray) {
        this.loadParams(loadedClass, inputMap[mapKey]);
      }
      continue;
    }
    // Now add the new value
    // loadedClass[mapKey] = mapItem.getModlValue();
    loadedClass[mapKey] = inputMap[mapKey];
  }
};

ModlListener.prototype.loadParams = function(values, array) {
  // _params : add like _params<n> where n is number of values in array
  for (let a of array) {
    const key = '*params' + a.length;
    const vs = [];
    for (let ai of a) {
      vs.push(ai);
    }
    values[key] = vs;
  }
};

ModlListener.prototype.loadClassFrom = function(name, valueInput) {
  // TODO Create the specified class from loadedClasses

  const klass = loadedClasses[name];

  const pair = new ModlPair();
  let key = klass['*name'];
  if (key == null) {
    key = klass['*n'];
  }

  let value;
  if (klass['*superclass'] == 'map' || klass['*superclass'] == null) {
    value = {}; // TODO Can this be an array?!
  } else if (klass['*superclass'] == 'arr') {
    value = [];
  } else if (klass['*superclass'] == 'str') {
    value = valueInput;
    pair[key] = value;
    return pair;
  }

  // If there is an *assign, then load in the values and create the right types
  // Remember we might need to create a new class instance here! (i.e. classes can be nested)
  this.loadAssignParameters(klass, value, valueInput);

  // Now add all other properties defined in the original valueInput
  // ONLY IF THEY HAVE NOT BEEN ABSORBED BY *assign !!
  for (const itemKey of Object.keys(valueInput)) {
    value[itemKey] = valueInput[itemKey];
  }

  // Now go through and add all the defined parameters in the class and superclasses
  for (let classKey of Object.keys(klass)) {
    if (!classKey.startsWith('_') && !(classKey.startsWith('*') && !(classKey == '?'))) {
      if (value[classKey] != null) {
        // Only add the new key if it does not already exist in the pair!
        continue;
      }
      value[classKey] = klass[classKey];
    }
  }

  pair[key] = value;
  return pair;
};

ModlListener.prototype.loadAssignParameters = function(klass, newValueMap, valueInput) {
  const numParams = valueInput.length;
  if (klass['*params' + numParams] != null) {
    // We've got some params to load!
    const assignedParams = klass['*params' + numParams];
    const keys = Object.keys(valueInput);
    let count = 0;
    for (const assignedParam of assignedParams) {
      let value = valueInput[keys[count]];

      if (assignedParams.length == 1) {
        value = valueInput;
      }

      if (loadedClasses[assignedParam] != null) {
        value = this.loadClassFrom(assignedParam, value);
        let name = loadedClasses[assignedParam]['*name'];
        if (name == null) name = loadedClasses[assignedParam]['*n'];
        newValueMap[name] = value[name];
      } else {
        newValueMap[assignedParam] = value;
      }
      delete valueInput[keys[count]];
      count++;
    }
  }
};
