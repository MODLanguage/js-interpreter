class ModlValue extends Object {
    }

    class ModlStructure extends ModlValue {
    }

    class ModlObject extends Array<ModlStructure> {
        toJSON() {
            if (this.length == 1) {
                return this[0];
            }
            return this;
        }
    }


    class ModlMap extends ModlStructure {
        [key: string] : ModlValue
    }

    class ModlArray extends Array<ModlValue> implements ModlStructure {
    }

    class ModlPair extends ModlStructure {
    }


    class ConditionTest {

    }

    class TopLevelConditional {

    }

    class TopLevelConditionalReturn extends Array<ModlStructure> {

    }

    class ValueConditional {

    }

    class ValueConditionalReturn extends Array { // <ValueItem> {

    }

    class ArrayConditional {

    }

    class ArrayConditionalReturn extends Array { // <ValueItem> {

    }

    class MapConditional {

    }

    class MapConditionalReturn extends Array { // <ValueItem> {

    }


export { ModlObject, ModlStructure, ModlPair, ModlMap, ModlArray, ModlValue, ConditionTest,
    TopLevelConditional, TopLevelConditionalReturn, ValueConditional, ValueConditionalReturn,
    ArrayConditional, ArrayConditionalReturn, MapConditional, MapConditionalReturn};

