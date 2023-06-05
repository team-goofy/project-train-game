import { HttpParams } from '@angular/common/http';

interface Params {
    [key: string]: any;
}
  
/**
 * Sets the passed in params into the HttpParams object, especially usefull for avoiding 'undefined' params 
 * when working with optional query parameters. 
 * 
 * @param params - An object containing the parameters to set in the HttpParams object.
 * @returns An instance of HttpParams with the passed in parameters set.
 */
export function createHttpParams(params: Params): HttpParams {
    let httpParams: HttpParams = new HttpParams();

    Object.keys(params).forEach((param: string) => {
        if (params[param]) {
            httpParams = httpParams.set(param, params[param]);
        }
    });

    return httpParams;
}