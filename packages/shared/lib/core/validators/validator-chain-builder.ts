import { Validators } from './validator'

export class ValidatorChainBuilder {
    first: Validators
    last: Validators

    /**
     * Adds a new validation to the validation chain
     *
     * @method add
     *
     * @param {Validators} validator
     *
     * @returns {ValidatorChainBuilder}
     */
    add(validator: Validators): ValidatorChainBuilder {
        if (!this.first) {
            this.first = validator
            this.last = validator
        } else {
            this.last.setNextValidator(validator)
            this.last = validator
        }

        return this
    }

    /**
     * Gets first validator in chain
     *
     * @method getFirst
     *
     * @returns {Validators}
     */
    getFirst(): Validators {
        return this.first
    }
}
