---
sidebar: false
---

<ProDemoPlayer/>

> 注意：pro 试用开发包(1小时断开, 刷新页面继续测试)
>
> 注意：pro 试用开发包(1小时断开, 刷新页面继续测试)
>
> 注意：pro 试用开发包(1小时断开, 刷新页面继续测试)
>
> 如需要购买PRO版本可以联系添加作者微信：bosswancheng


> 完整离线包下载地址：[下载地址](https://jessibuca.com/pro.zip)
>
> 需要本地挂载在Nginx（或者自己搭建一个web-server服务）上面才能跑起来。

> Demo 列表
[Http](http://jessibuca.monibuca.com/pro/index.html)

[Https](https://jessibuca.com/pro/index.html)

- 支持15种格式：(live/test为streamPath)
1. ws(s)-raw 即ws://host-name:port/jessica/`live/test` (该协议只对接了[monibuca服务器](https://monibuca.com),其他服务器需要额外对接)
2. ws(s)-flv 即ws://host-name:port/jessica/`live/test`.flv（chrome下ip会报安全错误，建议域名形式访问，检查下端口范围chrome浏览器是否允许，chrome会默认禁用很多端口）
3. http(s)-flv 即http://host-name:port/hdl/`live/test`.flv
4. Hls 即http://host-name:port/hls/`live/test`.m3u8 (支持H264/H265)
5. WebTransport 即wt://host-name:port/play/`live/test` (该协议只对接了[monibuca服务器](https://monibuca.com),其他服务器需要额外对接)
6. Webrtc 即 webrtc://host-name:port/webrtc/play/`live/test` (支持H264/H265, 仅支持https://或者http://localhost环境)
7. Webrtc-zlmediakit 即 webrtc://host-name:port/index/api/webrtc?app=live&stream=`stream-name`&type=play  (支持H264, 仅支持https://或者http://localhost环境)
8. Webrtc-srs 即 webrtc://host-name:port/rtc/v1/play/`live/test`  (支持H264, 仅支持https://或者http://localhost环境)
9. Webrtc-others 即 webrtc://host-name:port/`live/test` (支持H264, 仅支持https://或者http://localhost环境)
10. http(s)-fmp4 即http://host-name:port/your-path/`live/test`.(f)mp4
11. ws(s)-fmp4 即ws://host-name:port/your-path/`live/test`.(f)mp4
12. http(s)-h264 即http://host-name:port/jessica/`live/test`.h264
13. ws(s)-h264 即ws://host-name:port/jessica/`live/test`.h264
14. http(s)-h265 即http://host-name:port/jessica/`live/test`.h265
15. ws(s)-h265 即ws://host-name:port/jessica/`live/test`.h265
16. ws(s)-mpeg4 即ws://host-name:port/your-path/`live/test`.mpeg4
- 注意http协议会有跨域问题，需要设置cors头
- 协议同时支持https、wss
- 同时支持H264和H265编码格式
- 支持webcodecs硬解码(H264+H265)和MSE硬解码(H264+H265)
- 支持HLS(H264+H265)软解码、硬解码
- 支持`m7s` webrtc(H264+H265(软解码、硬解码))，
- 支持`zlmediakit` webrtc(H264)
- 支持`srs` webrtc(H264)
- 支持`others` webrtc(H264)
- 支持加密流(国标SM4、m7s加密流)
- 支持裸流(H264+H265)
- 支持Fmp4格式(H264+H265)
- 支持mpeg4格式(H264)

<Rice/>


# Webcodecs H265硬解码

chrome 最新的107版本，支持Webcodecs加速解码H265。

> 需要https协议 ，请访问 https://jessibuca.com/player-pro.html 进行测试

# MSE H265硬解码

Windows系统下,360浏览器可播放使用MSE加速解码H265。

~~Windows系统下,win10商店购买hevc解码器后最新edge可硬件加速解码播放H265。~~
最新版本edge 已经支持。

mac系统下，chrome最新的104.0.5112.79及以后的版本

Windows系统下，chrome最新的104.x 版本以后的版本

> 注意要打开chrome的硬件加速功能才能生效。

- 使用360浏览器测试
- ~~使用win10商店购买hevc解码器后最新edge可硬件加速解码播放H265。~~ 最新版本edge 已经支持
- 使用 chrome canary ~~并开启 `--enable-features=PlatformHEVCDecoderSupport` 进行测试~~ 最新版本已经默认开启
- 使用 chrome（mac平台） ~~并开启`--enable-features=PlatformHEVCDecoderSupport` 进行测试~~ 最新版本已经默认开启
- 使用 chrome（windows） ~~并开启`-enable-features=PlatformHEVCDecoderSupport` 进行测试~~ 最新版本已经默认开启


## mac

### chrome canary
```shell
open /Applications/Google\ Chrome\ Canary.app --args --enable-features=PlatformHEVCDecoderSupport
```

### chrome
```shell
open /Applications/Google\ Chrome.app --args --enable-features=PlatformHEVCDecoderSupport
```


## window
通过配置启动项

```shell
-enable-features=PlatformHEVCDecoderSupport
```

# 支持H264(AVC)/H265(HEVC)裸流播放。

支持websocket协议的的H264(AVC)/H265(HEVC)裸流播放

> 如需要请联系作者定制开发



# 支持音视频流（TF卡流）的倍数播放。

- 支持TF卡流的倍数播放
- 支持自定义帧率(fps)
- 支持音频变速不变调
- 支持2/4/8/16/32/64倍数控制，支持设置多少倍之后只解码I帧播放
- 支持不断连接(websocket连接情况下)的情况下实现 暂停/播放，并且支持配置UI上面的暂停和播放方法使用这个方法。

> 如需要请联系作者定制开发

# 支持语音通讯
- 支持采集PCM/G711A/G711U格式的数据
- 支持采样率16000Hz或8000Hz
- 采样精度32bits或者16bits
- 支持单通道或双通道

> 如需要请联系作者定制开发

# 支持crypto解密播放
可以解码加密流数据。支持

> 如需要请联系作者定制开发

# 支持webrtc标准流播放
请使用 m7s 提供的webrtc 地址播放

> 如：webrtc://${hostName}${port}/webrtc/play/${streamPath}


# 支持WebTransport协议播放。
请使用 m7s 提供的WebTransport 地址播放

> 如：wt://${hostName}${wtPort}/play/${streamPath}



# 赞助作者

<img src="/public/wx.jpg"><img src="/public/alipay.jpg">

# 群
<img src="/public/qrcode.jpeg">


# 群
<img src="/public/qrcode-qw.jpeg">

## qq频道
<img src="/public/qq-qrcode.jpg">

