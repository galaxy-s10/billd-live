```html
<!-- x-webkit-airplay这个属性应该是使此视频支持ios的AirPlay功能 -->
<!-- playsinline、 webkit-playsinline IOS微信浏览器支持小窗内播放 -->
<!-- x5-video-player-type 启用H5播放器，是wechat安卓版特性 -->
<!-- x5-video-player-fullscreen 全屏设置 -->
<!-- x5-video-orientation 声明播放器支持的方向，可选值landscape横屏，portraint竖屏。默认值portraint。 -->
<video
  autoplay
  webkit-playsinline="true"
  playsinline
  x-webkit-airplay="allow"
  x5-video-player-type="h5"
  x5-video-player-fullscreen="true"
  x5-video-orientation="portraint"
  muted
></video>
```
