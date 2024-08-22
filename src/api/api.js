import Api from './axiosConfig';

export const signup = async(body)=>{
    try {
        const response = await Api.post('/signup',body);
        return response.data.data;
    } catch (error) {
         throw new Error(error.response.data.data.message);
    }
}

export const login = async(body)=>{
    try {
        const response = await Api.post('/login',body);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response.data.data.message);
    }
}