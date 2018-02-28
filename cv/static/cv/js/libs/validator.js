(function (window, document, undefined) {

    /**
     * DEFAULTS VARIABLES
     */

    var defaultCallback = function () {};

    var regex = {
        rule          : /^(.+?)\[(.+)\]$/,
        numeric       : /^[0-9]+$/,
        integer       : /^\-?[0-9]+$/,
        decimal       : /^\-?[0-9]*\.?[0-9]+$/,
        email         : /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/,
        alpha         : /^[a-z]+$/i,
        alphaNumeric  : /^[a-z0-9]+$/i,
        alphaDash     : /^[a-z0-9_\-]+$/i,
        alphaSpace    : /^[a-z0-9_\-\ ]+$/i,
        natural       : /^[0-9]+$/i,
        naturalNoZero : /^[1-9][0-9]*$/i,
        ip            : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        base64        : /[^a-zA-Z0-9\/\+=]/i,
        numericDash   : /^[\d\-\s]+$/,
        url           : /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        file          : /^((.?)[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\s-]+)+$/,
        folder        : /^((.?)[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\s-]+)+$/,
        fullName      : /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\s-\.']{2,}$/
    };

    /*
     * FORM VALIDATOR
     */

    var FormValidator = function (formElement, fields, callbacks) {

        //Attributs
        this.submitFormcallback  = callbacks.submit  || defaultCallback;
        this.validFormCallback   = callbacks.valid   || defaultCallback;
        this.invalidFormCallback = callbacks.invalid || defaultCallback;
        this.toggleFormCallback  = callbacks.toggle  || defaultCallback;

        this.form      = formElement;
        this.nbFields  = 0;
        this.fields    = {};

        for (var i=0,l=fields.length;i<l;i++){
            var field = fields[i];
            if(!field.name || field.rules.length === 0) continue;
            this._addField(field);
        }

        var _isValid = false;
        Object.defineProperty(this,"isValid",{
            get:function(){return _isValid;},
            set:function(newValue){
                if(newValue !== _isValid){
                    _isValid = newValue;
                    (_isValid ? this.validFormCallback : this.invalidFormCallback)();
                    this.toggleFormCallback(_isValid);
                }
            }
        });

        // Events

        this.form.onsubmit = (function(that){
            return function(e){
                that.submitFormcallback(e,that.isValid);
            };
        })(this);

        //Init validation
        this.validate();

    };
    FormValidator.prototype._addField = function(field) {
        this.fields[field.name] = new Field(
            this,
            this.form.elements[field.name],
            field.rules,
            field.change,
            field.valid,
            field.invalid,
            field.toggle
        );
        this.nbFields++;
    };
    FormValidator.prototype.validate = function(){
        var isValid = true;
        for (var fieldName in this.fields){
            var field = this.fields[fieldName];
            field._validate();
            if(!field.isValid){
                isValid = false;
            }
        }
        this.isValid = isValid;
        return isValid;
    };

    /**
     * FIELD
     */

    var Field = function(parentForm, fieldElement, rules, changeFieldCallback, validFieldCallback, invalidFieldCallback, toggleFieldCallback){

        //Attributs
        this.parentForm  = parentForm;
        this.field       = fieldElement;

        this.rules       = [];
        this.rulesLength = 0;
        this.isRequired  = false;
        if(rules && rules.length > 0) this._addRules(rules);

        this.changeFieldCallback  = changeFieldCallback  || defaultCallback;
        this.validFieldCallback   = validFieldCallback   || defaultCallback;
        this.invalidFieldCallback = invalidFieldCallback || defaultCallback;
        this.toggleFieldCallback  = toggleFieldCallback  || defaultCallback;

        var _isValid = false;
        Object.defineProperty(this,"isValid",{
            get:function(){return _isValid;},
            set:function(newValue){
                if(newValue !== _isValid){
                    _isValid = newValue;
                    (_isValid ? this.validFieldCallback : this.invalidFieldCallback)();
                    this.toggleFieldCallback(_isValid);
                }
            }
        });

        //Events
        var onChange = ((this.field.type === 'checkbox') || (this.field.type === 'radio') || (this.field.type === 'hidden')) ? 'onchange' : 'oninput';
        this.field[onChange] = function(field){
            return function(){
                field.changeFieldCallback(field.field.value);
                field.parentForm.validate();
            };
        }(this);

    };

    Field.prototype._addRules = function(newRules){

        for(var i=0,l=newRules.length;i<l;i++){

            var rule = newRules[i];

            if(rule === "required") this.isRequired = true;

            this.rules.push(rule);
            this.rulesLength++;

        }

    };

    Field.prototype._validate = function(){

        // Si Empty field
        var isInput = this.field.type !== 'checkbox' && this.field.type !== 'radio';
        var isEmpty = !this.field.value || this.field.value === '' || this.field.value === undefined;
        if(isInput && isEmpty){
            this.isValid = !this.isRequired;
            return;
        }

        // Sinon
        for(var i=0,l=this.rules.length;i<l;i++){

            var rule          = this.rules[i];
            var n             = rule.indexOf("=");
            var ruleName      = rule;
            var ruleParameter = null;

            if(~n){
                ruleName      = rule.substr(0,n);
                ruleParameter = rule.substr(n+1);
            }

            if(this._hooks.hasOwnProperty(ruleName)){
                if(!this._hooks[ruleName](this.parentForm,this.field,ruleParameter)){
                    this.isValid = false;
                    return;
                }
            }

        }
        this.isValid = true;
    };

    Field.prototype._hooks = {
        required: function(form,field) {
            var value = field.value;

            if ((field.type === 'checkbox') || (field.type === 'radio')) {
                return (field.checked === true);
            }

            return (value !== null && value !== '');
        },
        "default": function(form,field, defaultName){
            return field.value !== defaultName;
        },

        regex : function(form,field,regex){

            var firstSlash = regex.indexOf('/');
            var lastSlash  = regex.lastIndexOf('/');

            var pattern = regex.substr(firstSlash+1,lastSlash-firstSlash-1);
            var flags   = regex.substr(lastSlash+1);

            return new RegExp(pattern,flags).test(field.value);
        },

        matches: function(form,field, matchName) {
            var el = form.fields[matchName].field;

            if (el) {
                return field.value === el.value;
            }

            return false;
        },

        valid_email: function(form,field) {
            return regex.email.test(field.value);
        },

        valid_emails: function(form,field) {
            var result = field.value.split(",");

            for (var i = 0; i < result.length; i++) {
                if (!regex.email.test(result[i])) {
                    return false;
                }
            }

            return true;
        },

        min_length: function(form,field, length) {
            if (!regex.numeric.test(length)) {
                return false;
            }

            return (field.value.length >= parseInt(length, 10));
        },

        max_length: function(form,field, length) {
            if (!regex.numeric.test(length)) {
                return false;
            }

            return (field.value.length <= parseInt(length, 10));
        },

        exact_length: function(form,field, length) {
            if (!regex.numeric.test(length)) {
                return false;
            }

            return (field.value.length === parseInt(length, 10));
        },

        greater_than: function(form,field, param) {
            if (!regex.decimal.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) > parseFloat(param));
        },

        less_than: function(form,field, param) {
            if (!regex.decimal.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) < parseFloat(param));
        },

        alpha: function(form,field) {
            return (regex.alpha.test(field.value));
        },

        alpha_numeric: function(form,field) {
            return (regex.alphaNumeric.test(field.value));
        },

        alpha_dash: function(form,field) {
            return (regex.alphaDash.test(field.value));
        },

        alpha_space: function(form,field) {
            return (regex.alphaSpace.test(field.value));
        },

        numeric: function(form,field) {
            return (regex.numeric.test(field.value));
        },

        integer: function(form,field) {
            return (regex.integer.test(field.value));
        },

        decimal: function(form,field) {
            return (regex.decimal.test(field.value));
        },

        is_natural: function(form,field) {
            return (regex.natural.test(field.value));
        },

        is_natural_no_zero: function(form,field) {
            return (regex.naturalNoZero.test(field.value));
        },

        valid_ip: function(form,field) {
            return (regex.ip.test(field.value));
        },

        valid_base64: function(form,field) {
            return (regex.base64.test(field.value));
        },

        valid_url: function(form,field) {
            return (regex.url.test(field.value));
        },

        valid_file: function(form, field) {
            return (regex.file.test(field.value));
        },

        valid_folder: function(form, field) {
            return (regex.folder.test(field.value));
        },

        valid_fullname: function(form, field) {
            return (regex.fullName.test(field.value));
        },

        valid_credit_card: function(form,field){
            // Luhn Check Code from https://gist.github.com/4075533
            // accept only digits, dashes or spaces
            if (!regex.numericDash.test(field.value)) return false;

            // The Luhn Algorithm. It's so pretty.
            var nCheck = 0, nDigit = 0, bEven = false;
            var strippedField = field.value.replace(/\D/g, "");

            for (var n = strippedField.length - 1; n >= 0; n--) {
                var cDigit = strippedField.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) nDigit -= 9;
                }

                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        },

        is_file_type: function(form,field,type) {
            if (field.type !== 'file') {
                return true;
            }

            var ext = field.value.substr((field.value.lastIndexOf('.') + 1)),
                typeArray = type.split(','),
                inArray = false,
                i = 0,
                len = typeArray.length;

            for (i; i < len; i++) {
                if (ext == typeArray[i]) inArray = true;
            }

            return inArray;
        }
    };

    window.FormValidator = FormValidator;

})(window, document);
