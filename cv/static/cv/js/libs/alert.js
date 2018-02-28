(function(){

    /**
     * DEFAULT VARIABLES
     */
    
    var defaultAlertType = 'info';
    var alertDuration    = 5000;
    
    /**
     * [ALERT]
     * @param {number} id          Position dans le manager
     * @param {string} type        Type de popup (info,success,error,...)
     * @param {char} typeIcn       Lettre correspondant à l'icone
     * @param {string} text        Contenu de la popup
     * @param {number} topPosition Position par rapport au bord haut de la fenêtre
     */
    var Alert = function(id,type,text,topPosition){

        this.id = id;

        this.element = document.createElement("div");
        this.element.className = "alert_" + type;
        this.element.innerHTML = text;
        this.element.style.top = (topPosition + 25) + "px";
        document.getElementsByTagName('body')[0].appendChild(this.element);
        
        this.height = this.element.clientHeight;
        alertManager.topPosition += 25+this.height;

        this.timeout = setTimeout(function(alert){
            return function(){  
                alert.remove();
            };
        }(this),alertDuration);

        this.element.onclick = function(alert){
            return function(){  
                clearTimeout(alert.timeout);    
                alert.remove();
            };
        }(this);

    };

    /**
     * Actualise l'id et repositionne la popup après la suppression d'une autre
     * @param  {number} height Nouvelle position
     */
    Alert.prototype.update = function(height){
        this.id--;
        this.element.style.top = (this.element.offsetTop - height) + "px";
    };

    /**
     * Supprime la popup
     */
    Alert.prototype.remove = function() {
        this.element.style.opacity = 0;
        setTimeout(function(alert){
            return function(){
                alert.element.parentNode.removeChild(alert.element);
                alertManager.remove(alert.id,alert.height+25);
            };
        }(this),500);
    };

    /**
     * ALERT MANAGER
     */
     
    var AlertManager = function(){
        this.topPosition = 0;
        this.alerts      = [];
    };

    /**
     * Créé une popup
     * @param  {string} type Type de popup
     * @param  {string} text Contenu de la popup
     */
    AlertManager.prototype.create = function(type,text){
        this.alerts.push(new Alert(this.alerts.length,type,text,this.topPosition));
    };

    /**
     * Supprime une popup
     * @param  {number} id     Id de la popup à supprimer
     * @param  {number} height Hauteur de la popup à supprimer
     */
    AlertManager.prototype.remove = function(id,height){
        this.alerts.splice(id,1);
        this.topPosition -= height;
        for(var i=id,l=this.alerts.length;i<l;i++){
            this.alerts[i].update(height);
        }
    };

    /**
     * EXPORT
     */

    window.alertManager = new AlertManager();
    window.alert = function(text, type){
        type = type || defaultAlertType;
        alertManager.create(type,text);
    };

})();

//
// Instanciation
//
