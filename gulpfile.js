const gulp = require("gulp"),
    { src, dest, watch, series } = gulp,
    imagemin = require("gulp-imagemin"),
    htmlmin = require("gulp-htmlmin"),
    gulpSass = require("gulp-sass"),
    terser = require("gulp-terser"),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create(),
    sassModule = require("sass"),
    sass = gulpSass(sassModule);

const PORT = 80,
    PATH = "YOURPATH";

function hypertxtTsk(cb) {
    return src(["./src/*.html", "./src/*.php"])
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/],
            })
        )
        .pipe(dest("./dist/"))
        .pipe(browserSync.stream());
    cb();
}

function styleTsk(cb) {
    return src(
            [
                "./src/**/**/prod_**.scss",
                "./src/**/**/prod_**.sass",
                "./src/**/**/prod_**.css",
            ], {
                sourcemaps: true,
            }
        )
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(
            rename(opt => {
                opt.basename = opt.basename.replace("prod_", "");
            })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./dist/", { sourcemaps: "." }))
        .pipe(browserSync.stream());
    cb();
}

function imageTsk(cb) {
    return (
        src("./src/assets/**/*.{jpg,jpeg,png,gif,svg,ico}")
        .pipe(imagemin({ interlaced: true }))
        .pipe(dest("./dist/assets/")) &&
        src("./src/assets/**/*.{mp4,webm}").pipe(dest("./dist/assets/"))
    );
    cb();
}

function assetsTsk(cb) {
    return src("./src/assets/**/*.{eot,svg,ttf,woff,woff2}").pipe(
        dest("./dist/assets/")
    );
    cb();
}

function scriptsTsk(cb) {
    return (
        src("./src/**/libs/**.{mjs,js}", { sourcemaps: true })
        .pipe(
            terser({
                toplevel: false,
                keep_fnames: true,
            })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./dist/", { sourcemaps: "." }))
        .pipe(browserSync.stream()) &&
        src("./src/**/prod_**.js", { sourcemaps: false })
        .pipe(
            rename(opt => {
                opt.basename = opt.basename.replace("prod_", "");
            })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./dist/", { sourcemaps: "." }))
        .pipe(browserSync.stream())
    );
    cb();
}

function loadTsk(cb) {
    browserSync.init({
        proxy: `localhost:${PORT}/${PATH}/dist/`,
        notify: false,
        watch: true,
    });
    cb();
}

function reloadTsk(cb) {
    browserSync.reload();
    cb();
}

function watchTsk(cb) {
    watch(["./src/*.html", "./src/*.php"]).on(
        "change",
        series(hypertxtTsk, reloadTsk)
    );

    watch(["./src/**/**/*.sass", "./src/**/**/*.scss", "./src/**/**/*.css"]).on(
        "change",
        series(styleTsk, reloadTsk)
    );

    watch(["./src/**/*.js"]).on("change", series(scriptsTsk, reloadTsk));

    cb();
}

exports.hypertextTask = hypertxtTsk;
exports.styleTask = styleTsk;
exports.imageTask = imageTsk;
exports.assetsTask = assetsTsk;
exports.scriptsTask = scriptsTsk;
exports.loadTask = loadTsk;
exports.reloadTask = reloadTsk;
exports.watchTask = watchTsk;

exports.default = series(
    hypertxtTsk,
    styleTsk,
    imageTsk,
    assetsTsk,
    scriptsTsk,
    watchTsk,
    loadTsk
);