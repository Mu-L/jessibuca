## PRO 版本支持的特性
- wasm解码模式下默认work线程中发起Http-Flv、WS请求，减少主线程往worker线程传递数据，提升性能
- 支持录制MP4格式(MPEG-4)的视频录制(H264,仅支持视频)
- 支持webrtc标准流播放
- 支持语音通讯
- 支持音视频流（TF卡流）的倍数播放
- 支持音视频流（TF卡流）的底部24小时进度条，并支持精度控制
- 支持Webtransport标准流播放
- 支持播放器自定义水印（图片或者文字）
- 支持截图加自定义水印（图片或者文字）
- 支持HLS H264直播流
- 支持直播流crypto解密播放
- 支持SIMD软解码加速
- 支持Windows系统下360浏览器可播放使用MSE加速解码H265
- 支持window系统下win10商店购买hevc解码器后最新edge可硬件加速解码播放H265

## wasm解码模式下默认work线程中发起Http-Flv、WS请求，减少主线程往worker线程传递数据，提升性能
wasm解码模式下默认work线程中发起Http-Flv、WS请求，减少主线程往worker线程传递数据，提升性能

## 支持录制MP4格式(MPEG-4)的视频录制(H264,仅支持视频)

### 目前存在的弊端
目前支持视频录制(WebM、MP4格式)，

- MP4格式支持在IOS VLC播放器显示时长播放
- Android VLC播放器无法显示时长播放
- PC VLC播放器可以播放


### 解决了啥问题

支持全PC IOS Android 默认浏览器打开。

## 支持webrtc标准流播放

### 目前存在的弊端
目前不管是http-flv 或者 websocket-flv协议 以及websocket-raw私有协议 都存在了部分延迟。

### 解决了啥问题

webrtc 超低延迟

## 支持语音通讯

- 支持采集PCM/G711A/G711U格式的数据、
- 支持采样率16000Hz或8000Hz，
- 采样精度32bits或者16bits，支持单通道或双通道

## 支持音视频流（TF卡流）的倍数播放

- 支持TF卡流的倍数播放
- 支持自定义帧率(fps)
- 支持音频变速不变调

## 支持音视频流（TF卡流）的底部24小时进度条，并支持精度控制

- 支持全屏模式下，可以查看进度条
- 支持全屏模式下，进度时间的点击交互

### 解决了啥问题

Audio Context的部分音频节点提供了playbackRate属性以实现倍速播放的功能，但是音频在倍速播放的同时，音频的音调（pitch）也同步地升高/降低。

## 支持Webtransport标准流播放

延时更低、可以秒开、弥补WebRTC不足。

## 支持播放器自定义水印

支持播放器播放过程中，显示水印，例如公司名称，公司logo等。

## 支持截图加自定义水印

支持调用截图接口的时候，添加自定义水印，例如公司名称，公司logo。

## 支持HLS H264直播流

支持播放HLS H264直播流内容


## 支持直播流crypto解密播放

支持直播流crypto解密播放

## 支持SIMD软解码加速

使用Chrome/Edge 91, Firefox89及之后正式提供的SIMD指令集加速解码, 在1080P以上分辨率带来100%-300%的性能提升 尤其在HEVC的解码上提升非常明显.

> Safari暂不支持

## 支持Windows系统下360浏览器可播放使用MSE加速解码H265

支持Windows系统下360浏览器可播放使用MSE加速解码H265

## 支持window系统下win10商店购买hevc解码器后最新edge可硬件加速解码播放H265

支持window系统下win10商店购买hevc解码器后最新edge可硬件加速解码播放H265

## 支持作者

<img src="/public/wx.jpg"><img src="/public/alipay.jpg">
