class ProductUtil {

    constructor() {

    }

 populateError(statusCode, message, errorDetails) {

        const productError = {
        statusCode: statusCode,
        message: message,
        details: errorDetails,
        date: new Date()
        }
    
        return productError;
    }
}

module.exports = new ProductUtil();