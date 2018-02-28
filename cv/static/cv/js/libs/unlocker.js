(function (){

    /**
     * DEFAULTS VARIABLES
     */
    
    var defaultCallback = function () {};

    var defaultText = {
        initial : "Envoyer",
        waiting : "Envoi en cours"
    };



    /**
     * UNLOCKER
     */
    
    var Unlocker = function(element,callback,options){

        // Attributs
        
        this.element = {
            element : element,
            left    : element.offsetLeft,
            width   : element.clientWidth,
            textContainer : element.querySelector("p"),
            thumb : element.querySelector(".thumb")
        };

        this.text = {
            initial : options ? (options.text ? (options.text.initial || defaultText.initial) : defaultText.initial ) : defaultText.initial,
            waiting : options ? (options.text ? (options.text.waiting || defaultText.waiting) : defaultText.waiting ) : defaultText.waiting
        };

        this.callback = callback || defaultCallback;

        var _isActive = options ? options.active || false : false;
        Object.defineProperty(this,"isActive",{
            get:function(){return _isActive;},
            set:function(newValue){         
                _isActive = newValue;
                this.element.element.className = "unlocker" + (_isActive ? " active" : "");
            }
        });
        this.isActive = _isActive;

        this.offsetX      = 0;
        this.lastPosition = 0;

        this.listeners = {

            start : function(unlocker){
                return function(e){
                    unlocker.start(e);
                };
            }(this),

            move : function(unlocker){
                return function(e){
                    unlocker.move(e);
                };
            }(this),

            end  : function(unlocker){
                return function(e){
                    unlocker.end(e);
                };
            }(this)
        };

        // Events
        
        /*this.element.thumb.onmousedown = function(unlocker){
            return function(e){
                document.getElementsByTagName("body")[0].className = "noSelect";
                var offsetX = e.clientX - unlocker.element.left;
                var lastPosition = parseFloat(unlocker.element.thumb.style.left) || 0;
                document.onmousemove = function(e){
                    var newPosition = lastPosition + e.clientX - offsetX - unlocker.element.left;
                    if(newPosition >= 0 && newPosition <= unlocker.element.width*0.75){
                        unlocker.element.thumb.style.left = newPosition + "px";
                    }else if(newPosition > unlocker.element.width*0.75){
                        unlocker.element.thumb.style.left =  unlocker.element.width*0.75 +"px";
                    }else if(newPosition < 0){
                        unlocker.element.thumb.style.left = "0px";
                    }
                };
                document.onmouseup = function(){
                    document.getElementsByTagName("body")[0].className = "";
                    if(parseFloat(unlocker.element.thumb.style.left) >= unlocker.element.width*0.70 && unlocker.isActive){
                        unlocker._waiting();
                        unlocker.callback();
                    }else{
                        unlocker._reposition();
                    }
                    this.onmousemove = this.ontouchmove = null;
                    this.onmouseup   = this.ontouchend = null;
                };
            };
        }(this);*/
        var unlocker = this;
        this.element.thumb.addEventListener('mousedown',this.listeners.start);
        this.element.thumb.addEventListener('touchstart',this.listeners.start);

    };

    Unlocker.prototype.start = function(event){

        document.getElementsByTagName("body")[0].className = "noSelect";
        
        if(event.type == 'mousedown'){
            this.offsetX = event.clientX - this.element.left;
        }else if(event.type == 'touchstart'){
            this.offsetX = event.changedTouches[0].clientX - this.element.left;
        }else{
            return;
        }

        this.lastPosition = parseFloat(this.element.thumb.style.left) || 0;

        var unlocker = this;

        document.addEventListener('mousemove',this.listeners.move);
        document.addEventListener('touchmove',this.listeners.move);

        document.addEventListener('mouseup',this.listeners.end);
        document.addEventListener('touchend',this.listeners.end);

    };

    Unlocker.prototype.move = function(event){

        var newPosition = null;
        if(event.type == 'mousemove'){
            newPosition = this.lastPosition + event.clientX - this.offsetX - this.element.left;
        }else if(event.type == 'touchmove'){
            newPosition = this.lastPosition + event.changedTouches[0].clientX - this.offsetX - this.element.left;
        }else{
            return;
        }
        
        if(newPosition >= 0 && newPosition <= this.element.width*0.75){
            this.element.thumb.style.left = newPosition + "px";
        }else if(newPosition > this.element.width*0.75){
            this.element.thumb.style.left =  this.element.width*0.75 +"px";
        }else if(newPosition < 0){
            this.element.thumb.style.left = "0px";
        }

    };

    Unlocker.prototype.end = function(){

        document.getElementsByTagName("body")[0].className = "";

        if(parseFloat(this.element.thumb.style.left) >= this.element.width*0.70 && this.isActive){
            this._waiting();
            this.callback();
        }else{
            this._reposition();
        }

        var unlocker = this;

        document.removeEventListener('mousemove',this.listeners.move);
        document.removeEventListener('touchmove',this.listeners.move);

        document.removeEventListener('mouseup',this.listeners.end);
        document.removeEventListener('touchend',this.listeners.end);
    };

    Unlocker.prototype._waiting = function(){
        this.element.thumb.style.opacity = 0;
        this.element.textContainer.textContent = this.text.waiting;
    };
    Unlocker.prototype._reposition = function(){   
        this.interval = setInterval(function(unlocker){
            return function(){        
                unlocker.element.thumb.style.left = (parseFloat(unlocker.element.thumb.style.left) - 5) + "px";
                if(parseFloat(unlocker.element.thumb.style.left) <= 0){
                    unlocker.element.thumb.style.left = "0px";
                    clearInterval(unlocker.interval);
                }
            };
        }(this),1);
    };
    Unlocker.prototype.reset = function(){
        this.element.thumb.style.left = "0px";
        this.element.thumb.style.opacity = 1;
        this.element.textContainer.textContent = this.text.initial;
    };

    window.Unlocker = Unlocker;

})();



