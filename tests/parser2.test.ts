const ModlListener = require('../src/ModlListener').ModlListener;

const ModlObject = require('../src/ModlObject').ModlObject;

var assert = require('assert');
let parser2Input = [
    ["*class(\n" +
    "  *id=car\n" +
    "  *name=car\n" +
    "  *superclass=map\n" +
    "  *assign=[\n" +
    "    [m]\n" +
    "    [m;md]\n" +
    "  ]\n" +
    ")\n" +
    "\n" +
    "_C=gb\n" +
    "\n" +
    "car=Bentley:{C=ru?ContinentalRussia GT/?Continental GT}",
        "{\n" +
        "  \"car\" : {\n" +
        "    \"m\" : \"Bentley\",\n" +
        "    \"md\" : \"Continental GT\"\n" +
        "  }\n" +
        "}"],

    ["*class(\n" +
    "  *id=g\n" +
    "  *name=glossary\n" +
    "  *superclass=map\n" +
    ")\n" +
    "*class(\n" +
    "  *id=t\n" +
    "  *name=title\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=d\n" +
    "  *name=GlossDiv\n" +
    "  *superclass=map\n" +
    ")\n" +
    "*class(\n" +
    "  *id=l\n" +
    "  *name=GlossList\n" +
    "  *superclass=map\n" +
    ")\n" +
    "*class(\n" +
    "  *id=e\n" +
    "  *name=GlossEntry\n" +
    "  *superclass=map\n" +
    "  *assign[\n" +
    "    [i;s;gt;a;ab;gd;gs]\n" +
    "  ]\n" +
    ")\n" +
    "*class(\n" +
    "  *id=i\n" +
    "  *name=ID\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=s\n" +
    "  *name=SortAs\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=gt\n" +
    "  *name=GlossTerm\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=a\n" +
    "  *name=Acronym\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=ab\n" +
    "  *name=Abbrev\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=gd\n" +
    "  *name=GlossDef\n" +
    "  *superclass=map\n" +
    "  *assign=[\n" +
    "    [p]\n" +
    "    [p;sa]\n" +
    "  ]\n" +
    ")\n" +
    "*class(\n" +
    "  *id=p\n" +
    "  *name=para\n" +
    "  *superclass=str\n" +
    ")\n" +
    "*class(\n" +
    "  *id=sa\n" +
    "  *name=SeeAlso\n" +
    "  *superclass=arr\n" +
    ")\n" +
    "*class(\n" +
    "  *id=gs\n" +
    "  *name=GlossSee\n" +
    "  *superclass=str\n" +
    ")\n" +
    "\n" +
    "g(\n" +
    "  ?=[SGML;markup;language]\n" +
    "  t=example glossary\n" +
    "  d(\n" +
    "    t=S\n" +
    "    l(\n" +
    "      e(\n" +
    "        i=%0\n" +
    "        s=%0\n" +
    "        gt=Standard Generalized %1.s %2.s\n" +
    "        a=%0\n" +
    "        ab=ISO 8879\\:1986\n" +
    "        gd=A meta-%1 %2, used to create %1 %2s such as DocBook.\n" +
    "          :[GML;XML]\n" +
    "        gs=%1\n" +
    "      )\n" +
    "    )\n" +
    "  )\n" +
    ")\n",
        "{\n" +
        "  \"glossary\":{\n" +
        "    \"title\":\"example glossary\",\n" +
        "    \"GlossDiv\":{\n" +
        "      \"title\":\"S\",\n" +
        "      \"GlossList\":{\n" +
        "        \"GlossEntry\":{\n" +
        "          \"ID\":\"SGML\",\n" +
        "          \"SortAs\":\"SGML\",\n" +
        "          \"GlossTerm\":\"Standard Generalized Markup Language\",\n" +
        "          \"Acronym\":\"SGML\",\n" +
        "          \"Abbrev\":\"ISO 8879:1986\",\n" +
        "          \"GlossDef\":{\n" +
        "            \"para\":\"A meta-markup language, used to create markup languages such as DocBook.\",\n" +
        "            \"SeeAlso\":[\"GML\",\"XML\"]\n" +
        "          },\n" +
        "          \"GlossSee\":\"markup\"\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}"
    ],
    ["?=[a;b;c;d]:[1;2;3;4;5]\n" +
    "test=%1[0]",
        "{\n" +
        "    \"test\": 1\n" +
        "}"],
    ["?=0:1:2\n" +
    "zero=%0\n" +
    "one=%1\n" +
    "two=%2", "[\n" +
    "    {\n" +
    "        \"zero\": 0\n" +
    "    },\n" +
    "    {\n" +
    "        \"one\": 1\n" +
    "    },\n" +
    "    {\n" +
    "        \"two\": 2\n" +
    "    }\n" +
    "]"],

        ["*class(\n" +
    "  *id=desc\n" +
    "  *name=description\n" +
    "  *superclass=str\n" +
    ")\n" +
    "\n" +
    "*class(\n" +
    "  *id=val\n" +
    "  *name=value\n" +
    "  *superclass=str\n" +
    ")\n" +
    "\n" +
    "*class(\n" +
    "  *id=media1\n" +
    "  *name=media1\n" +
    "  *superclass=map\n" +
    "  *assign=[\n" +
    "    [desc;val]\n" +
    "  ]\n" +
    ")\n" +
    "\n" +
    "*class(\n" +
    "  *id=media2\n" +
    "  *name=media2\n" +
    "  *superclass=map\n" +
    "  *assign=[\n" +
    "    [desc;val]\n" +
    "  ]\n" +
    ")\n" +
    "*class(\n" +
    "  *id=list\n" +
    "  *name=list\n" +
    "  *superclass=map\n" +
    "  *assign[\n" +
    "    [media1;media2]\n" +
    "  ]\n" +
    ")\n" +
    "\n" +
    "\n" +
    "list=[tel;fb]:[yt;tw]",
//                        "list=[[tel;fb];[yt;tw]]",
//                        "list=(tel:fb):(yt:tw)",
        "{\n" +
        "  \"list\" : {\n" +
        "    \"media1\" : {\n" +
        "      \"description\" : \"tel\",\n" +
        "      \"value\" : \"fb\"\n" +
        "    },\n" +
        "    \"media2\" : {\n" +
        "      \"description\" : \"yt\",\n" +
        "      \"value\" : \"tw\"\n" +
        "    }\n" +
        "  }\n" +
        "}"],
    ["*c(\n" +
    "  *i=m\n" +
    "  *n=message\n" +
    "  *s=map\n" +
    "  *a=[\n" +
    "    [direction;date_time;message]\n" +
    "  ]\n" +
    "  method=sms\n" +
    ")\n" +
    "m=in:2018-03-22:hi",
        "{\n" +
        "  \"message\" : {\n" +
        "    \"direction\" : \"in\",\n" +
        "    \"date_time\" : \"2018-03-22\",\n" +
        "    \"message\" : \"hi\",\n" +
        "    \"method\" : \"sms\"\n" +
        "  }\n" +
        "}"],
    ["*class(\n" +
    "  *id=p\n" +
    "  *name=person\n" +
    ")\n" +
    "\n" +
    "p(name=John Smith;dob=01/01/2000)","{\n" +
    "    \"person\": {\n" +
    "        \"name\": \"John Smith\",\n" +
    "        \"dob\": \"01/01/2000\"\n" +
    "    }\n" +
    "}"],
    ["*class(\n" +
    "  *id=car\n" +
    "  *name=car\n" +
    "  *superclass=map\n" +
    ")\n" +
    "\n" +
    "car(\n" +
    "  make=Bentley\n" +
    ")",
        "{\n" +
        "  \"car\" : {\n" +
        "    \"make\" : \"Bentley\"\n" +
        "  }\n" +
        "}"],
    ["*class(\n" +
    "  *id=p\n" +
    "  *name=person\n" +
    "  *superclass=map\n" +
    ")\n" +
    "\n" +
    "p(name=John Smith;dob=01/01/2000)","{\n" +
    "    \"person\": {\n" +
    "        \"name\": \"John Smith\",\n" +
    "        \"dob\": \"01/01/2000\"\n" +
    "    }\n" +
    "}"],

    ["*method(\n" +
    "  ## The method can be called by it's ID or name\n" +
    "  *id=cn\n" +
    "  *name=company_name\n" +
    "  ## The value of the object that the method is called on is transformed using the following methods:\n" +
    "  *transform=`replace(-, ).trim(.).initcap`\n" +
    ")\n" +
    "\n" +
    "_domain = smiths-limited.com\n" +
    "friendly_name = %domain.cn ## The value \"Smiths Limited\" is assigned to the key \"friendly_name\"",
        "{\n" +
        "    \"friendly_name\": \"Smiths Limited\"\n" +
        "}"],
    ["*method(\n" +
    "  *id=rt\n" +
    "  *name=remove_two\n" +
    "  *transform=`replace(two,)`\n" +
    ")\n" +
    "\n" +
    "_numbers = one two three\n" +
    "name = %numbers.rt",
        "{ \"name\": \"one  three\" }"],
    ["?=one:two\n" +
    "test=Blah `%0.r(o,huzzah)` `%1.t(w)`",
        "{\"test\":\"Blah huzzahne t\"}"],
    ["alex=1.2345", "{\"alex\":1.2345}"],
    [/* From Trello variable methods card */
        "  _testing = quick-test of Elliott's variable_methods\n" +
        "upcase_example = %testing.u\n" +
        "downcase_example = %testing.d\n" +
        "initcap_example = %testing.i\n" +
        "sentence_example = %testing.s\n" +
        "url_encode_example = %testing.ue",
        "[\n" +
        "  {\n" +
        "    \"upcase_example\" : \"QUICK-TEST OF ELLIOTT'S VARIABLE_METHODS\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"downcase_example\" : \"quick-test of elliott's variable_methods\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"initcap_example\" : \"Quick-test Of Elliott's Variable_methods\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"sentence_example\" :  \"Quick-test of Elliott's variable_methods\"\n" +
        "  },\n" +
        "  {\n" +
            // TODO IS THIS RIGHT?!?!
        "    \"url_encode_example\" : \"quick-test%20of%20Elliott's%20variable_methods\"\n" +
        "  }\n" +
        "]"],
    ["?=[one;two]\n" +
    "test=Blah `%0.s` %1.s",
        "{\"test\":\"Blah One Two\"}"],
    ["_person(  \n" +
    "  name(\n" +
    "    first=John\n" +
    "    last=Smith\n" +
    "  )\n" +
    ")\n" +
    "say=Hi %person[name[first]]",
        "{\n" +
        "    \"say\": \"Hi John\"\n" +
        "}"],
    ["_person(  \n" +
    "  name(\n" +
    "    first=John\n" +
    "    last=Smith\n" +
    "  )\n" +
    ")\n" +
    "say=\"Hi, my name is %person[name[first]] %person[name[last]]\"",
        "{\n" +
        "  \"say\" : \"Hi, my name is John Smith\"\n" +
        "}"],
    ["test=\\u0021",
        "{\n" +
        "  \"test\" : \"!\"\n" +
        "}"],
    ["test=`test`",
        "{\n" +
        "  \"test\" : \"test\"\n" +
        "}"],
    ["_var = NotThisOne;_var=`%var`blah;out=`%var`deblah",
        "{\n" +
        "  \"out\" : \"NotThisOneblahdeblah\"\n" +
        "}"],
    ["_var = NotThisOne;_var=blah;out=`%var`deblah",
        "{\n" +
        "  \"out\" : \"blahdeblah\"\n" +
        "}"],
    ["test=100%",
        "{\"test\":\"100%\"}"],
    ["_branch=\"\"\n" +
    "_root=\"\"\n" +
    "namespace=`%branch`numrecord.`%root`",
        "{\n" +
        "  \"namespace\" : \"numrecord.\"\n" +
        "}"],
    ["_root=tesco.com\n" +
    "_branch=direct.\n" +
    "namespace1=`%branch`numrecord.`%root`\n" +
    "namespace2=`%branch`_`%root`.numq.net",
        "[ {\n" +
        "  \"namespace1\" : \"direct.numrecord.tesco.com\"\n" +
        "}, {\n" +
        "  \"namespace2\" : \"direct._tesco.com.numq.net\"\n" +
        "} ]\n"],
    ["_branch=\"alex.\";_root=d;namespace=`%branch`blah.`%root`",
        "{\"namespace\":\"alex.blah.d\"}"
    ],
    ["namespace=`%branch`blah.`%root`",
        "{\"namespace\":\"%branchblah.%root\"}"
    ],
    ["\n" +
    "_test=abc\n" +
    "\n" +
    "{\n" +
    "  test?\n" +
    "    result=test is defined\n" +
    "  /?\n" +
    "    result=test is not defined\n" +
    "}",
        "{\n" +
        "  \"result\" : \"test is defined\"\n" +
        "}\n"],
    ["{\n" +
    "  test?\n" +
    "    result=test is defined\n" +
    "  /?\n" +
    "    result=test is not defined\n" +
    "}\n",
        "{\n" +
        "  \"result\" : \"test is not defined\"\n" +
        "}\n"],
    ["_test=1\n" +
    "result={\n" +
    "  _test=1?\n" +
    "    yes\n" +
    "  /?\n" +
    "    no\n" +
    "}",
        "{ \"result\": \"yes\" }"],
    ["_C=gb\n" +
    "_COUNTRIES(\n" +
    "  us=United States\n" +
    "  gb=United Kingdom\n" +
    "  de=Germany\n" +
    ")\n" +
    "\n" +
    "country_name = %COUNTRIES[%C]", "{\n" +
    "  \"country_name\" : \"United Kingdom\"\n" +
    "}"],
    ["_co=gb\n" +
    "country=The country is %co",
        "{\n" +
        "  \"country\" : \"The country is gb\"\n" +
        "}"],
    ["_co = gb\n" +
    "test = {\n" +
    "  co = gb?\n" +
    "    UK\n" +
    "  /?\n" +
    "    Other\n" +
    "}",
        "{\"test\" : \"UK\" }"],
    ["_COUNTRY=gb\n" +
    "country=The country is %COUNTRY",
        "{\n" +
        "  \"country\" : \"The country is gb\"\n" +
        "}"],
    ["_test_vars(\n" +
    "  one = 1\n" +
    "  two = 2\n" +
    ")\n" +
    "\n" +
    "first_number = %test_vars[one]", "{\n" +
    "  \"first_number\" : 1\n" +
    "}"],
    ["_C=gb\n" +
    "_COUNTRIES[\n" +
    "  United States\n" +
    "  United Kingdom\n" +
    "  Germany\n" +
    "]\n" +
    "\n" +
    "country_name = %COUNTRIES[0]",
        "{ \"country_name\" : \"United States\" }"],

    ["(_C=gb\n" +
    "{C=gb?test1=123}\n" +
    "test2=456)",
        "{\n" +
        "  \"test1\" : 123,\n" +
        "  \"test2\" : 456\n" +
        "}"],
    ["_test=1\n" +
    "result={\n" +
    "  %test=1?\n" +
    "    yes\n" +
    "  /?\n" +
    "    no\n" +
    "}",
        "{ \"result\": \"yes\" }"],
    ["_test=1\n" +
    "result={\n" +
    "  test=1?\n" +
    "    yes\n" +
    "  /?\n" +
    "    no\n" +
    "}",
        "{ \"result\": \"yes\" }"],
    ["_test=1\n" +
    "result={\n" +
    "  %_test=1?\n" +
    "    yes\n" +
    "  /?\n" +
    "    no\n" +
    "}",
        "{ \"result\": \"yes\" }"],
    ["_test=1~:2\n" +
    "\n" +
    "result={\n" +
    "  test=1~:2?\n" +
    "      yes\n" +
    "  /?\n" +
    "     no\n" +
    "}", "{ \"result\": \"yes\" }"],
    ["_test[\n" +
    "  numbers[\n" +
    "    1;2;3;4;5\n" +
    "]\n" +
    "  letters[\n" +
    "    a;b;c;d\n" +
    "  ]\n" +
    "]\n" +
    "\n" +
    "a=%test[0[0]]",
        "{\"a\":1}"],
    ["_person(  \n" +
    "  name(\n" +
    "    first=\"John\"\n" +
    "  )\n" +
    ")\n" +
    "a=%person[name[first]]",
        "{\"a\":\"John\"}"],
    ["_test[\n" +
    "  [\n" +
    "    1;2;3;4;5\n" +
    "]\n" +
    "  [\n" +
    "    a;b;c;d\n" +
    "  ]\n" +
    "]\n" +
    "\n" +
    "a=%test[0[0]]",
        "{\"a\":1}"],
    ["_test[a;b;c];alex=%test[0]", "{\n" +
    "  \"alex\" : \"a\"\n" +
    "}"],
    ["?=zero:one:two\n" +
    "discount=%30",
        "{ \n" +
        "  \"discount\": \"%30\"\n" +
        "}"],
    ["_test=\"123\"\n" +
    "object(\n" +
    "  print_test = %test.test\n" +
    ")", "{\"object\":{\"print_test\":\"123.test\"}}"],
    ["?[[a;b;c];[one;two;three]];letters=%0;numbers=%1",
        " [ {\n" +
        " \"letters\" : [ \"a\", \"b\", \"c\" ]\n" +
        "}, {\n" +
        " \"numbers\" : [ \"one\", \"two\", \"three\" ]\n" +
        "} ]"],

    ["_test[a;b;c];alex=%test", "{\n" +
    "  \"alex\" : [ \"a\", \"b\", \"c\" ]\n" +
    "}"],
    ["?[a;b;c];alex=%0", "{\n" +
    "  \"alex\" :  \"a\"\n" +
    "}"],
    ["_bool=true\n" +
    "{\n" +
    "%bool?\n" +
    "  test=1\n" +
    "}", "{\n" +
    "  \"test\":1\n" +
    "}"],
    ["_test = 123\n" +
    "_test2 = abc",
        "[]"],
    ["_co=gb\n" +
    "test=123",
        "{ \"test\" : 123 }"],
    ["true2 = 01\n" +
    "true1 = true\n" +
    "false2 = 00\n" +
    "false1 = false\n" +
    "null2 = 000\n" +
    "null1 = null",
        "[\n" +
        "  { \"true2\" : true },\n" +
        "  { \"true1\" : true },\n" +
        "  { \"false2\" : false },\n" +
        "  { \"false1\" : false },\n" +
        "  { \"null2\" : null },\n" +
        "  { \"null1\" : null }\n" +
        "]"],
    ["_test=123\n" +
    "print=%_test",
        "{\n" +
        "    \"print\": 123\n" +
        "}"],
    ["_test=abcdefg\n" +
    "result={\n" +
    "  {test!=a*}?\n" +
    "    in\n" +
    "  /?\n" +
    "    out\n" +
    "}", "{\n" +
    "    \"result\": \"out\"\n" +
    "}"],
    ["_num1 = 5\n" +
    "_num2 = 2\n" +
    "\n" +
    "result={\n" +
    "  num1>num2?\n" +
    "    num1 is bigger\n" +
    "  /?\n" +
    "    num1 is not bigger\n" +
    "}", "{\n" +
    "    \"result\": \"num1 is bigger\"\n" +
    "}"],
    ["{\n" +
    "true?\n" +
    "  test=1\n" +
    "}", "{\n" +
    "  \"test\":1\n" +
    "}"],
    ["{\n" +
    "01?\n" +
    "  test=1\n" +
    "}", "{\n" +
    "  \"test\":1\n" +
    "}"],
    ["{\n" +
    "TRUE?\n" +
    "  test=1\n" +
    "}", "{\n" +
    "  \"test\":1\n" +
    "}"],
    ["test=()", "{\n" +
    "  \"test\":{}\n" +
    "}"],
    ["test=[]", "{\n" +
    "  \"test\":[]\n" +
    "}"],
    ["test(\n" +
    "  empty_array=[]\n" +
    "  empty_map=()\n" +
    ")\n", "{\n" +
    "  \"test\": {\n" +
    "    \"empty_array\":[],\n" +
    "    \"empty_map\":{}\n" +
    "  }\n" +
    "}"],
    ["test(\n" +
    "  map(\n" +
    "    array[]\n" +
    "  )\n" +
    "  array[\n" +
    "    map()\n" +
    "    array[1;2;3]\n" +
    "  ]\n" +
    ")\n", "{\n" +
    "  \"test\": {\n" +
    "    \"map\": {\n" +
    "      \"array\": []\n" +
    "    },\n" +
    "    \"array\": [{\n" +
    "        \"map\": {}\n" +
    "      },\n" +
    "      {\n" +
    "        \"array\": [1, 2, 3]\n" +
    "      }\n" +
    "    ]\n" +
    "  }\n" +
    "}"],
    ["_num1 = 2\n" +
    "_num2 = 1000\n" +
    "\n" +
    "result={\n" +
    "  num1>num2?\n" +
    "    num1 is bigger\n" +
    "  /?\n" +
    "    num1 is not bigger\n" +
    "}\n", "{\n" +
    "    \"result\": \"num1 is not bigger\"\n" +
    "}"],
    ["?=a:b:c\n" +
    "zero=%0\n" +
    "one=%1\n" +
    "two=%2\n", "[\n" +
    "    {\n" +
    "        \"zero\": \"a\"\n" +
    "    },\n" +
    "    {\n" +
    "        \"one\": \"b\"\n" +
    "    },\n" +
    "    {\n" +
    "        \"two\": \"c\"\n" +
    "    }\n" +
    "]"],
    ["\"test\"=1","{\n" +
    "  \"test\" : 1\n" +
    "}"],
    ["?=\"A\":B:C\n" +
    "first_letter=%0","{ \"first_letter\" : \"A\" }"],
    ["?=0:1:2\n" +
    "result={\n" +
    "%1>1?\n" +
    "  yes\n" +
    "/?\n" +
    "  no\n" +
    "}", "{\n" +
    "  \"result\":\"no\"\n" +
    "}"],
    ["?=[a;b;c]:[one;two;three];letters=%0;numbers=%1", "[{\n" +
    "    \"letters\": [ \"a\", \"b\", \"c\"]},\n" +
    "    {\"numbers\": [ \"one\", \"two\", \"three\"]\n" +
    "}]"],
    ["?[a;b;c];letters=%0", " {\n" +
    " \"letters\" : \"a\"\n" +
    "}"],
    ["?=[a;b;c]:[one;two;three];letters=%0;numbers=%1",
        "[ {\n" +
        "  \"letters\" : [ \"a\", \"b\", \"c\" ]\n" +
        "}, {\n" +
        "  \"numbers\" : [ \"one\", \"two\", \"three\" ]\n" +
        "} ]"],
    ["test=[zero;one]:[a;b]",
        "{\n" +
        "  \"test\" : [ \n" +
        "    [\"zero\", \"one\" ],\n" +
        "    [\"a\", \"b\" ]\n" +
        "  ]\n" +
        "}"],
    ["test=[zero;one]:[a;b]",
        "{\n" +
        "  \"test\" : [ \n" +
        "    [\"zero\", \"one\" ],\n" +
        "    [\"a\", \"b\" ]\n" +
        "  ]\n" +
        "}"],
    ["?[zero;one;two]\n" +
    "first_var=%0\n" +
    "second_var=%1\n" +
    "third_var=%2",
        " [{\n" +
        " \"first_var\" : \"zero\"\n" +
        "},\n" +
        "{\n" +
        " \"second_var\" : \"one\"\n" +
        "},\n" +
        "{\n" +
        " \"third_var\" : \"two\"\n" +
        "}\n" +
        "]"],
    ["?=[a;b;c;d]:[1;2;3;4;5]\n" +
    "test=%1",
        "{\n" +
        "    \"test\": [1,2,3,4,5]\n" +
        "}"],


    ["_test=\"http://www.tesco.com\"\n" +
    "\n" +
    "result={\n" +
    "  test=\"http://www.tesco.com\"?\n" +
    "      yes\n" +
    "  /?\n" +
    "     no\n" +
    "}", "{\n" +
    "  \"result\" : \"yes\"\n" +
    "}"],
    ["_test=\"http://www.tesco.com\"\n" +
    "\n" +
    "result={\n" +
    "  test=\"http://www.tesco.com\"?\n" +
    "      yes\n" +
    "  /?\n" +
    "     no\n" +
    "}", "{\n" +
    "  \"result\" : \"yes\"\n" +
    "}"],
    ["test=[zero;one]",
        "{\n" +
        "  \"test\" : [ \"zero\", \"one\" ]\n" +
        "}"],
    ["test=[zero;one]",
        "{\n" +
        "  \"test\" : [ \"zero\", \"one\" ]\n" +
        "}"],
    [/* nested conditionals */
        "_co=at\n" +
        " _l=de\n" +
        "{\n" +
        "  co=at?\n" +
        "    country=Austria\n" +
        "    language={\n" +
        "      l=fr?\n" +
        "        French\n" +
        "      /l=de?\n" +
        "        German\n" +
        "      /?\n" +
        "        Other\n" +
        "    }\n" +
        "  /?\n" +
        "    country=Other\n" +
        "}",
        "[ {\n" +
        "  \"country\" : \"Austria\"\n" +
        "}, {\n" +
        "  \"language\" : \"German\"\n" +
        "} ]"],
    ["_C=fr\n" +
    "{C=gb?test1=123}\n" +
    "test2=456",
        "{\n" +
        "  \"test2\" : 456\n" +
        "}"],
    ["_C=ca\n" +
    "_L=en\n" +
    "{\n" +
    "  C=ca?\n" +
    "   n=Tesco Canada\n" +
    "   {L=fr?\n" +
    "     s=Chaque Petite Contribution\n" +
    "   }\n" +
    "}",
        "{\n" +
        "  \"n\" : \"Tesco Canada\"\n" +
        "}"],
    ["_L=en\n" +
    "{\n" +
    "  C=ca?\n" +
    "     o(\n" +
    "       n=Tesco Canada\n" +
    "       s={L=fr?\n" +
    "         Chaque Petite Contribution\n" +
    "       /?\n" +
    "         Every Little Helps\n" +
    "       }\n" +
    "     )\n" +
    "}","[]"],
    ["_letter=a\n" +
    "{\n" +
    "  letter=a?\n" +
    "    word=Apple\n" +
    "  /letter=b?\n" +
    "    word=Bee\n" +
    "  /?\n" +
    "    word=Other\n" +
    "}",
        "{\n" +
        "  \"word\" : \"Apple\"\n" +
        "}"],
    ["_int=1\n" +
    "{\n" +
    "  int=1?\n" +
    "    number=one\n" +
    "  /int=2?\n" +
    "    number=two\n" +
    "  /int=3?\n" +
    "    number=three\n" +
    "  /?\n" +
    "    number=other\n" +
    "}",
        "{\n" +
        "  \"number\" : \"one\"\n" +
        "}"],
    ["_number=one\n" +
    "{\n" +
    "  number=one?\n" +
    "    int=1\n" +
    "  /number=two?\n" +
    "    int=2\n" +
    "  /number=three?\n" +
    "    int=3\n" +
    "}",
        "{\n" +
        "  \"int\" : 1\n" +
        "}"],
    ["_co=gb\n" +
    "{\n" +
    "co=gb?\n" +
    "  country = United Kingdom\n" +
    "/?\n" +
    "  country = Other\n" +
    "}",
        "{\n" +
        "  \"country\" : \"United Kingdom\"\n" +
        "}"],
    ["_co=gb\n" +
    "{\n" +
    "co=gb?\n" +
    "  country = United Kingdom\n" +
    "/?\n" +
    "  country = Other\n" +
    "}",
        "{\n" +
        "  \"country\" : \"United Kingdom\"\n" +
        "}"],
    ["_co = gb\n" +
    "test = {\n" +
    "  co = gb?\n" +
    "    test=123\n" +
    "  /?\n" +
    "    test\n" +
    "}",
        "{\"test\": { \"test\" : 123 }}"],
    ["_co = fr\n" +
    "test = {\n" +
    "  co = gb?\n" +
    "    test=123\n" +
    "  /?\n" +
    "    test\n" +
    "}",
        "{\"test\": \"test\"}"],
    ["_C=gb\n" +
    "o(\n" +
    " {C=gb?test1=123}\n" +
    " test2=456\n" +
    ")",
        "{\n" +
        "  \"o\" : {\n" +
        "    \"test1\" : 123,\n" +
        "    \"test2\" : 456\n" +
        "  }\n" +
        "}"],
    ["{\n" +
    "true?\n" +
    "  test=1\n" +
    "}", "{\n" +
    "  \"test\":1\n" +
    "}"],
    ["{\n" +
    "  !test?\n" +
    "    result=test is not defined\n" +
    "  /?\n" +
    "    result=test is defined\n" +
    "}\n",
        "{\n" +
        "  \"result\" : \"test is not defined\"\n" +
        "}"],
    ["_test=false\n" +
    "\n" +
    "{\n" +
    "  test?\n" +
    "    result=result is true\n" +
    "  /?\n" +
    "    result=result is false\n" +
    "}",
        "{\n" +
        "  \"result\" : \"result is false\"\n" +
        "}"],
    ["{\n" +
    "  true?\n" +
    "    result=true\n" +
    "}\n",
        "{\n" +
        "  \"result\" : true\n" +
        "}\n"],
    ["_test=true\n" +
    "\n" +
    "{\n" +
    "  test?\n" +
    "    result=%test\n" +
    "}\n",
        "{\n" +
        "  \"result\" : true\n" +
        "}\n"],
    ["_colour = green\n" +
    "_test = { colour=green? true /? false } \n" +
    "\n" +
    "{\n" +
    "  !test?\n" +
    "    result=it’s not green\n" +
    "  /?\n" +
    "    result=it’s green\n" +
    "}",
        "{\n" +
        "  \"result\" : \"it’s green\"\n" +
        "}"],
    ["_person(  \n" +
                "  name(\n" +
            "    first=John\n" +
            "    last=Smith\n" +
            "  )\n" +
            ")\n" +
            "say=%person[name[first]]",
        "{\n" +
                "    \"say\": \"John\"\n" +
            "}"]


    // TODO ESCAPES!!!
//                ["_test=1\\\\:2\n" +
//                        "result=%test", "{\n" +
//                        "    \"result\": \"1:2\"\n" +
//                        "}\n"],
//                ["_test=1\\\\:2\n" +
//                        "\n" +
//                        "result={\n" +
//                        "  test=1\\\\:2?\n" +
//                        "      yes\n" +
//                        "  /?\n" +
//                        "     no\n" +
//                        "}", "{ \"result\": \"yes\" }"],
//                ["test=1~~:2",
//                "{\n" +
//                        "   \"test\": [\n" +
//                        "\t\"1~”,\n" +
//                        "\t“2\"\n" +
//                        "   ]\n" +
//                        "}"],

    ];
describe('Parser', function() {
    describe('translation', function() {
        it('should return the right interpretation', function() {
            for (let entry of parser2Input) {
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
