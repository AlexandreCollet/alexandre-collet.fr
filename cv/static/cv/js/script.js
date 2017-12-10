(function (windows, document, undefined){
    // Preload

    var body = document.getElementsByTagName('body')[0];
    body.removeClass('preload');

    /**
     * SKILLS BAR
     */

    //Fonctions
    var displaySkillsBar = function(){
        var skills_div = document.getElementById('skills');
        var scrollY    = window.scrollY;
        var offsetTop  = skills_div.offsetTop;
        if(!skills_displayed && (scrollY+window.innerHeight) > offsetTop && scrollY < offsetTop+skills_div.offsetHeight){
            skills_displayed = true;
            var bars = document.querySelectorAll('.bar');
            for(var i=0, l=bars.length; i<l; i++){
                bars[i].addClass('is-displayed');
            }
        }
    };
    // Variables
    var skills_displayed = false;
    //Evenements
    document.addEventListener('scroll',displaySkillsBar);
    window.addEventListener('resize',displaySkillsBar);
    // S'éxécute au lancement
    displaySkillsBar();

    /**
     * FORMULAIRE CONTACT
     */

    if(localStorage){

        var nameField    = document.getElementById('contact_form_full_name_field');
        var mailField    = document.getElementById('contact_form_email_field');
        var messageField = document.getElementById('contact_form_message_field');

        nameField.value    = localStorage.contactForm_name    || '';
        mailField.value    = localStorage.contactForm_mail    || '';
        messageField.value = localStorage.contactForm_message || '';

    }

    var contactFormUnlocker = new Unlocker(
        document.getElementById('contact_form_unlocker'),
        function(){
            document.getElementById('contact_form_submit').click();
        }
    );

    var contactFormValidator = new FormValidator(
        document.getElementById('contact_form'),
        [
            {
                name: 'full_name',
                rules: ['required', 'valid_fullname'],
                toggle: function(){
                    document.querySelector('label[for=contact_form_full_name_field]').toggleClass('isValid');
                },
                change: function(value){
                    if(!localStorage) return;
                    localStorage.setItem('contactForm_name',value);
                }
            },{
                name: 'email',
                rules: ['required', 'valid_email'],
                toggle: function(){
                    document.querySelector('label[for=contact_form_email_field]').toggleClass('isValid');
                },
                change: function(value){
                    if(!localStorage) return;
                    localStorage.setItem('contactForm_mail',value);
                }
            },{
                name: 'message',
                rules: ['required'],
                toggle: function(){
                    document.querySelector('label[for=contact_form_message_field]').toggleClass('isValid');
                },
                change: function(value){
                    if(!localStorage) return;
                    localStorage.setItem('contactForm_message',value);
                }
            }
        ],
        {
            submit: function(event,isValid){
                if(isValid){
                    var ajax = new AjaxForm(
                        document.getElementById('contact_form'),
                        {
                            success : function(response){
                                response = JSON.parse(response);
                                alert(response.message,response.type);
                                if(response.type === 'success'){
                                    document.getElementById('contact_form').reset();
                                    document.getElementById('contact_form_full_name_field').oninput();
                                    if(!localStorage) return;
                                    localStorage.removeItem('contactForm_name');
                                    localStorage.removeItem('contactForm_mail');
                                    localStorage.removeItem('contactForm_message');
                                }
                                contactFormUnlocker.reset();
                            }
                        }
                    );
                }

                event.preventDefault();
            },
            toggle: function(isValid){
                contactFormUnlocker.isActive = isValid;
            }
        }
    );

    /**
     * ARROW UP
     */

    var displayArrowUp = function(){

        var arrowUp_div    = document.getElementById('up');
        var scrollY        = window.scrollY;
        var offsetTop      = document.getElementsByTagName('header')[0].offsetHeight;
        var windowWidth    = window.innerWidth;
        var minWindowWidth = 1425;

        if(windowWidth >= minWindowWidth && scrollY > offsetTop && !arrowUp_div.hasClass('display')){
            arrowUp_div.addClass('display');
        }else if((scrollY < offsetTop || windowWidth < minWindowWidth) && arrowUp_div.hasClass('display')){
            arrowUp_div.removeClass('display');
        }
    };

    document.addEventListener('scroll', displayArrowUp);
    window.addEventListener('resize', displayArrowUp);

    displayArrowUp();

    /**
     * SCROLL
     */

    smoothScroll.init({
        selector: '.smoothScroll',
        speed: 1000
    });

    /**
     * REALISATION MODALS
     */

    var body = document.getElementsByTagName('body')[0];

    var realisation_buttons = document.querySelectorAll('.realisation');
    for(var j=0, le=realisation_buttons.length; j<le; j++){
        realisation_buttons[j].onclick = function(event){
            showModal(this.dataset.target);
        };
    }

    var close_modal_buttons = document.querySelectorAll('.md-close');
    for(var j=0, le=close_modal_buttons.length; j<le; j++){
        close_modal_buttons[j].onclick = function(event){
            hideModal();
        };
    }

    var overlay_div = document.getElementById("md-overlay");
    overlay_div.onclick = function (event) {
        hideModal();
    }

    function showModal(target){
        var modal = document.getElementById(target);
        modal.addClass('md-show');
        body.addClass('noScroll');
    };
    function hideModal(){
        var modal = document.querySelector('.md-modal.md-show');
        modal.removeClass('md-show');
        body.removeClass('noScroll');
    }

})(window, document);
