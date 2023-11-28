const c = 3;
if (c === 3) {
  console.log(3);
}
//esbuild gonna put this stuff into "bundle.js" 
// & terser gonna make it only the console.log line, since rest is useless
