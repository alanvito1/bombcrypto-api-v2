import axios, {AxiosResponse} from "axios";

export async function sendGetRequest<T>(url: string, withCredentials: boolean): Promise<T | null> {
    const isSecure = window.location.protocol === 'https:';
    try {
        const axiosResponse = await axios.get(url, {withCredentials: isSecure ? withCredentials : false});

        const response = parseApiResponseData(axiosResponse);
        if (!response.success) {
            return null;
        }

        // Handle case where message is a string that needs parsing
        if (typeof response.message === 'string') {
            try {
                return JSON.parse(response.message) as T;
            } catch (e) {
                return response.message as unknown as T;
            }
        }

        return response.message as T;
    } catch (e) {
        return null;
    }
}

function parseApiResponseData(response: AxiosResponse) {
    return response.data as IApiResponseData;
}

interface IApiResponseData {
    success: boolean,
    error: string,
    message: any
}