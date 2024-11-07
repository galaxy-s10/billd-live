import { getRandomString } from 'billd-utils';
import COS from 'cos-js-sdk-v5';

import { fetchGetPolicyByRes } from '@/api/other';
import { TENCENTCLOUD_COS } from '@/spec-config';
import { getHash } from '@/utils';

export const useUpload = async ({
  prefix,
  file,
  onProgress,
}: {
  prefix: string;
  file: File;
  onProgress?: any;
}) => {
  const { hash, ext } = await getHash(file);
  // 初始化实例
  const cos = new COS({
    // getAuthorization 必选参数
    async getAuthorization(_options, callback) {
      // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
      // 异步获取临时密钥
      // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
      // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
      // STS 详细文档指引看：https://www.tencentcloud.com/document/product/436/14048
      const data = await fetchGetPolicyByRes({ prefix });
      if (data.code == 200 && !data.data.err) {
        const { credentials, startTime, expiredTime } = data.data.credential;
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000000
        });
      }
    },
  });
  return new Promise<{
    flag: boolean;
    respBody?: any;
    respErr?: any;
    respInfo?: any;
    resultUrl?: string;
  }>((resolve) => {
    const cosKey = `${prefix}${hash}__${getRandomString(4)}.${ext}`;
    cos.uploadFile(
      {
        Bucket:
          TENCENTCLOUD_COS['res-1305322458']
            .Bucket /* 填写自己的 bucket，必须字段 */,
        Region:
          TENCENTCLOUD_COS['res-1305322458']
            .Region /* 存储桶所在地域，必须字段 */,
        Key: cosKey /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */,
        Body: file, // 上传文件对象
        SliceSize:
          1024 *
          1024 *
          5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
        onProgress(progressData) {
          onProgress({ percent: progressData.percent });
        },
      },
      function (err, data) {
        if (err) {
          console.log('上传失败', err);
          resolve({ flag: false, respErr: err });
        } else {
          console.log('上传成功', data);
          resolve({
            flag: true,
            resultUrl: `${TENCENTCLOUD_COS['res-1305322458'].url}/${cosKey}`,
          });
        }
      }
    );
  });
};
