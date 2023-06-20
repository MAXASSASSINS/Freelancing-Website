import axios from 'axios';

export const fetchData = async (url, method, body, config) => {
    try {
        const data = await axios({
            url,
            method,
            data: body,
        }, config)
        return data;

    } catch (error) {
        console.log(error);
    }

}