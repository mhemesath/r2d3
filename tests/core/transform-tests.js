module("Transforms");

test( "translate(20,20)", function() {
  transform = d3.transform('translate(20,20)')
  equal(transform.translate[0], 20)
  equal(transform.translate[1], 20)
});

test( "translate(0,20)", function() {
  transform = d3.transform('translate(0,20)')
  equal(transform.translate[0], 0)
  equal(transform.translate[1], 20)
});

test( "translate(20,0)", function() {
  transform = d3.transform('translate(20,0)')
  equal(transform.translate[0], 20)
  equal(transform.translate[1], 0)
});

test( "translate(20,0) translate(-20, 0)", function() {
  transform = d3.transform( "translate(20,0) translate(-20, 0)")
  equal(transform.translate[0], 0)
  equal(transform.translate[1], 0)
});

test( "translate(20,0) translate(20, 1)", function() {
  transform = d3.transform( "translate(20,0) translate(20, 1)")
  equal(transform.translate[0], 40)
  equal(transform.translate[1], 1)
});
