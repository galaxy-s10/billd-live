export const initAdsbygoogle = () => {
  try {
    // @ts-ignore
    if (!window.adsbygoogle) {
      // @ts-ignore
      window.adsbygoogle = [];
    }
    // @ts-ignore
    window.adsbygoogle.push({});
  } catch (error) {
    console.error('initAdsbygoogle错误');
    console.log(error);
  }
};
