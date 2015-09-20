# Request-Sanitizer
Request Sanitizer is an expressjs middleware which sanitize the data of request.body and request.query it can be used as middleware in all route or in specified route. This module sanitize the data escapes,trims and validates and assign it back to request body or query so that  data can be used in next middleware

  - Sanitize given key attached to req
  - easily customizable codes
  - you can also pass own sanitize function

 
### Version
0.0.3

### Installation
You need request-sanitizer installed locally:

```sh
$ npm i request-sanitizer
```


### Dependecies

Request sanitizer is currently extended with the following plugins

* underscore.js
* validator.js

# How to setup
Import the module where needed
 ```sh
 var requestSanitizer = require('request-sanitizer')();
 ```
 If you have already imported validator.js then you can ignore it
 ```
 var validator = requestSanitizer.validator
 ```
Set options  for sanitizer
```
requestSanitizer.setOptions({
    query :{
    	test : [validator.escape]
    },
    body :{
    	name : [validator.escape,validator.ltrim],
    	test : [validator.ltrim]
    },
});
```
You have to pass object as arguments for setOptions method of reqestSanitizer.
here keys are the field where you want sanitize to be applied
for example req object have query and body properties and they have there values
where you want sanitization.you have to pass sanitization function in array .

suppose if req.body has three posted key and values like this which are unescaped and contains whitespaces
 ``` 
 req.body.name = " <sam  ";
 req.body.age = 12;
 req.body.sex = "male  "
 ```
 now to sanitize this you have to
 setOptions like  this which must match fields from req.body object
 
 ```
 requestSanitizer.setOptions({
    //sanitize req.body only
    body :{
      //this will sanitize req.body.name
      //you can pass multiple callbacks to sanitize
      name : [validator.escape,validator.ltrim],
      
       //or you can assign function to it
      //It will sanitize req.body.age
      age :validator.ltrim,
      
     //or you can pass your custom validation function
      sex : function(value){
       if(value === 'male') return 'M';
       else return 'F';
      }
    }
 });
 ```
If you console.log(req.body) in next middleware then output will be like
```
{
        "name": "&lt;sam", // escaped html characted and whitespaces
        "age": 12,
        "sex": "male" //Removed whitespace from left
    },
```
To read more validator function please go through
[https://github.com/chriso/validator.js](https://github.com/chriso/validator.js)
or you pass your own validator function

After that u can use it as global middleware like
```
app.use('/*',requestSanitizer.sanitize);
```

or for some specific routes like
```
app.post('/home/data/?test=name',requestSanitizer.sanitize,yourmiddilware);
```

# Combining All Codes
```
var requestSanitizer = require('request-sanitizer')();
var validator = requestSanitizer.validator;
 
requestSanitizer.setOptions({
    query :{
    	test : [validator.escape]
    },
    body :{
    	name : [validator.escape,validator.ltrim],
    	test : [validator.ltrim]
    },
});

module.exports = function(app) {
    app.post('/test/sanitize', requestSanitizer.sanitize, function(req, res, next) {
        var response = {
            body: req.body,
            query: req.query,
        }
        res.json(response);
    });
}
```

