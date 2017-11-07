this.gieson = this.gieson || {};

(function (){

var SyncModel = function(params){
	this.init(params);
}

var p = SyncModel.prototype;

	p._model = null;
	p._gang = null;
	p._propChange_bound = null;
	p._linkChange_bound = null;
	p._callback = null;

	p.init = function(params){
		this._model = params.model;
		this._gang = [];
		this._propChange_bound = this._propChange.bind(this);
		this._linkChange_bound = this._linkChange.bind(this);

		this._callback = params.callback;
		for(var prop in this._model) {
			if(this._model.hasOwnProperty(prop)){
				this.addProp(prop);
			}
		}
	}

	p.addProp = function(prop){
		if( ! this._gang[prop] ){
			this._gang[prop] = [];
			wrist.watch(this._model, prop, this._propChange_bound);
		}
	}

	p._propChange = function(prop, prev, curr){
		var trip = this._gang[prop];
		for(var i=0; i<trip.length; i++){
			var item = trip[i];
			if(item.obj){
				item.obj[item.key] = curr;
			}
			if(item.fn){
				item.fn(prop, prev, curr);
			}
		}
		if(this._callback){
			this._callback(prop, prev, curr);
		}
	}

	p.link = function(prop, obj, key, fn){
		if( this._gang[prop] ) {

			if(typeof obj == 'function'){
				fn = obj;
				obj = null;
				key = null;
			}

			var watchFn;
			if(obj){

				// So we can unwatch / proper GC.
				watchFn = function(Vfn, Vprop){
										return function(a, b, c){
											Vfn(Vprop, b, c);
										}
									}(this._linkChange_bound, prop);
				
				wrist.watch(obj, key, watchFn);
			
			}
			
			this._gang[prop].push({
				watchFn : watchFn,
				obj : obj,
				key : key, 
				fn : fn
			});

		} else {
			throw new Error('The following property does not exist: ' + prop);
		}
	}

	p._linkChange = function(prop, prev, curr){
		this._model[prop] = curr;
	}

	p.unlink = function(prop, obj, key, fn){

		var trip = this._gang[prop];

		for(var i=0; i<trip.length; i++){

			var item = trip[i];

			if(    (item.obj === obj && item.key === key && item.fn === fn) 
				|| (item.obj === obj && !key && !fn) 
				|| (item.fn === fn && !obj && !key ) 
			) {
				
				if(item.obj){
					wrist.unwatch(item.obj, item.key, item.watchFn);
				}
				
				this._gang.splice(i, 1);
			
				item.obj = null;
				item.key = null;
				item.fn = null;
				item = null;
				break;

			}
		}
	}

	p.destroy = function(){

		for(var prop in this._model){
			if(this._model.hasOwnProperty(prop)){

				wrist.unwatch(this._model, prop, this._propChange_bound);

				var trip = this._gang[prop];

				for(var i=0; i<trip.length; i++){

					var item = trip[i];

					if(item.obj){
						wrist.unwatch(item.obj, item.key, item.watchFn);
					}

					item.obj = null;
					item.key = null;
					item.fn = null;
					this._gang[prop] = null;

				}
			}
		}
		

		this._model = null;
		this._gang = null;
		this._propChange_bound = null;
		this._linkChange_bound = null;
		this._callback = null;

	}

	gieson.SyncModel = SyncModel;
	
}());
