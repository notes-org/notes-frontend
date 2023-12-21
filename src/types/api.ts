/**
 * Typings corresponding to the API
 * see http://127.0.0.1:8000/docs or http://127.0.0.1:8000/redoc
 */
export namespace api {

    /** Note type in the context of a GET request */
    export type Note = {
        /** LexicalComposer's state JSON string */
        content: string;
        created_at: string;
    }

    /** Note type in the context of a POST request */
    export type NotePOST = Pick<Note, 'content'>;

    export type Resource = {
        
        // Frontend only, to protect resource from changes
        locked?: true;

        url: string;
        url_hash: string;
        tld: string;
        title: string,
        description: string;
        image_url: string;
        favicon_url: string;
        site_name: string;
        notes: Array<Note>;
    }

    /** Generic error response type */
    export type ErrorResponse<T = string> = {
        detail: T;
    }

    type ValidationErrorItem = {
        loc: [
            string,
            0
        ];
        msg: string;
        type: string;
    };

    export type ValidationError = ErrorResponse<ValidationErrorItem[]>;
}