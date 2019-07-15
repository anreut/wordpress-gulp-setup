import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import uglify from 'rollup-plugin-uglify-es';
import rollup from 'gulp-rollup';
import resolve from 'rollup-plugin-node-resolve';
import browserSync from 'browser-sync';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;

const paths = {
    styles: {
        src: ['./src/sass/bundle.scss', './src/sass/admin.scss'],
        dest: './dest/css'
    },
    images: {
        src: './src/images/**/*.{jpeg,jpg,png,svg,gif}',
        dest: './dest/images'
    },
    scripts: {
        src: ['./src/js/bundle.js', './src/js/customizer.js'],
        dest: './dest/js'
    },
    other: {
        src: ['./src/**/*', '!./src/{images,js,sass}', '!./src/{images,js,sass}/**/*'],
        dest: './dest'
    }
};

export const serve = (done) => {
    server.init({
        proxy: 'http://localhost:8888/your-wordpress-theme/'
    });
    done();
};

export const reload = (done) => {
    server.reload();
    done();
};

export const clean = () => {
    return del(['./dest'], {force: true});
};

export const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(paths.styles.dest))
};

export const scripts = () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(rollup({
            allowRealFiles: true,
            format: 'iife',
            input: [paths.scripts.src],
            plugins: [
                resolve({
                    main: true,
                    browser: true
                }),
                uglify()
            ]
        }))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(paths.scripts.dest))
};

export const images = () => {
    return gulp.src(paths.images.src)
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(gulp.dest(paths.images.dest))
};

export const copy = () => {
    return gulp.src(paths.other.src)
        .pipe(gulp.dest(paths.other.dest))
};

export const watch = () => {
    gulp.watch('./src/sass/**/*.scss', gulp.series(styles, reload));
    gulp.watch(paths.images.src, gulp.series(images, reload));
    gulp.watch(paths.other.src, gulp.series(copy, reload));
    gulp.watch('./src/js/**/*.js', gulp.series(scripts, reload));
    gulp.watch('../**/*.php', reload)
};

export const dev = (done) => {
    return gulp.series(clean, gulp.parallel(styles, images, copy, scripts), serve, watch)(done);
};

export const build = (done) => {
    return gulp.series(clean, gulp.parallel(styles, images, copy, scripts))(done);
};

export default dev;
