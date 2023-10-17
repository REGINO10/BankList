'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const showModal = document.querySelectorAll('.btn--show-modal');
const closeModal = document.querySelector('.btn--close-modal');
const buttonScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const removeHref = document.querySelector('.nav__link--btn');
const nav = document.querySelector('.nav');
const navOptions = document.querySelectorAll('.nav__link');
const tabbedContainer = document.querySelector('.operations__tab-container');
const tabbedContainerButtons = document.querySelectorAll('.operations__tab');
const tabbedContents = document.querySelectorAll('.operations__content');
const navLogo = document.querySelector('.nav__logo');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('.features__img');
const sliders = document.querySelectorAll('.slide');
const sliderRight = document.querySelector('.slider__btn--right');
const sliderLeft = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

//Modal window
const modalOverlayClose = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const modalOverlayAdd = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

showModal.forEach(ele => {
  ele.addEventListener('click', modalOverlayAdd);
});

closeModal.addEventListener('click', modalOverlayClose);

overlay.addEventListener('click', modalOverlayClose);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modalOverlayClose();
  }
});

//Button scroll
buttonScroll.addEventListener('click', () => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//Page navigation
nav.addEventListener('click', e => {
  if (e.target.classList.contains('nav__link')) {
    navOptions.forEach(ele => {
      if (ele === e.target) {
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }
});

//Tabbed components
tabbedContainer.addEventListener('click', e => {
  const targetElement = e.target.closest('.operations__tab');
  if (targetElement) {
    tabbedContainerButtons.forEach(ele => {
      if (ele.classList.contains('operations__tab--active')) {
        ele.classList.remove('operations__tab--active');
      }
    });

    tabbedContents.forEach(ele => {
      if (ele.classList.contains('operations__content--active')) {
        ele.classList.remove('operations__content--active');
      }
    });

    targetElement.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${targetElement.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

//Menu fade animation
const fade = function (e) {
  if (e.target.classList.contains('nav__link')) {
    navOptions.forEach(ele => {
      if (ele !== e.target) {
        ele.style.opacity = this;
      }
    });
    navLogo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', fade.bind(0.5));

nav.addEventListener('mouseout', fade.bind(1));

//Sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyFunc = entries => {
  const [entry] = entries;
  if (entry.isIntersecting === false) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const stickyObserver = new IntersectionObserver(stickyFunc, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

stickyObserver.observe(header);

//Reveal section
const revealFunc = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting === false) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealFunc, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//Lazy loading images
const imageLoadFunc = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting === false) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};

const imageObserver = new IntersectionObserver(imageLoadFunc, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(image => {
  imageObserver.observe(image);
});

//slider
const slider = () => {
  let currentSlide = 0;

  const slideMove = move => {
    sliders.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - move) * 100}%)`;
    });
  };

  const createDots = () => {
    sliders.forEach((_, i) => {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = ${i}></button>`
      );
    });
  };

  const dotActive = currentSlide => {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const initSlide = () => {
    slideMove(currentSlide);
    createDots();
    dotActive(currentSlide);
  };
  initSlide();

  const rightMove = () => {
    if (currentSlide === sliders.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    slideMove(currentSlide);
    dotActive(currentSlide);
  };

  const leftMove = () => {
    if (currentSlide === 0) {
      currentSlide = sliders.length - 1;
    } else {
      currentSlide--;
    }
    slideMove(currentSlide);
    dotActive(currentSlide);
  };

  sliderRight.addEventListener('click', rightMove);
  sliderLeft.addEventListener('click', leftMove);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowRight' && rightMove();
    e.key === 'ArrowLeft' && leftMove();
  });

  dots.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      currentSlide = Number(e.target.dataset.slide);
      slideMove(e.target.dataset.slide);
      dotActive(e.target.dataset.slide);
    }
  });
};
slider();

