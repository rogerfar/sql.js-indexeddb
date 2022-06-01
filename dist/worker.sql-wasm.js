
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});null;
e.onRuntimeInitialized=function(){function a(h,l){this.Qa=h;this.db=l;this.Oa=1;this.kb=[]}function b(h,l){this.db=l;l=aa(h)+1;this.cb=ba(l);if(null===this.cb)throw Error("Unable to allocate memory for the SQL string");k(h,n,this.cb,l);this.ib=this.cb;this.Za=this.ob=null}function c(h){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=h){var l=this.filename,q=l?r("//"+l):"/";l=ca(!0,!0);q=da(q,(void 0!==l?l:438)&4095|32768,0);if(h){if("string"===typeof h){for(var p=Array(h.length),y=
0,K=h.length;y<K;++y)p[y]=h.charCodeAt(y);h=p}ea(q,l|146);p=w(q,577);fa(p,h,0,h.length,0,void 0);ha(p);ea(q,l)}}this.handleError(g(this.filename,d));this.db=x(d,"i32");jc(this.db);this.eb={};this.Wa={}}var d=z(4),f=e.cwrap,g=f("sqlite3_open","number",["string","number"]),m=f("sqlite3_close_v2","number",["number"]),t=f("sqlite3_exec","number",["number","string","number","number","number"]),v=f("sqlite3_changes","number",["number"]),u=f("sqlite3_prepare_v2","number",["number","string","number","number",
"number"]),B=f("sqlite3_sql","string",["number"]),G=f("sqlite3_normalized_sql","string",["number"]),Y=f("sqlite3_prepare_v2","number",["number","number","number","number","number"]),kc=f("sqlite3_bind_text","number",["number","number","number","number","number"]),qb=f("sqlite3_bind_blob","number",["number","number","number","number","number"]),lc=f("sqlite3_bind_double","number",["number","number","number"]),mc=f("sqlite3_bind_int","number",["number","number","number"]),nc=f("sqlite3_bind_parameter_index",
"number",["number","string"]),oc=f("sqlite3_step","number",["number"]),pc=f("sqlite3_errmsg","string",["number"]),qc=f("sqlite3_column_count","number",["number"]),rc=f("sqlite3_data_count","number",["number"]),sc=f("sqlite3_column_double","number",["number","number"]),rb=f("sqlite3_column_text","string",["number","number"]),tc=f("sqlite3_column_blob","number",["number","number"]),uc=f("sqlite3_column_bytes","number",["number","number"]),vc=f("sqlite3_column_type","number",["number","number"]),wc=
f("sqlite3_column_name","string",["number","number"]),xc=f("sqlite3_reset","number",["number"]),yc=f("sqlite3_clear_bindings","number",["number"]),zc=f("sqlite3_finalize","number",["number"]),Ac=f("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Bc=f("sqlite3_value_type","number",["number"]),Cc=f("sqlite3_value_bytes","number",["number"]),Dc=f("sqlite3_value_text","string",["number"]),Ec=f("sqlite3_value_blob","number",["number"]),
Fc=f("sqlite3_value_double","number",["number"]),Gc=f("sqlite3_result_double","",["number","number"]),sb=f("sqlite3_result_null","",["number"]),Hc=f("sqlite3_result_text","",["number","string","number","number"]),Ic=f("sqlite3_result_blob","",["number","number","number","number"]),Jc=f("sqlite3_result_int","",["number","number"]),tb=f("sqlite3_result_error","",["number","string","number"]),jc=f("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Qa)throw"Statement closed";
this.reset();return Array.isArray(h)?this.Cb(h):null!=h&&"object"===typeof h?this.Db(h):!0};a.prototype.step=function(){if(!this.Qa)throw"Statement closed";this.Oa=1;var h=oc(this.Qa);switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.yb=function(h){null==h&&(h=this.Oa,this.Oa+=1);return sc(this.Qa,h)};a.prototype.Gb=function(h){null==h&&(h=this.Oa,this.Oa+=1);h=rb(this.Qa,h);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(h)};
a.prototype.Hb=function(h){null==h&&(h=this.Oa,this.Oa+=1);return rb(this.Qa,h)};a.prototype.getBlob=function(h){null==h&&(h=this.Oa,this.Oa+=1);var l=uc(this.Qa,h);h=tc(this.Qa,h);for(var q=new Uint8Array(l),p=0;p<l;p+=1)q[p]=A[h+p];return q};a.prototype.get=function(h,l){l=l||{};null!=h&&this.bind(h)&&this.step();h=[];for(var q=rc(this.Qa),p=0;p<q;p+=1)switch(vc(this.Qa,p)){case 1:var y=l.useBigInt?this.Gb(p):this.yb(p);h.push(y);break;case 2:h.push(this.yb(p));break;case 3:h.push(this.Hb(p));break;
case 4:h.push(this.getBlob(p));break;default:h.push(null)}return h};a.prototype.getColumnNames=function(){for(var h=[],l=qc(this.Qa),q=0;q<l;q+=1)h.push(wc(this.Qa,q));return h};a.prototype.getAsObject=function(h,l){h=this.get(h,l);l=this.getColumnNames();for(var q={},p=0;p<l.length;p+=1)q[l[p]]=h[p];return q};a.prototype.getSQL=function(){return B(this.Qa)};a.prototype.getNormalizedSQL=function(){return G(this.Qa)};a.prototype.run=function(h){null!=h&&this.bind(h);this.step();return this.reset()};
a.prototype.tb=function(h,l){null==l&&(l=this.Oa,this.Oa+=1);h=ja(h);var q=ka(h);this.kb.push(q);this.db.handleError(kc(this.Qa,l,q,h.length-1,0))};a.prototype.Bb=function(h,l){null==l&&(l=this.Oa,this.Oa+=1);var q=ka(h);this.kb.push(q);this.db.handleError(qb(this.Qa,l,q,h.length,0))};a.prototype.sb=function(h,l){null==l&&(l=this.Oa,this.Oa+=1);this.db.handleError((h===(h|0)?mc:lc)(this.Qa,l,h))};a.prototype.Eb=function(h){null==h&&(h=this.Oa,this.Oa+=1);qb(this.Qa,h,0,0,0)};a.prototype.ub=function(h,
l){null==l&&(l=this.Oa,this.Oa+=1);switch(typeof h){case "string":this.tb(h,l);return;case "number":this.sb(h,l);return;case "bigint":this.tb(h.toString(),l);return;case "boolean":this.sb(h+0,l);return;case "object":if(null===h){this.Eb(l);return}if(null!=h.length){this.Bb(h,l);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+h+").";};a.prototype.Db=function(h){var l=this;Object.keys(h).forEach(function(q){var p=nc(l.Qa,q);0!==p&&l.ub(h[q],p)});return!0};a.prototype.Cb=function(h){for(var l=
0;l<h.length;l+=1)this.ub(h[l],l+1);return!0};a.prototype.reset=function(){this.freemem();return 0===yc(this.Qa)&&0===xc(this.Qa)};a.prototype.freemem=function(){for(var h;void 0!==(h=this.kb.pop());)la(h)};a.prototype.free=function(){this.freemem();var h=0===zc(this.Qa);delete this.db.eb[this.Qa];this.Qa=0;return h};b.prototype.next=function(){if(null===this.cb)return{done:!0};null!==this.Za&&(this.Za.free(),this.Za=null);if(!this.db.db)throw this.mb(),Error("Database closed");var h=ma(),l=z(4);
na(d);na(l);try{this.db.handleError(Y(this.db.db,this.ib,-1,d,l));this.ib=x(l,"i32");var q=x(d,"i32");if(0===q)return this.mb(),{done:!0};this.Za=new a(q,this.db);this.db.eb[q]=this.Za;return{value:this.Za,done:!1}}catch(p){throw this.ob=D(this.ib),this.mb(),p;}finally{oa(h)}};b.prototype.mb=function(){la(this.cb);this.cb=null};b.prototype.getRemainingSQL=function(){return null!==this.ob?this.ob:D(this.ib)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(b.prototype[Symbol.iterator]=
function(){return this});c.prototype.run=function(h,l){if(!this.db)throw"Database closed";if(l){h=this.prepare(h,l);try{h.step()}finally{h.free()}}else this.handleError(t(this.db,h,0,0,d));return this};c.prototype.exec=function(h,l,q){if(!this.db)throw"Database closed";var p=ma(),y=null;try{var K=aa(h)+1,E=z(K);k(h,A,E,K);var ia=E;var Z=z(4);for(h=[];0!==x(ia,"i8");){na(d);na(Z);this.handleError(Y(this.db,ia,-1,d,Z));var C=x(d,"i32");ia=x(Z,"i32");if(0!==C){K=null;y=new a(C,this);for(null!=l&&y.bind(l);y.step();)null===
K&&(K={columns:y.getColumnNames(),values:[]},h.push(K)),K.values.push(y.get(null,q));y.free()}}return h}catch(L){throw y&&y.free(),L;}finally{oa(p)}};c.prototype.each=function(h,l,q,p,y){"function"===typeof l&&(p=q,q=l,l=void 0);h=this.prepare(h,l);try{for(;h.step();)q(h.getAsObject(null,y))}finally{h.free()}if("function"===typeof p)return p()};c.prototype.prepare=function(h,l){na(d);this.handleError(u(this.db,h,-1,d,0));h=x(d,"i32");if(0===h)throw"Nothing to prepare";var q=new a(h,this);null!=l&&
q.bind(l);return this.eb[h]=q};c.prototype.iterateStatements=function(h){return new b(h,this)};c.prototype["export"]=function(){Object.values(this.eb).forEach(function(l){l.free()});Object.values(this.Wa).forEach(pa);this.Wa={};this.handleError(m(this.db));var h=qa(this.filename);this.handleError(g(this.filename,d));this.db=x(d,"i32");return h};c.prototype.close=function(){null!==this.db&&(Object.values(this.eb).forEach(function(h){h.free()}),Object.values(this.Wa).forEach(pa),this.Wa={},this.handleError(m(this.db)),
ra("/"+this.filename),this.db=null)};c.prototype.handleError=function(h){if(0===h)return null;h=pc(this.db);throw Error(h);};c.prototype.getRowsModified=function(){return v(this.db)};c.prototype.create_function=function(h,l){Object.prototype.hasOwnProperty.call(this.Wa,h)&&(pa(this.Wa[h]),delete this.Wa[h]);var q=sa(function(p,y,K){for(var E,ia=[],Z=0;Z<y;Z+=1){var C=x(K+4*Z,"i32"),L=Bc(C);if(1===L||2===L)C=Fc(C);else if(3===L)C=Dc(C);else if(4===L){L=C;C=Cc(L);L=Ec(L);for(var wb=new Uint8Array(C),
Ba=0;Ba<C;Ba+=1)wb[Ba]=A[L+Ba];C=wb}else C=null;ia.push(C)}try{E=l.apply(null,ia)}catch(Mc){tb(p,Mc,-1);return}switch(typeof E){case "boolean":Jc(p,E?1:0);break;case "number":Gc(p,E);break;case "string":Hc(p,E,-1,-1);break;case "object":null===E?sb(p):null!=E.length?(y=ka(E),Ic(p,y,E.length,-1),la(y)):tb(p,"Wrong API use : tried to return a value of an unknown type ("+E+").",-1);break;default:sb(p)}});this.Wa[h]=q;this.handleError(Ac(this.db,h,l.length,1,0,q,0,0,0));return this};e.Database=c};
var ta={},F;for(F in e)e.hasOwnProperty(F)&&(ta[F]=e[F]);var ua="./this.program",va="object"===typeof window,wa="function"===typeof importScripts,xa="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node,H="",ya,za,Aa,Ca,Da;
if(xa)H=wa?require("path").dirname(H)+"/":__dirname+"/",ya=function(a,b){Ca||(Ca=require("fs"));Da||(Da=require("path"));a=Da.normalize(a);return Ca.readFileSync(a,b?null:"utf8")},Aa=function(a){a=ya(a,!0);a.buffer||(a=new Uint8Array(a));a.buffer||I("Assertion failed: undefined");return a},za=function(a,b,c){Ca||(Ca=require("fs"));Da||(Da=require("path"));a=Da.normalize(a);Ca.readFile(a,function(d,f){d?c(d):b(f.buffer)})},1<process.argv.length&&(ua=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),
"undefined"!==typeof module&&(module.exports=e),e.inspect=function(){return"[Emscripten Module object]"};else if(va||wa)wa?H=self.location.href:"undefined"!==typeof document&&document.currentScript&&(H=document.currentScript.src),H=0!==H.indexOf("blob:")?H.substr(0,H.replace(/[?#].*/,"").lastIndexOf("/")+1):"",ya=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},wa&&(Aa=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);
return new Uint8Array(b.response)}),za=function(a,b,c){var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";d.onload=function(){200==d.status||0==d.status&&d.response?b(d.response):c()};d.onerror=c;d.send(null)};var Ea=e.print||console.log.bind(console),Fa=e.printErr||console.warn.bind(console);for(F in ta)ta.hasOwnProperty(F)&&(e[F]=ta[F]);ta=null;e.thisProgram&&(ua=e.thisProgram);var Ga=[],Ha;
function sa(a){if(!Ha){Ha=new WeakMap;for(var b=Ia.length,c=0;c<0+b;c++){var d=Ja(c);d&&Ha.set(d,c)}}if(Ha.has(a))return Ha.get(a);if(Ga.length)b=Ga.pop();else{try{Ia.grow(1)}catch(g){if(!(g instanceof RangeError))throw g;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}b=Ia.length-1}try{c=b,Ia.set(c,a),Ka[c]=a}catch(g){if(!(g instanceof TypeError))throw g;if("function"===typeof WebAssembly.Function){d={i:"i32",j:"i64",f:"f32",d:"f64"};var f={parameters:[],results:[]};for(c=1;4>c;++c)f.parameters.push(d["viii"[c]]);
d=new WebAssembly.Function(f,a)}else{d=[1,0,1,96];f={i:127,j:126,f:125,d:124};d.push(3);for(c=0;3>c;++c)d.push(f["iii"[c]]);d.push(0);d[1]=d.length-2;c=new Uint8Array([0,97,115,109,1,0,0,0].concat(d,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));c=new WebAssembly.Module(c);d=(new WebAssembly.Instance(c,{e:{f:a}})).exports.f}c=b;Ia.set(c,d);Ka[c]=d}Ha.set(a,b);return b}function pa(a){Ha.delete(Ja(a));Ga.push(a)}var La;e.wasmBinary&&(La=e.wasmBinary);var noExitRuntime=e.noExitRuntime||!0;
"object"!==typeof WebAssembly&&I("no native wasm support detected");
function na(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":A[a>>0]=0;break;case "i8":A[a>>0]=0;break;case "i16":Ma[a>>1]=0;break;case "i32":J[a>>2]=0;break;case "i64":M=[0,(N=0,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];J[a>>2]=M[0];J[a+4>>2]=M[1];break;case "float":Na[a>>2]=0;break;case "double":Oa[a>>3]=0;break;default:I("invalid type for setValue: "+b)}}
function x(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return A[a>>0];case "i8":return A[a>>0];case "i16":return Ma[a>>1];case "i32":return J[a>>2];case "i64":return J[a>>2];case "float":return Na[a>>2];case "double":return Number(Oa[a>>3]);default:I("invalid type for getValue: "+b)}return null}var Pa,Qa=!1;function Ra(a){var b=e["_"+a];b||I("Assertion failed: Cannot call unknown function "+(a+", make sure it is exported"));return b}
function Sa(a,b,c,d){var f={string:function(u){var B=0;if(null!==u&&void 0!==u&&0!==u){var G=(u.length<<2)+1;B=z(G);k(u,n,B,G)}return B},array:function(u){var B=z(u.length);A.set(u,B);return B}};a=Ra(a);var g=[],m=0;if(d)for(var t=0;t<d.length;t++){var v=f[c[t]];v?(0===m&&(m=ma()),g[t]=v(d[t])):g[t]=d[t]}c=a.apply(null,g);return c=function(u){0!==m&&oa(m);return"string"===b?D(u):"boolean"===b?!!u:u}(c)}var Ta=0,Ua=1;
function ka(a){var b=Ta==Ua?z(a.length):ba(a.length);a.subarray||a.slice?n.set(a,b):n.set(new Uint8Array(a),b);return b}var Va="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Wa(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&Va)return Va.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|g);else{var m=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|m:(f&7)<<18|g<<12|m<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function D(a,b){return a?Wa(n,a,b):""}
function k(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var g=0;g<a.length;++g){var m=a.charCodeAt(g);if(55296<=m&&57343>=m){var t=a.charCodeAt(++g);m=65536+((m&1023)<<10)|t&1023}if(127>=m){if(c>=d)break;b[c++]=m}else{if(2047>=m){if(c+1>=d)break;b[c++]=192|m>>6}else{if(65535>=m){if(c+2>=d)break;b[c++]=224|m>>12}else{if(c+3>=d)break;b[c++]=240|m>>18;b[c++]=128|m>>12&63}b[c++]=128|m>>6&63}b[c++]=128|m&63}}b[c]=0;return c-f}
function aa(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}function Xa(a){var b=aa(a)+1,c=ba(b);c&&k(a,A,c,b);return c}var Ya,A,n,Ma,J,Na,Oa;
function Za(){var a=Pa.buffer;Ya=a;e.HEAP8=A=new Int8Array(a);e.HEAP16=Ma=new Int16Array(a);e.HEAP32=J=new Int32Array(a);e.HEAPU8=n=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Na=new Float32Array(a);e.HEAPF64=Oa=new Float64Array(a)}var Ia,$a=[],ab=[],bb=[];function cb(){var a=e.preRun.shift();$a.unshift(a)}var db=0,eb=null,fb=null;e.preloadedImages={};e.preloadedAudios={};
function I(a){if(e.onAbort)e.onAbort(a);a="Aborted("+a+")";Fa(a);Qa=!0;throw new WebAssembly.RuntimeError(a+". Build with -s ASSERTIONS=1 for more info.");}function gb(){return O.startsWith("data:application/octet-stream;base64,")}var O;O="sql-wasm.wasm";if(!gb()){var hb=O;O=e.locateFile?e.locateFile(hb,H):H+hb}function ib(){var a=O;try{if(a==O&&La)return new Uint8Array(La);if(Aa)return Aa(a);throw"both async and sync fetching of the wasm failed";}catch(b){I(b)}}
function jb(){if(!La&&(va||wa)){if("function"===typeof fetch&&!O.startsWith("file://"))return fetch(O,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+O+"'";return a.arrayBuffer()}).catch(function(){return ib()});if(za)return new Promise(function(a,b){za(O,function(c){a(new Uint8Array(c))},b)})}return Promise.resolve().then(function(){return ib()})}var N,M;
function kb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(e);else{var c=b.Qb;"number"===typeof c?void 0===b.lb?Ja(c)():Ja(c)(b.lb):c(void 0===b.lb?null:b.lb)}}}function lb(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}var Ka=[];function Ja(a){var b=Ka[a];b||(a>=Ka.length&&(Ka.length=a+1),Ka[a]=b=Ia.get(a));return b}
function mb(){function a(m){return(m=m.toTimeString().match(/\(([A-Za-z ]+)\)$/))?m[1]:"GMT"}var b=(new Date).getFullYear(),c=new Date(b,0,1),d=new Date(b,6,1);b=c.getTimezoneOffset();var f=d.getTimezoneOffset(),g=Math.max(b,f);J[nb()>>2]=60*g;J[ob()>>2]=Number(b!=f);c=a(c);d=a(d);c=Xa(c);d=Xa(d);f<b?(J[pb()>>2]=c,J[pb()+4>>2]=d):(J[pb()>>2]=d,J[pb()+4>>2]=c)}var ub;
function vb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function r(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=vb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function xb(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function yb(a){if("/"===a)return"/";a=r(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}
function zb(){if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);return function(){crypto.getRandomValues(a);return a[0]}}if(xa)try{var b=require("crypto");return function(){return b.randomBytes(1)[0]}}catch(c){}return function(){I("randomDevice")}}
function Ab(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=vb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Bb=[];function Cb(a,b){Bb[a]={input:[],output:[],bb:b};Db(a,Eb)}
var Eb={open:function(a){var b=Bb[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.bb.flush(a.tty)},flush:function(a){a.tty.bb.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.bb.zb)throw new P(60);for(var f=0,g=0;g<d;g++){try{var m=a.tty.bb.zb(a.tty)}catch(t){throw new P(29);}if(void 0===m&&0===f)throw new P(6);if(null===m||void 0===m)break;f++;b[c+g]=m}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.bb.pb)throw new P(60);
try{for(var f=0;f<d;f++)a.tty.bb.pb(a.tty,b[c+f])}catch(g){throw new P(29);}d&&(a.node.timestamp=Date.now());return f}},Fb={zb:function(a){if(!a.input.length){var b=null;if(xa){var c=Buffer.alloc(256),d=0;try{d=Ca.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(f.toString().includes("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==typeof readline&&(b=
readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=ja(b,!0)}return a.input.shift()},pb:function(a,b){null===b||10===b?(Ea(Wa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ea(Wa(a.output,0)),a.output=[])}},Gb={pb:function(a,b){null===b||10===b?(Fa(Wa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Fa(Wa(a.output,0)),a.output=[])}};
function Hb(a){a=65536*Math.ceil(a/65536);var b=Ib(65536,a);if(!b)return 0;n.fill(0,b,b+a);return b}
var Q={Ua:null,Va:function(){return Q.createNode(null,"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Ua||(Q.Ua={dir:{node:{Ta:Q.La.Ta,Sa:Q.La.Sa,lookup:Q.La.lookup,fb:Q.La.fb,rename:Q.La.rename,unlink:Q.La.unlink,rmdir:Q.La.rmdir,readdir:Q.La.readdir,symlink:Q.La.symlink},stream:{Ya:Q.Ma.Ya}},file:{node:{Ta:Q.La.Ta,Sa:Q.La.Sa},stream:{Ya:Q.Ma.Ya,read:Q.Ma.read,write:Q.Ma.write,rb:Q.Ma.rb,gb:Q.Ma.gb,hb:Q.Ma.hb}},link:{node:{Ta:Q.La.Ta,Sa:Q.La.Sa,
readlink:Q.La.readlink},stream:{}},vb:{node:{Ta:Q.La.Ta,Sa:Q.La.Sa},stream:Jb}});c=Kb(a,b,c,d);R(c.mode)?(c.La=Q.Ua.dir.node,c.Ma=Q.Ua.dir.stream,c.Na={}):32768===(c.mode&61440)?(c.La=Q.Ua.file.node,c.Ma=Q.Ua.file.stream,c.Ra=0,c.Na=null):40960===(c.mode&61440)?(c.La=Q.Ua.link.node,c.Ma=Q.Ua.link.stream):8192===(c.mode&61440)&&(c.La=Q.Ua.vb.node,c.Ma=Q.Ua.vb.stream);c.timestamp=Date.now();a&&(a.Na[b]=c,a.timestamp=c.timestamp);return c},Rb:function(a){return a.Na?a.Na.subarray?a.Na.subarray(0,a.Ra):
new Uint8Array(a.Na):new Uint8Array(0)},wb:function(a,b){var c=a.Na?a.Na.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Na,a.Na=new Uint8Array(b),0<a.Ra&&a.Na.set(c.subarray(0,a.Ra),0))},Nb:function(a,b){if(a.Ra!=b)if(0==b)a.Na=null,a.Ra=0;else{var c=a.Na;a.Na=new Uint8Array(b);c&&a.Na.set(c.subarray(0,Math.min(b,a.Ra)));a.Ra=b}},La:{Ta:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?
b.size=4096:32768===(a.mode&61440)?b.size=a.Ra:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Fb=4096;b.blocks=Math.ceil(b.size/b.Fb);return b},Sa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&Q.Nb(a,b.size)},lookup:function(){throw Lb[44];},fb:function(a,b,c,d){return Q.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=
Mb(b,c)}catch(g){}if(d)for(var f in d.Na)throw new P(55);}delete a.parent.Na[a.name];a.parent.timestamp=Date.now();a.name=c;b.Na[c]=a;b.timestamp=a.parent.timestamp;a.parent=b},unlink:function(a,b){delete a.Na[b];a.timestamp=Date.now()},rmdir:function(a,b){var c=Mb(a,b),d;for(d in c.Na)throw new P(55);delete a.Na[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],c;for(c in a.Na)a.Na.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=Q.createNode(a,b,41471,0);a.link=c;return a},
readlink:function(a){if(40960!==(a.mode&61440))throw new P(28);return a.link}},Ma:{read:function(a,b,c,d,f){var g=a.node.Na;if(f>=a.node.Ra)return 0;a=Math.min(a.node.Ra-f,d);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=g[f+d];return a},write:function(a,b,c,d,f,g){b.buffer===A.buffer&&(g=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Na||a.Na.subarray)){if(g)return a.Na=b.subarray(c,c+d),a.Ra=d;if(0===a.Ra&&0===f)return a.Na=b.slice(c,c+d),a.Ra=
d;if(f+d<=a.Ra)return a.Na.set(b.subarray(c,c+d),f),d}Q.wb(a,f+d);if(a.Na.subarray&&b.subarray)a.Na.set(b.subarray(c,c+d),f);else for(g=0;g<d;g++)a.Na[f+g]=b[c+g];a.Ra=Math.max(a.Ra,f+d);return d},Ya:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Ra);if(0>b)throw new P(28);return b},rb:function(a,b,c){Q.wb(a.node,b+c);a.node.Ra=Math.max(a.node.Ra,b+c)},gb:function(a,b,c,d,f,g){if(0!==b)throw new P(28);if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Na;if(g&
2||a.buffer!==Ya){if(0<d||d+c<a.length)a.subarray?a=a.subarray(d,d+c):a=Array.prototype.slice.call(a,d,d+c);d=!0;c=Hb(c);if(!c)throw new P(48);A.set(a,c)}else d=!1,c=a.byteOffset;return{Mb:c,jb:d}},hb:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);if(f&2)return 0;Q.Ma.write(a,b,0,d,c,!1);return 0}}},Nb=null,Ob={},S=[],Pb=1,T=null,Qb=!0,P=null,Lb={};
function U(a,b){a=Ab("/",a);b=b||{};if(!a)return{path:"",node:null};var c={xb:!0,qb:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.qb)throw new P(32);a=vb(a.split("/").filter(function(m){return!!m}),!1);var f=Nb;c="/";for(d=0;d<a.length;d++){var g=d===a.length-1;if(g&&b.parent)break;f=Mb(f,a[d]);c=r(c+"/"+a[d]);f.$a&&(!g||g&&b.xb)&&(f=f.$a.root);if(!g||b.Xa)for(g=0;40960===(f.mode&61440);)if(f=Rb(c),c=Ab(xb(c),f),f=U(c,{qb:b.qb}).node,40<g++)throw new P(32);}return{path:c,node:f}}
function Sb(a){for(var b;;){if(a===a.parent)return a=a.Va.Ab,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Tb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%T.length}function Ub(a){var b=Tb(a.parent.id,a.name);if(T[b]===a)T[b]=a.ab;else for(b=T[b];b;){if(b.ab===a){b.ab=a.ab;break}b=b.ab}}
function Mb(a,b){var c;if(c=(c=Vb(a,"x"))?c:a.La.lookup?0:2)throw new P(c,a);for(c=T[Tb(a.id,b)];c;c=c.ab){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.La.lookup(a,b)}function Kb(a,b,c,d){a=new Wb(a,b,c,d);b=Tb(a.parent.id,a.name);a.ab=T[b];return T[b]=a}function R(a){return 16384===(a&61440)}var Xb={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090};function Yb(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}
function Vb(a,b){if(Qb)return 0;if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0}function Zb(a,b){try{return Mb(a,b),20}catch(c){}return Vb(a,"wx")}function $b(a,b,c){try{var d=Mb(a,b)}catch(f){return f.Pa}if(a=Vb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Sb(d))return 10}else if(R(d.mode))return 31;return 0}function ac(a){var b=4096;for(a=a||0;a<=b;a++)if(!S[a])return a;throw new P(33);}
function bc(a,b){cc||(cc=function(){},cc.prototype={});var c=new cc,d;for(d in a)c[d]=a[d];a=c;b=ac(b);a.fd=b;return S[b]=a}var Jb={open:function(a){a.Ma=Ob[a.node.rdev].Ma;a.Ma.open&&a.Ma.open(a)},Ya:function(){throw new P(70);}};function Db(a,b){Ob[a]={Ma:b}}
function dc(a,b){var c="/"===b,d=!b;if(c&&Nb)throw new P(10);if(!c&&!d){var f=U(b,{xb:!1});b=f.path;f=f.node;if(f.$a)throw new P(10);if(!R(f.mode))throw new P(54);}b={type:a,Sb:{},Ab:b,Kb:[]};a=a.Va(b);a.Va=b;b.root=a;c?Nb=a:f&&(f.$a=b,f.Va&&f.Va.Kb.push(b))}function da(a,b,c){var d=U(a,{parent:!0}).node;a=yb(a);if(!a||"."===a||".."===a)throw new P(28);var f=Zb(d,a);if(f)throw new P(f);if(!d.La.fb)throw new P(63);return d.La.fb(d,a,b,c)}
function V(a,b){return da(a,(void 0!==b?b:511)&1023|16384,0)}function ec(a,b,c){"undefined"===typeof c&&(c=b,b=438);da(a,b|8192,c)}function fc(a,b){if(!Ab(a))throw new P(44);var c=U(b,{parent:!0}).node;if(!c)throw new P(44);b=yb(b);var d=Zb(c,b);if(d)throw new P(d);if(!c.La.symlink)throw new P(63);c.La.symlink(c,b,a)}function ra(a){var b=U(a,{parent:!0}).node;a=yb(a);var c=Mb(b,a),d=$b(b,a,!1);if(d)throw new P(d);if(!b.La.unlink)throw new P(63);if(c.$a)throw new P(10);b.La.unlink(b,a);Ub(c)}
function Rb(a){a=U(a).node;if(!a)throw new P(44);if(!a.La.readlink)throw new P(28);return Ab(Sb(a.parent),a.La.readlink(a))}function gc(a,b){a=U(a,{Xa:!b}).node;if(!a)throw new P(44);if(!a.La.Ta)throw new P(63);return a.La.Ta(a)}function hc(a){return gc(a,!0)}function ea(a,b){a="string"===typeof a?U(a,{Xa:!0}).node:a;if(!a.La.Sa)throw new P(63);a.La.Sa(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()})}
function ic(a){a="string"===typeof a?U(a,{Xa:!0}).node:a;if(!a.La.Sa)throw new P(63);a.La.Sa(a,{timestamp:Date.now()})}function Kc(a,b){if(0>b)throw new P(28);a="string"===typeof a?U(a,{Xa:!0}).node:a;if(!a.La.Sa)throw new P(63);if(R(a.mode))throw new P(31);if(32768!==(a.mode&61440))throw new P(28);var c=Vb(a,"w");if(c)throw new P(c);a.La.Sa(a,{size:b,timestamp:Date.now()})}
function w(a,b,c,d){if(""===a)throw new P(44);if("string"===typeof b){var f=Xb[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=r(a);try{g=U(a,{Xa:!(b&131072)}).node}catch(m){}}f=!1;if(b&64)if(g){if(b&128)throw new P(20);}else g=da(a,c,0),f=!0;if(!g)throw new P(44);8192===(g.mode&61440)&&(b&=-513);if(b&65536&&!R(g.mode))throw new P(54);if(!f&&(c=g?40960===(g.mode&61440)?32:R(g.mode)&&
("r"!==Yb(b)||b&512)?31:Vb(g,Yb(b)):44))throw new P(c);b&512&&Kc(g,0);b&=-131713;d=bc({node:g,path:Sb(g),id:g.id,flags:b,mode:g.mode,seekable:!0,position:0,Ma:g.Ma,La:g.La,Pb:[],error:!1},d);d.Ma.open&&d.Ma.open(d);!e.logReadFiles||b&1||(Lc||(Lc={}),a in Lc||(Lc[a]=1));return d}function ha(a){if(null===a.fd)throw new P(8);a.nb&&(a.nb=null);try{a.Ma.close&&a.Ma.close(a)}catch(b){throw b;}finally{S[a.fd]=null}a.fd=null}
function Nc(a,b,c){if(null===a.fd)throw new P(8);if(!a.seekable||!a.Ma.Ya)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Ma.Ya(a,b,c);a.Pb=[]}function Oc(a,b,c,d,f){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ma.read)throw new P(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ma.read(a,b,c,d,f);g||(a.position+=b);return b}
function fa(a,b,c,d,f,g){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ma.write)throw new P(28);a.seekable&&a.flags&1024&&Nc(a,0,2);var m="undefined"!==typeof f;if(!m)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ma.write(a,b,c,d,f,g);m||(a.position+=b);return b}
function qa(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||0;b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=w(a,b.flags);a=gc(a).size;var f=new Uint8Array(a);Oc(d,f,0,a,0);"utf8"===b.encoding?c=Wa(f,0):"binary"===b.encoding&&(c=f);ha(d);return c}
function Pc(){P||(P=function(a,b){this.node=b;this.Ob=function(c){this.Pa=c};this.Ob(a);this.message="FS error"},P.prototype=Error(),P.prototype.constructor=P,[44].forEach(function(a){Lb[a]=new P(a);Lb[a].stack="<generic error, no stack>"}))}var Qc;function ca(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Rc(a,b,c){a=r("/dev/"+a);var d=ca(!!b,!!c);Sc||(Sc=64);var f=Sc++<<8|0;Db(f,{open:function(g){g.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(g,m,t,v){for(var u=0,B=0;B<v;B++){try{var G=b()}catch(Y){throw new P(29);}if(void 0===G&&0===u)throw new P(6);if(null===G||void 0===G)break;u++;m[t+B]=G}u&&(g.node.timestamp=Date.now());return u},write:function(g,m,t,v){for(var u=0;u<v;u++)try{c(m[t+u])}catch(B){throw new P(29);}v&&(g.node.timestamp=Date.now());return u}});
ec(a,d,f)}var Sc,W={},cc,Lc,Tc={};
function Uc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&r(b)!==r(Sb(f.node)))return-54;throw f;}J[c>>2]=d.dev;J[c+4>>2]=0;J[c+8>>2]=d.ino;J[c+12>>2]=d.mode;J[c+16>>2]=d.nlink;J[c+20>>2]=d.uid;J[c+24>>2]=d.gid;J[c+28>>2]=d.rdev;J[c+32>>2]=0;M=[d.size>>>0,(N=d.size,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];J[c+40>>2]=M[0];J[c+44>>2]=M[1];J[c+48>>2]=4096;J[c+52>>2]=d.blocks;J[c+56>>2]=d.atime.getTime()/1E3|0;J[c+60>>2]=
0;J[c+64>>2]=d.mtime.getTime()/1E3|0;J[c+68>>2]=0;J[c+72>>2]=d.ctime.getTime()/1E3|0;J[c+76>>2]=0;M=[d.ino>>>0,(N=d.ino,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];J[c+80>>2]=M[0];J[c+84>>2]=M[1];return 0}var Vc=void 0;function Wc(){Vc+=4;return J[Vc-4>>2]}function X(a){a=S[a];if(!a)throw new P(8);return a}var Xc;Xc=xa?function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:function(){return performance.now()};
var Yc={};function Zc(){if(!$c){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:ua||"./this.program"},b;for(b in Yc)void 0===Yc[b]?delete a[b]:a[b]=Yc[b];var c=[];for(b in a)c.push(b+"="+a[b]);$c=c}return $c}var $c;
function Wb(a,b,c,d){a||(a=this);this.parent=a;this.Va=a.Va;this.$a=null;this.id=Pb++;this.name=b;this.mode=c;this.La={};this.Ma={};this.rdev=d}Object.defineProperties(Wb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});Pc();T=Array(4096);dc(Q,"/");V("/tmp");V("/home");V("/home/web_user");
(function(){V("/dev");Db(259,{read:function(){return 0},write:function(b,c,d,f){return f}});ec("/dev/null",259);Cb(1280,Fb);Cb(1536,Gb);ec("/dev/tty",1280);ec("/dev/tty1",1536);var a=zb();Rc("random",a);Rc("urandom",a);V("/dev/shm");V("/dev/shm/tmp")})();
(function(){V("/proc");var a=V("/proc/self");V("/proc/self/fd");dc({Va:function(){var b=Kb(a,"fd",16895,73);b.La={lookup:function(c,d){var f=S[+d];if(!f)throw new P(8);c={parent:null,Va:{Ab:"fake"},La:{readlink:function(){return f.path}}};return c.parent=c}};return b}},"/proc/self/fd")})();function ja(a,b){var c=Array(aa(a)+1);a=k(a,c,0,c.length);b&&(c.length=a);return c}
var bd={a:function(a,b,c,d){I("Assertion failed: "+D(a)+", at: "+[b?D(b):"unknown filename",c,d?D(d):"unknown function"])},r:function(a,b){ub||(ub=!0,mb());a=new Date(1E3*J[a>>2]);J[b>>2]=a.getSeconds();J[b+4>>2]=a.getMinutes();J[b+8>>2]=a.getHours();J[b+12>>2]=a.getDate();J[b+16>>2]=a.getMonth();J[b+20>>2]=a.getFullYear()-1900;J[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),0,1);J[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;J[b+36>>2]=-(60*a.getTimezoneOffset());var d=(new Date(a.getFullYear(),
6,1)).getTimezoneOffset();c=c.getTimezoneOffset();a=(d!=c&&a.getTimezoneOffset()==Math.min(c,d))|0;J[b+32>>2]=a;a=J[pb()+(a?4:0)>>2];J[b+40>>2]=a;return b},w:function(a,b){try{a=D(a);if(b&-8)var c=-28;else{var d=U(a,{Xa:!0}).node;d?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Vb(d,a)?-2:0):c=-44}return c}catch(f){if("undefined"===typeof W||!(f instanceof P))throw f;return-f.Pa}},J:function(a,b){try{return a=D(a),ea(a,b),0}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},
x:function(a){try{return a=D(a),ic(a),0}catch(b){if("undefined"===typeof W||!(b instanceof P))throw b;return-b.Pa}},g:function(a,b){try{var c=S[a];if(!c)throw new P(8);ea(c.node,b);return 0}catch(d){if("undefined"===typeof W||!(d instanceof P))throw d;return-d.Pa}},y:function(a){try{var b=S[a];if(!b)throw new P(8);ic(b.node);return 0}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},b:function(a,b,c){Vc=c;try{var d=X(a);switch(b){case 0:var f=Wc();return 0>f?-28:w(d.path,
d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;case 4:return f=Wc(),d.flags|=f,0;case 5:return f=Wc(),Ma[f+0>>1]=2,0;case 6:case 7:return 0;case 16:case 8:return-28;case 9:return J[ad()>>2]=28,-1;default:return-28}}catch(g){if("undefined"===typeof W||!(g instanceof P))throw g;return-g.Pa}},l:function(a,b){try{var c=X(a);return Uc(gc,c.path,b)}catch(d){if("undefined"===typeof W||!(d instanceof P))throw d;return-d.Pa}},i:function(a,b,c,d){try{b=D(b);var f=d&256;d&=4096;var g=b;if("/"===
g[0])b=g;else{if(-100===a)var m="/";else{var t=S[a];if(!t)throw new P(8);m=t.path}if(0==g.length){if(!d)throw new P(44);b=m}else b=r(m+"/"+g)}return Uc(f?hc:gc,b,c)}catch(v){if("undefined"===typeof W||!(v instanceof P))throw v;return-v.Pa}},E:function(a,b){try{var c=S[a];if(!c)throw new P(8);if(0===(c.flags&2097155))throw new P(28);Kc(c.node,b);return 0}catch(d){if("undefined"===typeof W||!(d instanceof P))throw d;return-d.Pa}},s:function(a,b){try{if(0===b)return-28;if(b<aa("/")+1)return-68;k("/",
n,a,b);return a}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},B:function(){return 0},j:function(a,b){try{return a=D(a),Uc(hc,a,b)}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},h:function(a,b){try{return a=D(a),a=r(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),V(a,b),0}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},I:function(a,b,c,d,f,g){try{a:{g<<=12;var m=!1;if(0!==(d&16)&&0!==a%65536)var t=-28;else{if(0!==
(d&32)){var v=Hb(b);if(!v){t=-48;break a}m=!0}else{var u=S[f];if(!u){t=-8;break a}var B=g;if(0!==(c&2)&&0===(d&2)&&2!==(u.flags&2097155))throw new P(2);if(1===(u.flags&2097155))throw new P(2);if(!u.Ma.gb)throw new P(43);var G=u.Ma.gb(u,a,b,B,c,d);v=G.Mb;m=G.jb}Tc[v]={Jb:v,Ib:b,jb:m,fd:f,Lb:c,flags:d,offset:g};t=v}}return t}catch(Y){if("undefined"===typeof W||!(Y instanceof P))throw Y;return-Y.Pa}},H:function(a,b){try{var c=Tc[a];if(0!==b&&c){if(b===c.Ib){var d=S[c.fd];if(d&&c.Lb&2){var f=c.flags,
g=c.offset,m=n.slice(a,a+b);d&&d.Ma.hb&&d.Ma.hb(d,m,g,b,f)}Tc[a]=null;c.jb&&la(c.Jb)}var t=0}else t=-28;return t}catch(v){if("undefined"===typeof W||!(v instanceof P))throw v;return-v.Pa}},F:function(a,b,c){Vc=c;try{var d=D(a),f=c?Wc():0;return w(d,b,f).fd}catch(g){if("undefined"===typeof W||!(g instanceof P))throw g;return-g.Pa}},t:function(a,b,c){try{a=D(a);if(0>=c)var d=-28;else{var f=Rb(a),g=Math.min(c,aa(f)),m=A[b+g];k(f,n,b,c+1);A[b+g]=m;d=g}return d}catch(t){if("undefined"===typeof W||!(t instanceof
P))throw t;return-t.Pa}},u:function(a){try{a=D(a);var b=U(a,{parent:!0}).node,c=yb(a),d=Mb(b,c),f=$b(b,c,!0);if(f)throw new P(f);if(!b.La.rmdir)throw new P(63);if(d.$a)throw new P(10);b.La.rmdir(b,c);Ub(d);return 0}catch(g){if("undefined"===typeof W||!(g instanceof P))throw g;return-g.Pa}},k:function(a,b){try{return a=D(a),Uc(gc,a,b)}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return-c.Pa}},A:function(a){try{return a=D(a),ra(a),0}catch(b){if("undefined"===typeof W||!(b instanceof
P))throw b;return-b.Pa}},G:function(){return 2147483648},e:Xc,n:function(a,b,c){n.copyWithin(a,b,b+c)},c:function(a){var b=n.length;a>>>=0;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);d=Math.max(a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Pa.grow(Math.min(2147483648,d)-Ya.byteLength+65535>>>16);Za();var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},p:function(a,b){var c=0;Zc().forEach(function(d,f){var g=b+c;f=J[a+4*f>>2]=g;for(g=0;g<d.length;++g)A[f++>>
0]=d.charCodeAt(g);A[f>>0]=0;c+=d.length+1});return 0},q:function(a,b){var c=Zc();J[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});J[b>>2]=d;return 0},d:function(a){try{var b=X(a);ha(b);return 0}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return c.Pa}},o:function(a,b){try{var c=X(a);A[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){if("undefined"===typeof W||!(d instanceof P))throw d;return d.Pa}},D:function(a,b,c,d){try{a:{for(var f=X(a),g=a=
0;g<c;g++){var m=J[b+(8*g+4)>>2],t=Oc(f,A,J[b+8*g>>2],m,void 0);if(0>t){var v=-1;break a}a+=t;if(t<m)break}v=a}J[d>>2]=v;return 0}catch(u){if("undefined"===typeof W||!(u instanceof P))throw u;return u.Pa}},m:function(a,b,c,d,f){try{var g=X(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;Nc(g,a,d);M=[g.position>>>0,(N=g.position,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];J[f>>2]=M[0];J[f+
4>>2]=M[1];g.nb&&0===a&&0===d&&(g.nb=null);return 0}catch(m){if("undefined"===typeof W||!(m instanceof P))throw m;return m.Pa}},v:function(a){try{var b=X(a);return b.Ma&&b.Ma.fsync?-b.Ma.fsync(b):0}catch(c){if("undefined"===typeof W||!(c instanceof P))throw c;return c.Pa}},z:function(a,b,c,d){try{a:{for(var f=X(a),g=a=0;g<c;g++){var m=fa(f,A,J[b+8*g>>2],J[b+(8*g+4)>>2],void 0);if(0>m){var t=-1;break a}a+=m}t=a}J[d>>2]=t;return 0}catch(v){if("undefined"===typeof W||!(v instanceof P))throw v;return v.Pa}},
f:function(a){var b=Date.now();J[a>>2]=b/1E3|0;J[a+4>>2]=b%1E3*1E3|0;return 0},K:function(a){var b=Date.now()/1E3|0;a&&(J[a>>2]=b);return b},C:function(a,b){if(b){var c=b+8;b=1E3*J[c>>2];b+=J[c+4>>2]/1E3}else b=Date.now();a=D(a);try{var d=U(a,{Xa:!0}).node;d.La.Sa(d,{timestamp:Math.max(b,b)});var f=0}catch(g){if(!(g instanceof P)){b:{f=Error();if(!f.stack){try{throw Error();}catch(m){f=m}if(!f.stack){f="(no stack trace available)";break b}}f=f.stack.toString()}e.extraStackTrace&&(f+="\n"+e.extraStackTrace());
f=lb(f);throw g+" : "+f;}f=g.Pa;J[ad()>>2]=f;f=-1}return f}};
(function(){function a(f){e.asm=f.exports;Pa=e.asm.L;Za();Ia=e.asm.Ca;ab.unshift(e.asm.M);db--;e.monitorRunDependencies&&e.monitorRunDependencies(db);0==db&&(null!==eb&&(clearInterval(eb),eb=null),fb&&(f=fb,fb=null,f()))}function b(f){a(f.instance)}function c(f){return jb().then(function(g){return WebAssembly.instantiate(g,d)}).then(function(g){return g}).then(f,function(g){Fa("failed to asynchronously prepare wasm: "+g);I(g)})}var d={a:bd};db++;e.monitorRunDependencies&&e.monitorRunDependencies(db);
if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return Fa("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return La||"function"!==typeof WebAssembly.instantiateStreaming||gb()||O.startsWith("file://")||"function"!==typeof fetch?c(b):fetch(O,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(g){Fa("wasm streaming compile failed: "+g);Fa("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();
e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.M).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.N).apply(null,arguments)};var ad=e.___errno_location=function(){return(ad=e.___errno_location=e.asm.O).apply(null,arguments)};e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.P).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.Q).apply(null,arguments)};
e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.R).apply(null,arguments)};e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.S).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.T).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.U).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.V).apply(null,arguments)};
e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.W).apply(null,arguments)};e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.X).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.Y).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.Z).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm._).apply(null,arguments)};
e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.$).apply(null,arguments)};e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.aa).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm.ba).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.ca).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.da).apply(null,arguments)};
e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ea).apply(null,arguments)};e._sqlite3_column_count=function(){return(e._sqlite3_column_count=e.asm.fa).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.ga).apply(null,arguments)};e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ha).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ia).apply(null,arguments)};
e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ja).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ka).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.la).apply(null,arguments)};e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.ma).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.na).apply(null,arguments)};
e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.pa).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.qa).apply(null,arguments)};e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.ra).apply(null,arguments)};e._sqlite3_sql=function(){return(e._sqlite3_sql=e.asm.sa).apply(null,arguments)};
e._sqlite3_normalized_sql=function(){return(e._sqlite3_normalized_sql=e.asm.ta).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.ua).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.va).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.wa).apply(null,arguments)};e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.xa).apply(null,arguments)};
e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.ya).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.za).apply(null,arguments)};var ba=e._malloc=function(){return(ba=e._malloc=e.asm.Aa).apply(null,arguments)},la=e._free=function(){return(la=e._free=e.asm.Ba).apply(null,arguments)};e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.Da).apply(null,arguments)};
var pb=e.__get_tzname=function(){return(pb=e.__get_tzname=e.asm.Ea).apply(null,arguments)},ob=e.__get_daylight=function(){return(ob=e.__get_daylight=e.asm.Fa).apply(null,arguments)},nb=e.__get_timezone=function(){return(nb=e.__get_timezone=e.asm.Ga).apply(null,arguments)},ma=e.stackSave=function(){return(ma=e.stackSave=e.asm.Ha).apply(null,arguments)},oa=e.stackRestore=function(){return(oa=e.stackRestore=e.asm.Ia).apply(null,arguments)},z=e.stackAlloc=function(){return(z=e.stackAlloc=e.asm.Ja).apply(null,
arguments)},Ib=e._memalign=function(){return(Ib=e._memalign=e.asm.Ka).apply(null,arguments)};e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!d?Ra(a):function(){return Sa(a,b,c,arguments)}};e.UTF8ToString=D;e.stackSave=ma;e.stackRestore=oa;e.stackAlloc=z;var cd;fb=function dd(){cd||ed();cd||(fb=dd)};
function ed(){function a(){if(!cd&&(cd=!0,e.calledRun=!0,!Qa)){e.noFSInit||Qc||(Qc=!0,Pc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Rc("stdin",e.stdin):fc("/dev/tty","/dev/stdin"),e.stdout?Rc("stdout",null,e.stdout):fc("/dev/tty","/dev/stdout"),e.stderr?Rc("stderr",null,e.stderr):fc("/dev/tty1","/dev/stderr"),w("/dev/stdin",0),w("/dev/stdout",1),w("/dev/stderr",1));Qb=!1;kb(ab);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=
[e.postRun]);e.postRun.length;){var b=e.postRun.shift();bb.unshift(b)}kb(bb)}}if(!(0<db)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)cb();kb($a);0<db||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=ed;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();ed();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    var config = data["config"] ? data["config"] : {};
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"], config)
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done, config);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
