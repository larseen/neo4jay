/**
 * ValidationError extends Error
 * @module error
 * @example
 * throw new ValidationError(error);
 */
export class ValidationError extends Error {
    name = 'ValidationError';
    status = 400;
    /**
    * ValidationError constructor.
    * @param {object} error - The error to be thrown.
    */
    constructor(error) {
        super(error.message);
        this.payload = {
            ...error,
            name: this.name
        };
    }
}

/**
 * NotFoundError extends Error
 * @module error
 * @example
 * throw new NotFoundError('User');
 */
export class NotFoundError extends Error {
    name = 'NotFoundError'
    message = 'Could not find the entity';
    status = 404;

    /**
    * NotFoundError constructor.
    * @param {string} entity - The name of the entity that could not be found.
    */
    constructor(entity) {
        super( 'Could not find the requested '+entity );
        this.message =  'Could not find the requested '+entity;
    }
}
