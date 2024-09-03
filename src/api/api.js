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

export const getImages = async()=>{
    try {
        const response = await Api.get('/images');
        console.log('response:',response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const uploadImages = async(body)=>{
    try {
        const response = await Api.post('/upload',body);
        console.log('response:',response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.data.message);
    }
}

export const updateImages = async(id,body)=>{
    try {
        const response = await Api.put(`/images/${id}`,body);
        console.log('response:',response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const deleteImages = async(id,body)=>{
    try {
        const response = await Api.delete(`/images/${id}`,body);
        console.log('response:',response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}



