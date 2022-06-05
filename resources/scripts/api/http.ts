import axios, { AxiosInstance } from 'axios';
import { store } from '@/state';

const http: AxiosInstance = axios.create({
    withCredentials: true,
    timeout: 20000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(req => {
    if (!req.url?.endsWith('/resources')) {
        store.getActions().progress.startContinuous();
    }

    return req;
});

http.interceptors.response.use(resp => {
    if (!resp.request?.url?.endsWith('/resources')) {
        store.getActions().progress.setComplete();
    }

    return resp;
}, error => {
    store.getActions().progress.setComplete();

    throw error;
});

export default http;

/**
 * Converts an error into a human readable response. Mostly just a generic helper to
 * make sure we display the message from the server back to the user if we can.
 */
export function httpErrorToHuman (error: any): string {
    if (error.response && error.response.data) {
        let { data } = error.response;

        // Some non-JSON requests can still return the error as a JSON block. In those cases, attempt
        // to parse it into JSON so we can display an actual error.
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                // do nothing, bad json
            }
        }

        if (data.errors && data.errors[0] && data.errors[0].detail) {
            return data.errors[0].detail;
        }

        // Errors from wings directory, mostly just for file uploads.
        if (data.error && typeof data.error === 'string') {
            return data.error;
        }
    }

    return error.message;
}

export interface FractalResponseData {
    object: string;
    attributes: {
        [k: string]: any;
        relationships?: Record<string, FractalResponseData | FractalResponseList | null | undefined>;
    };
}

export interface FractalResponseList {
    object: 'list';
    data: FractalResponseData[];
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: PaginationDataSet;
}

interface PaginationDataSet {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
}

export function getPaginationSet (data: any): PaginationDataSet {
    return {
        total: data.total,
        count: data.count,
        perPage: data.per_page,
        currentPage: data.current_page,
        totalPages: data.total_pages,
    };
}
