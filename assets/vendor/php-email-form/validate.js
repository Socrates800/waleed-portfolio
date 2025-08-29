/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block', 'show');
      thisForm.querySelector('.sent-message').classList.remove('d-block', 'show');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.json();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.success) {
        displaySuccess(thisForm, data.message || 'Your message has been sent. Thank you!');
        thisForm.reset(); 
      } else {
        throw new Error(data.error || 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displaySuccess(thisForm, message) {
    const successElement = thisForm.querySelector('.sent-message');
    successElement.innerHTML = message;
    successElement.classList.add('d-block');
    
    // Trigger reflow for smooth animation
    successElement.offsetHeight;
    
    // Add show class for animation
    successElement.classList.add('show');
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      successElement.classList.add('hiding');
      setTimeout(() => {
        successElement.classList.remove('d-block', 'show', 'hiding');
      }, 500);
    }, 5000);
  }

  function displayError(thisForm, error) {
    const errorElement = thisForm.querySelector('.error-message');
    errorElement.innerHTML = error;
    errorElement.classList.add('d-block');
    
    // Trigger reflow for smooth animation
    errorElement.offsetHeight;
    
    // Add show class for animation
    errorElement.classList.add('show');
    
    // Auto-dismiss after 8 seconds (longer for errors)
    setTimeout(() => {
      errorElement.classList.add('hiding');
      setTimeout(() => {
        errorElement.classList.remove('d-block', 'show', 'hiding');
      }, 500);
    }, 8000);
  }

})();
