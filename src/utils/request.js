import axios from "axios";

// const baseUrl = 'https://localhost:44316';
// const baseUrl = 'http://121.37.157.126:5000';
const baseUrl = import.meta.env.VITE_API_URL;

console.log("baseUrl:", baseUrl);

const myrequest = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    // headers: {'X-Custom-Header': 'foobar'} // 自定义请求头
    onUploadProgress: (e) => {
        setFileItem({ id, percent: e.progress * 100 })
      }
});


export default myrequest;