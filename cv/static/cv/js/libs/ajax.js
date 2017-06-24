(function(){

    /**
     * DEFAULTS VARIABLES
     */
    
    var defaultCallback   = function(){};
    var defaultAsynchrone = true;
    var defaultUsername   = null;
    var defaultPassword   = null;
    
    /**
     * Classe permettant de réaliser des requêtes ajax simplement
     * @param {string} url           Page cible
     * @param {object} parameters    Paramètres à envoyer
     * @param {string} method        Méthode de transfert
     * @param {object} callbacks     Ensemble de fonction de callback liés à la requête (complete,success,error)
     * @param {object} options       Ensemble d'options (asynchrone,username,password)
     */
    var Ajax = function(url,parameters,method,_callbacks,_options){

        var callbacks = _callbacks || {};
        var options   = _options   || {};

        this.url         = url;
        this.parameters  = this.stringifyParameters(parameters);
        this.method      = method.toUpperCase();
        this.callbacks   = {
            complete : callbacks.complete || defaultCallback,
            success  : callbacks.success  || defaultCallback,
            error    : callbacks.error    || defaultCallback  
        };
        this.options     = {
            asynchrone : options.asynchrone || defaultAsynchrone,
            username   : options.username   || defaultUsername,
            password   : options.password   || defaultPassword,
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (function(callbacks){
            return function(){
                if(xhr.readyState === 2 ){
                    callbacks.complete();
                }else if(xhr.readyState === 4 && xhr.status === 200){
                    callbacks.success(xhr.responseText);
                }else if(xhr.readyState === 4){
                    callbacks.error(xhr.status,xhr.statusText);
                }
            }; 
        })(this.callbacks);

        xhr.open(
            this.method,
            url + (this.method === "GET" ? "?"+this.parameters : ""),
            options.asynchrone || true,
            options.username   || null,
            options.password   || null
        );

        if(this.method === "POST"){
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
             xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        xhr.send(this.method === "POST" ? this.parameters : null);

    };
      
    Ajax.prototype.stringifyParameters = function(parameters){

        var string = "";
        for(var key in parameters){
            string += key+"="+parameters[key]+"&";
        }
        
        return string.substring(0,string.length-1);

    };

    /**
     * Classe permettant de réaliser des requêtes ajax à la soumission d'un formulaire
     * @param {element} form      Formulaire à envoyer
     * @param {object} callbacks Ensemble de fonction de callback liés à la requête (complete,success,error)
     * @param {object} options   Ensemble d'options (asynchrone,username,password)
     */
    var AjaxForm = function(form,callbacks,options){

        var elements   = form.elements;
        var parameters = {};

        for(var i=0,l=elements.length;i<l;i++){
            var element = elements[i];
            if(element.type === 'checkbox' && !element.checked || element.type === 'submit' ) continue;
            parameters[element.name] = element.value;
        }

        return new Ajax(
            form.action,
            parameters,
            form.method,
            callbacks,
            options
        );
    };
    
    /**
     * EXPORT
     */
    
    window.Ajax     = Ajax;
    window.AjaxForm = AjaxForm;

})();

