var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    cssnano     = require('gulp-cssnano'),
    uncss = require('gulp-uncss'),
    rename      = require('gulp-rename'), 
    del         = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    webpack = require('webpack-stream');

gulp.task('webpack', function() {
    return gulp.src('src/js/app.js')
        .pipe(webpack({
            output: {
                filename: 'bundle.js'
            }
        }))
    .pipe(gulp.dest('src/js/'));
});


gulp.task('uncss', function(){ 
    return gulp.src('src/less/components/grid-bootstrap.less')
        .pipe(uncss({
            html: ['src/*.html']
        }))
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest('src/less/components'))
});

gulp.task('less', function(){
    return gulp.src('src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('default', ['browser-sync', 'less'], function() {
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});


gulp.task('clean', function() {
    return del.sync('build');
});



gulp.task('css-cool', ['less'], function() {
    return gulp.src('src/css/style.css')
        //.pipe(uncss({ html: ['app/*.html'] })) //выкидывает ненужные стили, с js плохо дружит
        .pipe(autoprefixer(['last 15 versions', "> 1%", "ie 10", "ie 9", "ie 8"], { cascade: true })) // Создаем префиксы
        .pipe(csscomb()) 
        //.pipe(gulp.dest('dist/css')) //выгружаем  в папку app/css
        .pipe(cssnano())
        //.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('build/css'))
});


gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({  // Сжимаем с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('build/img'));
});

gulp.task('build', ['clean', 'css-cool', 'img'], function() {

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))

    var buildLib = gulp.src('src/lib/**/*')
    .pipe(gulp.dest('build/lib'))

    var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('build/js'))

    var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('build'));

});