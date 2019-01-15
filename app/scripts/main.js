//
// Mobile menu opener
//

var menuBtn = document.querySelector('.header__menu-btn');
var menuBtnIsOpen = false;
var navPopup = document.querySelector('.header__nav');
var navLinks = document.querySelectorAll('.header__nav-link');
var hideAfterNavLinkClick = false;

menuBtn.addEventListener('click', toggleMenu);

navLinks.forEach(function (link) {
  link.addEventListener('click', toggleMenu);
});

function toggleMenu() {
  menuBtn.classList.toggle('open');
  navPopup.classList.toggle('open');
  hideAfterNavLinkClick = true;

  setTimeout(function () {
    hideAfterNavLinkClick = false;
  }, 1100)

  if (isMobileMenuOpen) {
    header.classList.remove("header--sticky-show");
  }

  isMobileMenuOpen = !isMobileMenuOpen;
}

//
// Sticky header
//

var header = document.querySelector('.header');
var firstHeaderLoad = true;
var isMobileMenuOpen = false;
var heroTop = document.querySelector('.hero').getBoundingClientRect().top;

header.style.opacity = 0;

function stickyHeader(e) {
  var isScrollDown = this.oldScroll > this.scrollY;
  heroTop = document.querySelector('.hero').getBoundingClientRect().top

  if (heroTop <= 0) {
    if (isScrollDown || firstHeaderLoad) {
      firstHeaderLoad = false;
      header.classList.add("header--sticky");
    }
  } else {
    header.classList.remove("header--sticky");
  }

  if (heroTop === 0) {
    header.classList.add("header--sticky-show");
    header.classList.remove("header--color");
    header.style.opacity = 1;
  } else {
    setTimeout(function () {
      if (heroTop === 0) return;
      header.classList.add("header--color");
    }, 300)
    if (isScrollDown) {
      if (hideAfterNavLinkClick) return;
      header.classList.add("header--sticky-show");
    } else {
      if (!isMobileMenuOpen) {
        header.classList.remove("header--sticky-show");
      }
    }
  }

  this.oldScroll = this.scrollY;
}

setTimeout(function () {
  header.style.opacity = 1;
}, 500)

stickyHeader();

window.addEventListener("scroll", stickyHeader);


//
// Slider
//
var slider;

window.addEventListener('load', function () {
  slider = new Glider(document.querySelector('.advantages__slider'), {
    dots: '.advantages__slider-dots',
    rewind: true,
    arrows: {
      prev: '.advantages__slider-prev',
      next: '.advantages__slider-next'
    }
  });

  var hammertime = new Hammer(document.querySelector('.advantages'), {});

  hammertime.on('swipe', function (ev) {
    if (ev.velocity > 0) {
      to = slider.slide != 0 ? slider.slide - 1 : 5;
    } else {
      to = slider.slide != 5 ? slider.slide + 1 : 0;
    }

    slider.scrollItem(to);
  });

  setInterval(function () {
    slider.updateControls();
  }, 280)

  var hoverOnSlider = false;

  document.querySelector('.advantages__container').addEventListener('mouseover', function () {
    hoverOnSlider = true;
  });

  document.querySelector('.advantages__container').addEventListener('mouseout', function () {
    hoverOnSlider = false;
  });

  setInterval(function () {
    if (hoverOnSlider) return;
    to = slider.slide != 5 ? slider.slide + 1 : 0;
    slider.scrollItem(to);
  }, 3000)

  document.body.classList.add('load');
});


//
// Form handler
//

var tryForm = document.querySelector('.try__block-form');
formHandler(tryForm);

function formHandler(form, type) {
  var inputs = form.querySelectorAll('input');

  inputs.forEach(function (input) {
    input.setAttribute('data-placeholder', input.getAttribute('placeholder'));

    input.addEventListener('focus', function () {
      form.classList.remove('error');
      input.setAttribute('placeholder', input.getAttribute('data-placeholder'));
      input.parentNode.classList.remove('error');
      input.classList.remove('error');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = [];
    var error = false;

    inputs.forEach(function (input) {
      var name = input.getAttribute('name');
      var value = input.value;

      if (name === 'email' && !validateEmail(value)) {
        value = '';
      }

      if (value === '') {
        error = true;
        form.classList.add('error');
        input.value = '';
        input.setAttribute('placeholder', input.getAttribute('data-error'));
        input.parentNode.classList.add('error');
        input.classList.add('error');
      } else {
        data.push({
          name: name,
          value: value
        });
      }
    });

    if (error) return;

    if (type === 'form-success') {
      showModalSuccess()
    }

    //console.log("submit", data);
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//
// Init gumshoe
//

gumshoe.init({
  activeClass: 'active',
  selector: '.header nav a',
  // selectorHeader: '.header',
  scrollDelay: 1200
});


//
// Init smoth scroll
//

var scroll = new SmoothScroll('.scroll-to[href*="#"]', {
  // header: '.header',
  speed: 1100,
  updateURL: false
});


//
// Modals
//

var modalBtns = document.querySelectorAll('[data-modal]')
var modal;
var modalContentForm = document.getElementById('modal-form').innerHTML;
var modalContentFormFailed = document.getElementById('modal-form-failed').innerHTML;

modalBtns.forEach(function (btn) {
  btn.addEventListener('click', showModal);
});

function showModal(e, type) {
  var type = type === undefined ? e.target.getAttribute('data-modal') !== null ? e.target.getAttribute('data-modal') : e.target.parentNode.getAttribute('data-modal') : type;
  var style = type === 'video' ? ['tingle-video'] : [];

  if (heroTop != 0) {
    header.style.opacity = 0;
  }

  modal = new tingle.modal({
    closeLabel: '',
    cssClass: style,
    onClose: function () {
      modal.destroy();

      setTimeout(function () {
        header.style.opacity = 1;
      }, 100)
    }
  });

  if (type === 'video') {
    modal.setContent('<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>');
  }

  if (type.indexOf('form') != -1) {
    modal.setContent(modalContentForm);
    var current = document.querySelector('.tingle-modal');
    var title = e.target.getAttribute('data-modal-title');
    var titleSuccess = e.target.getAttribute('data-success-title');
    current.querySelector('.modal__title').innerHTML = title;
    document.querySelector('#modal-form-success .modal__title').innerHTML = titleSuccess;
    formHandler(current.querySelector('.modal__form'), 'form-success');
  }

  modal.open();
}

function showModalSuccess() {
  var modalContentFormSuccess = document.getElementById('modal-form-success').innerHTML;
  modal.setContent(modalContentFormSuccess);
}

function showModalFailed() {
  modal.setContent(modalContentFormFailed);
}