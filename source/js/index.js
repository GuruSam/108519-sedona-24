const navToggle = document.querySelector('.nav-toggle')
const mainNav = document.querySelector('.main-nav')

navToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('main-nav--closed')) {
    mainNav.classList.remove('main-nav--closed')
    navToggle.classList.add('nav-toggle--close')
  } else {
    mainNav.classList.add('main-nav--closed')
    navToggle.classList.remove('nav-toggle--close')
  }
})
