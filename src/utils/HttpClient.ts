import { BACKEND_URL } from "../config";


export class HttpClientError extends Error {
  reason: any;
  constructor(message: string, reason: any) {
    super(message);
    this.reason = reason;
  }
}

type Success<T> = {
  ok: true,
  status: number,
  body: T,
}

type Failure = {
  ok: false,
  status: number,
  body: any,
}

export type HttpClientResponse<T> = Success<T> | Failure;

export namespace HttpClient {

  /**
   * Requests a URL for the API backend, returning a promise
   *
   * @param  {string} path      The path of the URL
   * @param  {object} [options] The options we want to pass to "fetch"
   *
   * @return {object}           The response data
   */
  export async function requestAPI<T>(
    method: 'GET' | 'POST',
    path: string,
    body: BodyInit | null = null,
    headers: HeadersInit = [["Content-Type", "application/json"]]
    // options?: RequestInit,
  ): Promise<HttpClientResponse<T>> {

    const options = {
      method: method,
      headers: headers,
      body: body,
    };

    // Get response from fetch
    let response: Response;
    try {
      response = await fetch(`${BACKEND_URL}${path}`, options);
    } catch (error: any) {
      throw new HttpClientError('Network error', error);
    }

    // TODO: check response.ok

    // Convert response body to JS object
    let body_as_object: unknown;
    try {
      body_as_object = await response.json();
    } catch (error) {
      throw new HttpClientError('Parsing error', error);
    }

    const result: HttpClientResponse<T> = {
      ok: response.ok,
      status: response.status,    
      body: body_as_object as T // TODO: perform schema validation checks to ensure body_as_object matches with T
    };
    return result; 
  }
}
