/**
* Enhanced Contact Form Validation for Formspree
* Compatible with Netlify deployment
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading state
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block', 'show');
      thisForm.querySelector('.sent-message').classList.remove('d-block', 'show');

      let formData = new FormData( thisForm );

      // Submit to Formspree
      submitToFormspree(thisForm, action, formData);
    });
  });

  function submitToFormspree(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if( response.ok ) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      if (data.ok) {
        // Formspree success response
        displaySuccess(thisForm, 'Your message has been sent successfully! Thank you for reaching out.');
        thisForm.reset(); 
      } else {
        // Formspree error response
        throw new Error(data.error || 'Form submission failed. Please try again.');
      }
    })
    .catch((error) => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      // Handle different types of errors
      let errorMessage = 'Something went wrong. Please try again later.';
      
      if (error.message.includes('HTTP 429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('HTTP 400')) {
        errorMessage = 'Please check your form inputs and try again.';
      } else if (error.message.includes('HTTP 500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      displayError(thisForm, errorMessage);
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
