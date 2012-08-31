[![build status](https://secure.travis-ci.org/mhemesath/d34raphael.png)](http://travis-ci.org/mhemesath/d34raphael)


d34raphael
==========

R2D3 is a customized build of D3 powered by [RaphaelJS](http://raphaeljs.com/).  The combination of D3 and Raphael enable developers to easily
data visualizations that work IE7+ and all modern browsers.

This project is based off of Eric Webb's [d34raphael](http://webmonarch.github.com/d34raphael/)


Getting Started
---------------

To get started using R2D3, just include r2d3 and the necessary shims.
Sizzle and Compat need to be incldued for IE8. If you are using jQuery,
R2D3 will use the bundled sizzle.

```html
<html>
  <head>
    <title>R2D3 101</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <!--[if lte IE 8]>
    <script type="text/javascript" src="js/sizzle.js"></script>
    <script type="text/javascript" src="js/compat.js"></script>
    <![endif]-->
    <script src="js/r2d3.min.js"></script>
  </body>
</html>
```


Developers
----------
### D3 ###
D3 is included in this project as as submodule. To pull down D3 for a build run:

```
$ git submodule init
$ git submodule update
```

### Build Commands ###
We have included a makefile to build a custom version of D3 packaged with d34raphael. 

+ **dependencies**
Our makefile depends on you having recess, uglify.js. To install, just run the following command in npm:

```
$ npm install uglify-js -g
```

+ **build** - `make`
Runs the  makefile to concatenate and minify d34raphael.js
