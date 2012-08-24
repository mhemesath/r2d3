[![build status](https://secure.travis-ci.org/mhemesath/d34raphael.png)](http://travis-ci.org/mhemesath/d34raphael)


d34raphael
==========

d3 support for raphael.

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
