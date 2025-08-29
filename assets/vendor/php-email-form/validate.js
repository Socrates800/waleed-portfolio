/**
* Enhanced Contact Form Validation - Custom Form Handler
* Prevents redirects and ensures proper form data capture
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
      thisForm.querySelector('.error-message')?.classList.remove('d-block', 'show');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block', 'show');
      thisForm.querySelector('.success-message')?.classList.remove('d-block', 'show');

      // Get form data
      let formData = new FormData( thisForm );
      
      // Convert FormData to URL-encoded string
      let urlEncodedData = new URLSearchParams(formData).toString();

      // Submit form data using fetch to prevent any redirects
      submitFormData(thisForm, urlEncodedData);
    });
  });

  function submitFormData(thisForm, formDataString) {
    // Submit to current page URL to trigger Netlify form processing
    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formDataString
    })
    .then(response => {
      // Hide loading
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      if (response.ok) {
        // Success - show message and reset form
        displaySuccess(thisForm, 'Your message has been sent successfully! Thank you for reaching out.');
        thisForm.reset();
        
        // Also trigger a background form submission for Netlify to capture
        // This ensures the data goes to your dashboard
        setTimeout(() => {
          submitToNetlifyBackground(thisForm);
        }, 100);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      // Error handling
      thisForm.querySelector('.loading').classList.remove('d-block');
      displayError(thisForm, 'Something went wrong. Please try again later.');
      console.error('Form submission error:', error);
    });
  }

  function submitToNetlifyBackground(thisForm) {
    // Create a hidden iframe to submit the form in the background
    // This ensures Netlify captures the form data without redirecting
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'netlify-form-submission';
    
    // Create a temporary form for background submission
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = window.location.href;
    tempForm.target = 'netlify-form-submission';
    tempForm.style.display = 'none';
    
    // Add form data
    const formData = new FormData(thisForm);
    for (let [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    }
    
    // Add the form name
    const formNameInput = document.createElement('input');
    formNameInput.type = 'hidden';
    formNameInput.name = 'form-name';
    formNameInput.value = thisForm.getAttribute('name');
    tempForm.appendChild(formNameInput);
    
    // Submit and clean up
    document.body.appendChild(iframe);
    document.body.appendChild(tempForm);
    tempForm.submit();
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      document.body.removeChild(tempForm);
    }, 2000);
  }

  function displaySuccess(thisForm, message) {
    // Try to find success message element (could be sent-message or success-message)
    const successElement = thisForm.querySelector('.sent-message') || thisForm.querySelector('.success-message');
    
    if (successElement) {
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
  }

  function displayError(thisForm, error) {
    const errorElement = thisForm.querySelector('.error-message');
    if (errorElement) {
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
  }

})();
