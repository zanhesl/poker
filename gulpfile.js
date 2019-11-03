const del = require(`del`);
const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const mqpacker = require(`css-mqpacker`);
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const svgstore = require(`gulp-svgstore`);
const tinypng = require(`gulp-tinypng-compress`);
const svgmin = require(`gulp-svgmin`);
const rollup = require(`gulp-better-rollup`);
const sourcemaps = require(`gulp-sourcemaps`);

gulp.task(`style`, () => {
  return gulp.src(`src/sass/style.scss`).
  pipe(plumber()).
  pipe(sass()).
  pipe(postcss([
    autoprefixer({}),
    mqpacker({
      sort: true
    })
  ])).
  pipe(gulp.dest(`./css`)).
  pipe(server.stream()).
  pipe(minify()).
  pipe(rename(`style.min.css`)).
  pipe(gulp.dest(`./css`));
});

gulp.task(`sprite`, function () {
  return gulp.src(`./img/**/*.svg`)
    .pipe(svgmin({
      plugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`./img`));
});

gulp.task(`scripts`, () => {
  return gulp.src(`src/js/main.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, `iife`))
    .pipe(sourcemaps.write(``))
    .pipe(gulp.dest(`./js`));
});

gulp.task(`copy-html`, () => {
  return gulp.src(`src/*.{html,ico}`).
  pipe(gulp.dest(`.`)).
  pipe(server.stream());
});

gulp.task(`copy-img`, () => {
  return gulp.src(`src/**/*.{jpg, svg, png, jpeg, gif}`).
  pipe(gulp.dest(`.`)).
  pipe(server.stream());
});

gulp.task(`copy-normalize`, () => {
  return gulp.src(`src/css/normalize.css`).
  pipe(gulp.dest(`./css`)).
  pipe(server.stream()).
  pipe(minify()).
  pipe(gulp.dest(`./css`))
});

gulp.task(`copy`, gulp.series(`copy-html`, `copy-normalize`, `copy-img`, `scripts`, `style`, () => {
  return gulp.src([
    `src/fonts/**/*.{woff,woff2}`,
    `src/img/**/*`
  ], {
    base: `src`
  }).
  pipe(gulp.dest(`.`));
}));

gulp.task(`tinypng`, gulp.series(() => {
  return gulp.src('./img/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: 'RsCZev1geyFwOKznstLNGmxugsTZZmG6',
      sigFile: 'src/img/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('./img'));
}));


gulp.task(`imagemin`, gulp.series(() => {
  return gulp.src(`./img/**/*.{jpg,png,jpeg,gif}`).
  pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.jpegtran({
      progressive: true
    })
  ])).
  pipe(gulp.dest(`./img`));
}));


gulp.task(`clean`, () => {
  return del([`css`, `fonts`, `img`, `js`, `*.html`]);
});

gulp.task(`reload`, (done) => {
  server.reload();
  done();
})

gulp.task(`js-watch`, gulp.series(`scripts`, (done) => {
  server.reload();
  done();
}));

gulp.task(`assemble`, gulp.series(`clean`, `copy`));

// imagemin/tinypng img compression

gulp.task(`build`, gulp.series(`assemble`, `imagemin`, `tinypng`, `sprite`));

gulp.task(`serve`, gulp.series(`build`, () => {
  server.init({
    server: `.`,
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(`src/sass/**/*.{scss,sass}`, gulp.series(`style`, `reload`));
  gulp.watch(`src/*.html`, gulp.series(`copy-html`, `reload`));
  gulp.watch(`src/js/**/*.js`, gulp.series(`js-watch`));
}));
