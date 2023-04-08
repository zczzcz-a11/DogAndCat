import OSS from "ali-oss";
import { Toast } from 'vant';

export const dataURItoBlob = (dataURI) => { // base64转 blob
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    const mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
}

export const uploadfile = (config, file) => { // 使用 OSS签名，通过 FormData 提交实现图片上传
    return new Promise((resolve, reject) => {
        const param = new FormData();
        const { OSSAccessKeyId, dirPath, host, key, policy, signature, success_action_status } = config;

        const objectKey = `${key}.${file.type.split('/').pop()}`;

        param.append('OSSAccessKeyId', OSSAccessKeyId);
        param.append('policy', policy);
        param.append('signature', signature);
        param.append('key', dirPath + objectKey);
        param.append('success_action_status', success_action_status);
        param.append('file', file, objectKey);

        const xhr = new XMLHttpRequest();
        xhr.open('post', host, true);
    
        xhr.addEventListener('load', (e) => {
            if (e.target.status !== 200) {
                Toast.fail('图片上传失败!');
                reject(res);
                return;
            }
            if (e.target.status === 200) {
                Toast.success('图片上传成功!');
                resolve(host + '/' + dirPath + objectKey);
            }
        }, false);
        xhr.send(param);
    })
}