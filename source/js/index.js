const navToggle = document.querySelector('.page-header__nav-toggle')
const mainNav = document.querySelector('.main-nav')

navToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('main-nav--closed')) {
    mainNav.classList.toggle('main-nav--closed')
    navToggle.classList.add('page-header__nav-toggle--close')
  } else {
    mainNav.classList.toggle('main-nav--closed')
    navToggle.classList.remove('page-header__nav-toggle--close')
  }
})
