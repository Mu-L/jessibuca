import Emitter from "../utils/emitter";
import {
    closeVideoFrame,
    createContextGL,
    createEmptyImageBitmap,
    dataURLToFile,
    downloadImg,
    isMobile,
    now,
    supportOffscreen
} from "../utils";
import createWebGL from "../utils/webgl";
import {CANVAS_RENDER_TYPE, CONTROL_HEIGHT, EVENTS, SCREENSHOT_TYPE, VIDEO_ENC_TYPE} from "../constant";
import CommonLoader from "./commonLoader";
import saveAs from "../utils/file-save";

export default class CanvasVideoLoader extends CommonLoader {

    constructor(player) {
        super()
        this.player = player;
        const $canvasElement = document.createElement("canvas");
        $canvasElement.style.position = "absolute";
        $canvasElement.style.top = 0;
        $canvasElement.style.left = 0;
        this.$videoElement = $canvasElement;
        player.$container.appendChild(this.$videoElement);

        this.context2D = null;
        this.contextGl = null;
        this.contextGlRender = null;
        this.contextGlDestroy = null;
        this.bitmaprenderer = null;
        this.renderType = null;
        this.videoInfo = {
            width: '',
            height: '',
            encType: '',
        }
        //
        this._initCanvasRender();
        this.player.debug.log('CanvasVideo', 'init');
    }

    async destroy() {
        super.destroy();
        if (this.contextGl) {
            this.contextGl = null;
        }
        if (this.context2D) {
            this.context2D = null;
        }
        if (this.contextGlRender) {
            this.contextGlDestroy && this.contextGlDestroy();
            this.contextGlDestroy = null;
            this.contextGlRender = null;
        }
        if (this.bitmaprenderer) {
            this.bitmaprenderer = null;
        }

        this.renderType = null;

        this.player.debug.log(`CanvasVideoLoader`, 'destroy');
    }


    _initContextGl() {
        this.contextGl = createContextGL(this.$videoElement);
        if(this.contextGl){
            const webgl = createWebGL(this.contextGl, this.player._opt.openWebglAlignment);
            this.contextGlRender = webgl.render;
            this.contextGlDestroy = webgl.destroy
        }
        else {
            this.player.debug.error(`CanvasVideoLoader`, 'init webgl fail');
        }
    }

    _initContext2D() {
        this.context2D = this.$videoElement.getContext('2d');
    }


    // 渲染类型
    _initCanvasRender() {
        if (this.player._opt.useWCS && !this._supportOffscreen()) {
            this.renderType = CANVAS_RENDER_TYPE.webcodecs;
            this._initContext2D();
        } else if (this._supportOffscreen()) {
            this.renderType = CANVAS_RENDER_TYPE.offscreen;
            this._bindOffscreen();
        } else {
            this.renderType = CANVAS_RENDER_TYPE.webgl;
            this._initContextGl();
        }
    }

    _supportOffscreen() {
        return supportOffscreen(this.$videoElement) && this.player._opt.useOffscreen;
    }

    //
    _bindOffscreen() {
        this.bitmaprenderer = this.$videoElement.getContext('bitmaprenderer');
    }

    initCanvasViewSize() {
        this.$videoElement.width = this.videoInfo.width;
        this.$videoElement.height = this.videoInfo.height;
        this.resize();
    }

    //
    render(msg) {
        this.player.videoTimestamp = msg.ts;
        switch (this.renderType) {
            case CANVAS_RENDER_TYPE.offscreen:
                this.bitmaprenderer.transferFromImageBitmap(msg.buffer);
                break;
            case CANVAS_RENDER_TYPE.webgl:
                this.contextGlRender(this.$videoElement.width, this.$videoElement.height, msg.output[0], msg.output[1], msg.output[2]);
                break;
            case CANVAS_RENDER_TYPE.webcodecs:
                // can use  createImageBitmap in wexin
                this.context2D.drawImage(msg.videoFrame, 0, 0, this.$videoElement.width, this.$videoElement.height);
                closeVideoFrame(msg.videoFrame);
                break;
        }
    }

    screenshot(filename, format, quality, type) {
        filename = filename || now();
        type = type || SCREENSHOT_TYPE.download;
        const formatType = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            webp: 'image/webp'
        };
        let encoderOptions = 0.92;
        if (!formatType[format] && SCREENSHOT_TYPE[format]) {
            type = format;
            format = 'png';
            quality = undefined
        }

        if (typeof quality === "string") {
            type = quality;
            quality = undefined;
        }

        if (typeof quality !== 'undefined') {
            encoderOptions = Number(quality);
        }
        const dataURL = this.$videoElement.toDataURL(formatType[format] || formatType.png, encoderOptions);

        if (type === SCREENSHOT_TYPE.base64) {
            return dataURL;
        } else {
            const file = dataURLToFile(dataURL)
            if (type === SCREENSHOT_TYPE.blob) {
                return file;
            } else if (type === SCREENSHOT_TYPE.download) {
                // downloadImg(file, filename);
                saveAs(file, filename);
            }
        }

    }

    //
    clearView() {
        switch (this.renderType) {
            case CANVAS_RENDER_TYPE.offscreen:
                createEmptyImageBitmap(this.$videoElement.width, this.$videoElement.height).then((imageBitMap) => {
                    this.bitmaprenderer.transferFromImageBitmap(imageBitMap);
                })
                break;
            case CANVAS_RENDER_TYPE.webgl:
                this.contextGl.clear(this.contextGl.COLOR_BUFFER_BIT);
                break;
            case CANVAS_RENDER_TYPE.webcodecs:
                this.context2D.clearRect(0, 0, this.$videoElement.width, this.$videoElement.height)
                break;
        }
    }

    resize() {
        this.player.debug.log('canvasVideo', 'resize');
        const option = this.player._opt;
        let width = this.player.width;
        let height = this.player.height;
        if (option.hasControl && !option.controlAutoHide) {
            if (isMobile() && this.player.fullscreen && option.useWebFullScreen) {
                width -= CONTROL_HEIGHT;
            } else {
                height -= CONTROL_HEIGHT;
            }
        }
        let resizeWidth = this.$videoElement.width;
        let resizeHeight = this.$videoElement.height;
        const rotate = option.rotate;
        let left = ((width - resizeWidth) / 2)
        let top = ((height - resizeHeight) / 2)
        if (rotate === 270 || rotate === 90) {
            resizeWidth = this.$videoElement.height;
            resizeHeight = this.$videoElement.width;
        }

        const wScale = width / resizeWidth;
        const hScale = height / resizeHeight;

        let scale = wScale > hScale ? hScale : wScale;
        //
        if (!option.isResize) {
            if (wScale !== hScale) {
                scale = wScale + ',' + hScale;
            }
        }
        //
        if (option.isFullResize) {
            scale = wScale > hScale ? wScale : hScale;
        }
        let transform = "scale(" + scale + ")";

        if (rotate) {
            transform += ' rotate(' + rotate + 'deg)'
        }

        this.$videoElement.style.transform = transform;
        this.$videoElement.style.left = left + "px"
        this.$videoElement.style.top = top + "px"
    }


}
