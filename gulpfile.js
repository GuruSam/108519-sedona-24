import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import del from 'del';
import svgmin from 'gulp-svgmin'
import svgSprite from 'gulp-svg-sprite';
import rename from 'gulp-rename';
import squoosh from 'gulp-libsquoosh';
import cleanCSS from 'gulp-clean-css';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(cleanCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Copy untouched source files

const copySource = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
}

// JS

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(gulp.dest('build/js'));
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Images

const copyImg = () => {
  return gulp.src('source/img/**/*.jpg')
    .pipe(gulp.dest('build/img'));
}

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

export const createWebp = () => {
  return gulp.src('source/img/**/*.jpg')
    .pipe(squoosh({
      webp: {
        quality: 95
      }
    }))
    .pipe(gulp.dest('build/img'));
}

// Optimize svg and create sprite

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgSprite({
      mode: {
        stack: true
      }
     }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const reload = (done) => {
  browser.reload();
  done();
}

const cleanBuild = () => {
  return del('build');
}


// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/js/*.js', gulp.series(scripts));
}


export default gulp.series(
  cleanBuild,
  gulp.parallel(
    styles,
    html,
    scripts,
    copySource,
    copyImg,
    svg,
    sprite,
    createWebp
  ),
  server,
  watcher
);

export const build = gulp.series(
  cleanBuild,
  gulp.parallel(
    styles,
    html,
    scripts,
    copySource,
    optimizeImages,
    svg,
    sprite,
    createWebp
  )
);
