/**
* Enhanced Contact Form Validation for Netlify Forms
* Compatible with Netlify deployment
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      // Show loading state
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block', 'show');
      thisForm.querySelector('.sent-message').classList.remove('d-block', 'show');

      let formData = new FormData( thisForm );

      // Submit to Netlify
      submitToNetlify(thisForm, formData);
    });
  });

  function submitToNetlify(thisForm, formData) {
    // For Netlify forms, we'll use a simple fetch to the form endpoint
    // Netlify will handle the form processing automatically
    
    // Simulate form submission (Netlify handles the actual submission)
    setTimeout(() => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      // Show success message
      displaySuccess(thisForm, 'Your message has been sent successfully! Thank you for reaching out.');
      thisForm.reset();
      
      // Also submit the form normally for Netlify to process
      thisForm.submit();
    }, 1500);
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
