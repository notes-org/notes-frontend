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
    description: "This resource does not exist",
    image_url: "public/not-found.png",
    favicon_url: "...",
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
    title: "...",
    description: "...",
    image_url: "...",
    favicon_url: "...",
    site_name: "...",
    notes: []
}