export default{
    socketUrl: 'http://localhost:3030', // socket路径
    baseUrl: 'http://localhost:3000',   // 服务器路径
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {},
    timeout: 10000,
    withCredentials: true,
    responseType: 'json'
}