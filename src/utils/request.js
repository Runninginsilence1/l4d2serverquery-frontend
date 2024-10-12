import axios from "axios";

// const baseUrl = 'https://localhost:44316';
const baseUrl = 'http://121.37.157.126:5000';

const myrequest = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    // headers: {'X-Custom-Header': 'foobar'} // 自定义请求头
});


export default myrequest;