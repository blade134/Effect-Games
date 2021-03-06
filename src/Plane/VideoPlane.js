// Effect Games Engine v1.0
// Copyright (c) 2005 - 2011 Joseph Huckaby
// Source Code released under the MIT License: 
// http://www.opensource.org/licenses/mit-license.php

////
// VideoPlane.js
// Layer of video
////

function VideoPlane(_id) {
	// class constructor
	if (!_id) _id = _get_unique_id();
	this.id = _id;	
};

VideoPlane.prototype = merge_objects( new _Plane(), new _EventHandlerBase() );

VideoPlane.prototype.scrollX = 0;
VideoPlane.prototype.scrollY = 0;
VideoPlane.prototype.scrollSpeed = 1.0;
VideoPlane.prototype.zIndex = 1;
VideoPlane.prototype.visible = true;
VideoPlane.prototype.url = '';
VideoPlane.prototype.loop = false;
VideoPlane.prototype.volume = 1.0;
VideoPlane.prototype.playing = false;

VideoPlane.prototype.setZIndex = function(_idx) {
	// set zIndex level
	this.zIndex = _idx;
};

VideoPlane.prototype.init = function() {
	// init graphical elements
	if (!this.port) return _throwError( "No port attached to VideoPlane" );
	
	if (this.url) {
		this.setMovie( this.url, this.loop );
		if (this.playing && (gGame.inGame || gGame._runAfterZoom)) {
			Debug.trace('video', "Resuming movie");
			this.play();
		}
	}
};

VideoPlane.prototype.setMovie = function(_url, _loop) {
	if (this.clip) this.reset();
	
	this.url = _url;
	this.loop = _loop;
	if (!this.port) return;
	
	this.clip = gGame._videoLoader._getClip( _url );
	this.clip._set_active( _url );
	this.clip._set_loop( _loop );
	this.clip._set_volume( this.volume );
	
	// make us the event handler, for onMovieEnd
	var video = Effect.VideoManager._videos[ this.clip.id ];
	video.handler = this;
	
	this.style = this.clip.style;
	
	this.style.left = '0px';
	this.style.top = '0px';
	this.style.zIndex = this.zIndex;
	this.style.visibility = this.visible ? "visible" : "hidden";
	
	this.clip._set_size( this.port.portWidth * this.port.getZoomLevel(), this.port.portHeight * this.port.getZoomLevel() );
};

VideoPlane.prototype.reset = function() {
	// destroy graphical elements (or in this case just hide them)
	this.clip._deactivate();
	
	// return handler to loader
	var video = Effect.VideoManager._videos[ this.clip.id ];
	video.handler = gGame._videoLoader;
	
	delete this.clip;
	delete this.style;
};

VideoPlane.prototype.logic = function(_logicClock) {
	// called for each logic loop iteration
};

VideoPlane.prototype.draw = function() {
	// called for each draw loop iteration
};

VideoPlane.prototype.setScroll = function(_sx, _sy) {
	// set new scroll position
	this.scrollX = _sx * this.scrollSpeed;
	this.scrollY = _sy * this.scrollSpeed;
	
	// TODO: update video scroll
	
};

VideoPlane.prototype.hide = function() {
	// hide graphical elements
	this.visible = false;
	if (this.style) this.style.visibility = this.visible ? "visible" : "hidden";
};

VideoPlane.prototype.show = function() {
	// show graphical elements
	this.visible = true;
	if (this.style) this.style.visibility = this.visible ? "visible" : "hidden";
};

VideoPlane.prototype.play = function() {
	// pass along to clip
	if (this.clip) {
		this.clip._play();
	}
	this.playing = true;
};

VideoPlane.prototype.stop = function() {
	// pass along to clip
	if (this.clip) {
		this.clip._stop();
	}
	this.playing = false;
};

VideoPlane.prototype.rewind = function() {
	// rewind clip to position 0
	if (this.clip) {
		this.clip._rewind();
	}
};

VideoPlane.prototype.setPostion = function(_pos) {
	// set position to custom time index
	if (this.clip) {
		this.clip._set_position(_pos);
	}
};

VideoPlane.prototype.getPosition = function() {
	// return current video playhead position
	if (this.clip) {
		return this.clip._get_position();
	}
	else return 0;
};

VideoPlane.prototype.setLoop = function(_loop) {
	// set the loop
	this.loop = _loop;
	if (this.clip) this.clip._set_loop( this.loop );
};

VideoPlane.prototype.setVolume = function(_vol) {
	// set the clip volume
	this.volume = _vol;
	if (this.clip) this.clip._set_volume( this.volume );
};

VideoPlane.prototype.pause = function() {
	// event listener for Game.onPause
	// pause gameplay, video should follow if playing
	if (this.playing && this.clip) {
		this.clip._stop();
	}
};

VideoPlane.prototype.resume = function() {
	// event listener for Game.onResume
	// resume gameplay, video should follow
	if (this.playing && this.clip) {
		this.clip._play();
	}
};
