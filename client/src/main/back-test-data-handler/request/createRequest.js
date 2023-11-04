const createRequest = ({obj}) => {
    const request = {};

    request.id = obj.id;
    request.data = obj.data;
    request.timestamp = obj.timestamp;    
    request.url = obj.url;

    return request;
}