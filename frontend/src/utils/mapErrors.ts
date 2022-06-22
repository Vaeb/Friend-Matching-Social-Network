import { Error } from '../generated/graphql';

export const mapErrors = (errors: Error[]) =>
    errors.reduce<Record<string, string>>((obj, err) => {
        obj[err.field] = err.message;
        return obj;
    }, {});
