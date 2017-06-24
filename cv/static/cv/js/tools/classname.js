(function () {

    /**
     * DEFAULTS VARIABLES
     */

    var hasClass;
    var addClass;
    var removeClass;
    var toggleClass;

    var classRegExp = function(classname){
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    };

    /**
     * METHODS DEFINITIONS
     */

    if ('classList' in document.documentElement){

        hasClass = function(classname){
            return this.classList.contains(classname);
        };

        addClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(!this.classList.contains(arguments[i])){
                    this.classList.add(arguments[i]);
                }
            }
        };

        removeClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(this.classList.contains(arguments[i])){
                    this.classList.remove(arguments[i]);
                }
            }
        };

        toggleClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(this.classList.contains(arguments[i])){
                    this.classList.remove(arguments[i]);
                }else{
                    this.classList.add(arguments[i]);
                }
            }
        };

    } else {

        hasClass = function(classname){
            return classRegExp(classname).test(this.className);
        };

        addClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(!classRegExp(arguments[i]).test(this.className)){
                    this.className += ' ' + arguments[i];
                }
            }
        };

        removeClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(classRegExp(arguments[i]).test(this.className)){
                    this.className.replace(classRegExp(arguments[i])," ");
                }
            }
        };

        toggleClass = function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(classRegExp(arguments[i]).test(this.className)){
                    this.className.replace(classRegExp(arguments[i])," ");
                }else{
                    this.className += ' ' + arguments[i];
                }
            }
        };

    }

    /**
     * ASSIGNATION
     */

    Element.prototype.hasClass    = hasClass;
    Element.prototype.addClass    = addClass;
    Element.prototype.removeClass = removeClass;
    Element.prototype.toggleClass = toggleClass;

})();
