r2d3
==========

R2D3 is a customized build of D3 powered by [RaphaelJS](http://raphaeljs.com/).  The combination of D3 and Raphael enable developers to easily
build data visualizations that work in IE7+ and all modern browsers.


Updating to v0.1.0 (2013-3-17)
------------------------------

* R2D3 now using v3.0.8 of D3. Update your code accordingly.
* The ```<script>``` element that loads R2D3 now needs ```charset="utf-8"``` set.


Getting Started
---------------

To get started using R2D3,  conditionally load r2d3 for Internet Explorer 8 and below. For modern browsers,
serve up d3 as you normally would.  Don't exclude the charset attribute in the script block, IE needs it parse
the latest version of D3 correctly.

```html
<html>
  <head>
    <title>R2D3 101</title>
    <!--[if lte IE 8]><script src="r2d3.js" charset="utf-8"></script><![endif]-->
    <!--[if gte IE 9]><!-->
    <script src="d3.js"></script>
    <!--<![endif]-->
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```

Should I use R2D3?
------------------

R2D3 is an attempt to shim SVG functionality via Rapahel to be consumed by D3. Although R2D3 handles most basic SVG functionality, it will 
never be able to completely shim every feature of SVG.  Also, as Internet Explorer 7 & 8 are older browsers, longer rendering times can be expected.

I recommend to try out R2D3 on each of your visualizations to ensure the shim functions correctly for that specific use case.
If you find an issue, please log a bug so it can either be patched, or documented as a limitation.

In general, R2D3 works great for smaller, simpler visualizations with limited animations and interactivity.

Limitations
-----------

See the issues page for a listing of known issues. In addition this
includes:

### ```<use>``` ###
Use is not supported.
  
###````<text>````###
* The ```dx``` and ```dy```  attributes of text are not yet supported. In the meantime, adjust the ```x``` and ```y``` attributes.

###```Transforms```###
* Ensure translations declare both the X and Y coordinates. Example:


```javascript
// BAD
circles.transform('translate(20)');

// GOOD
circles.transform('translate(20,0)');
```

Who is using R2D3?
------------------

If you'd like to add a D3 visualization you've made IE compatible with R2D3, issue a pull request and add it here!


Developers
----------
### D3 ###
D3 is included in this project as as submodule. To pull down D3 for a build run:

```
$ git submodule init
$ git submodule update
```

### Build Commands ###
We have included a makefile to build a custom version of D3 packaged with r2d3. 

+ **dependencies**
Our makefile depends on you having recess, uglify.js. To install, just run the following command in npm:

```
$ npm install uglify-js -g
```

+ **build** - `make`
Runs the  makefile to concatenate and minify r2d3.js



<a href='http://www.pledgie.com/campaigns/18826'><img alt='Click here to lend your support to: R2D3 and make a donation at www.pledgie.com !' src='http://www.pledgie.com/campaigns/18826.png?skin_name=chrome' border='0' /></a>
