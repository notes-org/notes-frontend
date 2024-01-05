import { api } from "../types/api"

/**
 * A Resource to return when no resource is found but a resource is expected.
 */
export const RESOURCE_NOT_FOUND: api.Resource = {

    locked: true,

    url: "...",
    url_hash: "...",
    tld: "...",
    title: "Resource not found",
    description: "This resource cannot be parsed or does not exist",
    favicon_url: "https://www.google.com/s2/favicons?domain=example.com",
    site_name: "...",
    notes: []
}

/**
 * A Resource to act like a null
 */
export const RESOURCE_PLACEHOLDER: api.Resource = {

    locked: true,

    url: "...",
    url_hash: "...",
    tld: "...",
    title: "Your source URL is empty",
    description: "Paste an URL in the field above.",
    favicon_url: "https://www.google.com/s2/favicons?domain=example.com",
    site_name: "...",
    notes: []
}