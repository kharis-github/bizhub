// catchAsync - fungsi error-handling yang menjaga proses2 asynchronous
module.exports = function catchAsync(fn) {
    // return fungsi yang akan dieksekusi oleh Express
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}