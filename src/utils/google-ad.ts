export const initAdsbygoogle = () => {
  try {
    window.onload = () => {
      // @ts-ignore
      if (!window.adsbygoogle) {
        // @ts-ignore
        window.adsbygoogle = [];
      }
      // @ts-ignore
      // if (!window.adsbygoogle.loaded) {
      // @ts-ignore
      window.adsbygoogle?.push?.({});
      // }
    };

    // const adsenseUnitLength = document.getElementsByClassName('adsbygoogle');
    // for (let i = 0; i < adsenseUnitLength.length; i += 1) {
    //   // @ts-ignore
    //   if (window.adsbygoogle) {
    //     // @ts-ignore
    //     // if (!window.adsbygoogle.loaded) {
    //     // @ts-ignore
    //     (adsbygoogle = window.adsbygoogle || []).push({});
    //     // }
    //   }
    // }
  } catch (error) {
    console.error('initAdsbygoogle错误');
    console.log(error);
  }
};
