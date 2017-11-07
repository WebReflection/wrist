
var model = {
	person : "bob"
}

var sel1;
var twoWay;
var oneWay;
var clickOneWay;
var dump;
var killer;

var sync

function test(){

	sel1 = document.getElementById("sel1");
	twoWay = document.getElementById("twoWay");
	oneWay = document.getElementById("oneWay");
	clickOneWay = document.getElementById("clickOneWay");
	clickOneWay.addEventListener("click", doOneWay)
	dump = document.getElementById("dump");
	killer = document.getElementById("destroy");
	killer.addEventListener("click", destroy)

	sync = new gieson.SyncModel({
		model : model,
		callback : changed
	});

	sync.link("person", sel1, "value");
	sync.link("person", twoWay, "value");
	sync.link("person", callme);

}

function changed(prop, prev, curr){
	dump.innerHTML = JSON.stringify(model, true, "\t");
}

function callme(prop, prev, curr) {
	oneWay.value = curr;
}

function doOneWay(e){
	model.person = oneWay.value;
}

function destroy(){
	sync.destroy();
	sync = null;
}

document.addEventListener("DOMContentLoaded", test);

try { console.log('try: model.person = "tom";'); } catch(o_O) {}

