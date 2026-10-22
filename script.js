(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  var form = document.getElementById('work-order-form');
  var status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var invalid = false;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('field-error');
          invalid = true;
        } else {
          field.classList.remove('field-error');
        }
      });

      if (invalid) {
        status.textContent = 'Please complete all required fields.';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Submitting...';

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            status.textContent = 'Work order received. We will be in touch shortly.';
            form.reset();
          } else {
            status.textContent = 'Something went wrong. Please try again or contact us directly.';
          }
        })
        .catch(function () {
          status.textContent = 'Network error. Please try again later.';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
}());
