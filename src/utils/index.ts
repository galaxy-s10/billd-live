/** 模拟ajax请求 */
export const mockAjax = ({ flag = false, delay = 500 }) => {
  return new Promise<{ code: Number; data: { id: number }; msg: string }>(
    (resolve, rejected) => {
      setTimeout(() => {
        if (flag) {
          resolve({
            code: 200,
            data: {
              id: 1,
            },
            msg: '请求成功',
          });
        } else {
          rejected({
            code: 400,
            msg: '请求失败',
          });
        }
      }, delay);
    }
  );
};
