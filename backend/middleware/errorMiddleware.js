
// to find all not found error for non existing paths
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    let message = err.message;

    // mongoose error for not founding 

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = "Not found "
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })




}
