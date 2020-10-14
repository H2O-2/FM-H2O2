/// <reference path="../node_modules/@svgdotjs/svg.filter.js/svg.filter.js.d.ts"/>
import { Svg, SVG, Rect, Circle, Filter, GaussianBlurEffect} from "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";

const PROGRESS_CIRCLE_BORDER = 2;
const PROGRESS_CIRCLE_RADIUS = 8;
const PROGRESS_START_HEIGHT = 24;
const PROGRESS_START_WIDTH = 6;
const DRAG_CONTROL_OFFSET = 6;
const VOL_ON_ICON = "fa-volume-up";
const VOL_OFF_ICON = "fa-volume-off";

// Return the output of `sizeFn` if it's valid or throw an Error
function elementSize(sizeFn: () => number | undefined, id : string) : number {
    const n: number | undefined = sizeFn();
    if (!n) throw Error(`Cannot get value of ${id}`);

    return n;
}

class MusicCircle {
    protected width: number;
    protected height: number;
    protected raw: JQuery<HTMLElement>;

    constructor(id: string) {
        this.raw = $(`#${id}`);
        if (!this.raw) {
            throw Error(`Cannot find HTML element with ID ${id}`);
        }

        this.width = elementSize(() : number | undefined => this.raw.width(), "Music Circle Width");
        this.height = elementSize(() : number | undefined => this.raw.height(), "Music Circle Height");
    }

    center(windowWidth: number, windowHeight: number, offset: number) : void {
        this.raw.css({
            top: windowHeight / 2 - this.height / 2 - offset,
            left: windowWidth / 2 - this.width / 2
        });
    }

    /*
    * The `clip-path` used here would cut off part of the `box-shadow`
    * used to represent the progress bar. Some possible work-arounds:
    * 1. Use `filter: drop-shadow` instead of `box-shadow`
    * 2. Bring border and `box-shadow` into the div element to prevent
    *    clipping
    */
    updateProgress(progress: number) : void {
        // Filter input
        progress = Math.min(Math.max(progress, 0), 100)

        const maskingStr: string = "polygon(50% 50%,50% 0%,";
        const mask2: string = maskingStr + "100% 0%,";
        const mask3: string = mask2 + "100% 100%,";
        const mask4: string = mask3 + "0% 100%,";
        const mask5: string = mask4 + "0% 0%,";

        if (progress <= 12.5) {
            this.raw.css({
                "clip-path": maskingStr + (50 + progress * 4).toString() + "% 0%"
            });
        } else if (progress <= 37.5) {
            this.raw.css({
                "clip-path": mask2 + "100% " + (progress * 4 - 50).toString() + "%"
            });
        } else if (progress <= 62.5) {
            this.raw.css({
                "clip-path": mask3 + (progress * 4 - 150).toString() + "% 100%"
            });
        } else if (progress <= 87.5) {
            this.raw.css({
                "clip-path": mask4 + "0% " + (progress * 4 - 250).toString() + "%"
            });
        } else {
            this.raw.css({
                "clip-path": mask5 + (progress * 4 - 350).toString() + "% 0%"
            });
        }
    }

    getWidth() : number {
        return this.width;
    }

    getHeight() : number {
        return this.height;
    }
}

class RythmCircle extends MusicCircle {
    constructor(id: string) {
        super(id);
    }

    center(musicCircleWidth: number, musicCircleHeight: number) : void {
        this.raw.css({
            top: (musicCircleHeight - this.height) / 2,
            left: (musicCircleWidth - this.width) / 2
        });
    }

    placeElementAtBottom(element: JQuery<HTMLElement>, windowWidth: number, windowHeight: number) : void {
        element.css({
            top: this.height + (windowHeight - this.height) / 2,
            left: windowWidth / 2 - elementSize(() : number | undefined => element.width(), "RythmCircle Bottom Element") / 2});
    }

    draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) : void {
        ctx.beginPath();
        console.log(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2 , canvas.height / 2 - 3, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#d78bff';
        ctx.shadowColor = '#f9b2e2';
        ctx.shadowBlur = 20;
        ctx.stroke();
    }
}

export default class UI {
    private static window: JQuery<Window>;
    private static background: JQuery<HTMLElement>;
    private static showAlbum: JQuery<HTMLElement>;
    private static albumCover: JQuery<HTMLElement>;
    private static albumName: JQuery<HTMLElement>;
    private static playerBar: JQuery<HTMLElement>;
    private static playerTimer: JQuery<HTMLElement>;
    private static playerDiv: JQuery<HTMLElement>;
    private static functionIcons: JQuery<HTMLSpanElement>;
    private static volumeIcon: JQuery<HTMLElement>;
    private static volumeSlider: JQuery<HTMLInputElement>;
    private static canvas: HTMLCanvasElement;
    private static canvasCtx: CanvasRenderingContext2D;

    private static musicCircle: MusicCircle;
    private static musicCircleBuffered: MusicCircle;
    private static musicCirclePlayed: MusicCircle;
    private static musicCirclePlayed2: MusicCircle;
    private static rhythmCircle: RythmCircle;

    private static svg: Svg;
    private static progressController: JQuery<HTMLElement>;

    private static windowWidth: number;
    private static windowHeight: number;
    private static musicCircleOffset: number;

    static init(window: JQuery<Window>): void {
        this.window = window;
        this.background = $("#bg");
        this.showAlbum = $("#showAlbum");
        this.albumCover = $("#albumCover");
        this.albumName = $("#albumName");
        this.playerBar = $("#playerBar");
        this.playerTimer = $("#playerTimer");
        this.playerDiv = $("#playerControl");
        this.functionIcons = $("#functionIcons");
        this.volumeIcon = $("#volumeIcon");
        this.volumeSlider = $("#volumeSlider");

        this.musicCircle = new MusicCircle("musicCircleToPlay");
        this.musicCircleBuffered = new MusicCircle("musicCircleBuffered");
        this.musicCirclePlayed = new MusicCircle("musicCirclePlayed");
        this.musicCirclePlayed2 = new MusicCircle("musicCirclePlayed2");

        this.canvas = document.getElementById("rhythmCircle") as HTMLCanvasElement;
        if (!this.canvas) {
            throw Error("No canvas element found!");
        }

        this.canvasCtx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.canvasCtx) {
            throw Error("Failed to get canvas context!");
        }

        this.canvas.width = this.musicCircle.getWidth() * (9 / 8);
        this.canvas.height = this.musicCircle.getHeight() * (9 / 8);

        this.rhythmCircle = new RythmCircle("rhythmCircle");

        this.svg = SVG().addTo("#playerControl")
            .size(this.musicCircle.getWidth() + PROGRESS_CIRCLE_RADIUS * 4, this.musicCircle.getHeight() + PROGRESS_START_HEIGHT);

        // Right now canvas size does not resize so only draw once in init()
        this.rhythmCircle.draw(this.canvas, this.canvasCtx);

        // Position all components
        this.updateWindowSize();
        this.centerPlayer();
        this.placeAlbum();
        this.rhythmCircle.placeElementAtBottom(this.albumName, this.windowWidth, this.windowHeight);
        this.rhythmCircle.placeElementAtBottom(this.functionIcons, this.windowWidth, this.windowHeight);
        this.placePlayerBar();
        this.initPlayerComponent();

        // Initialize progress circle
        [this.musicCircleBuffered, this.musicCirclePlayed, this.musicCirclePlayed2]
            .forEach((circle: MusicCircle) => circle.updateProgress(0));

        this.progressController = $("progressCircle").eq(0);
    }

    static updateWindowSize() : void {
        this.windowWidth = elementSize(() : number | undefined => this.window.width(), "Window Width");
        this.windowHeight = elementSize(() : number | undefined => this.window.height(), "Window Height");
        this.musicCircleOffset = elementSize(() : number | undefined => this.window.innerWidth(), "Window Inner Width") / 25;
    }

    static centerPlayer() : void {
        [this.musicCircle, this.musicCircleBuffered, this.musicCirclePlayed, this.musicCirclePlayed2]
            .forEach((e: MusicCircle) : void => {
                e.center(this.windowWidth, this.windowHeight, this.musicCircleOffset);
            })

        this.rhythmCircle.center(this.musicCircle.getWidth(), this.musicCircle.getHeight());
    }

    static placeAlbum() : void {
        this.albumCover.css({
            top: this.windowHeight / 2 - this.musicCircle.getHeight() / 2 - this.musicCircleOffset
                + (this.musicCircle.getHeight() - elementSize((): number | undefined => this.albumCover.height(), "Album Cover Height")) / 2
                + PROGRESS_CIRCLE_BORDER,
            left: this.windowWidth / 2 - this.musicCircle.getWidth() / 2
                + (this.musicCircle.getWidth() - elementSize((): number | undefined => this.albumCover.width(), "Album Cover Width")) / 2
                + PROGRESS_CIRCLE_BORDER
        });

        this.showAlbum.css({
            top: this.windowHeight / 2 - this.musicCircle.getHeight() / 2 - this.musicCircleOffset
                + (this.musicCircle.getHeight() - elementSize((): number | undefined => this.showAlbum.height(), "Show Album Height")) / 2
                + PROGRESS_CIRCLE_BORDER,
            left: this.windowWidth / 2 - this.musicCircle.getWidth() / 2 +
                (this.musicCircle.getWidth() - elementSize((): number | undefined => this.showAlbum.width(), "Show Album Width")) / 2
                + PROGRESS_CIRCLE_BORDER
        });
    }

    static placePlayerBar() {
        const playerBarHeight: number = elementSize((): number | undefined => this.playerBar.height(), "Player Bar Height");

        this.playerBar.css({
            top: this.musicCircle.getHeight() / 2 - playerBarHeight / 2
        });

        this.playerTimer.css({
            lineHeight: playerBarHeight + "px"
        });
    }

    static initPlayerComponent() {
        let progress_start: Rect = this.svg.rect(PROGRESS_START_WIDTH, PROGRESS_START_HEIGHT).fill('white');
        let progress_circle: Circle = this.svg.circle(PROGRESS_CIRCLE_RADIUS*2).fill('#e1e1e1');
        progress_circle.addClass("progressCircle");

        let startRecPosnX: number = this.svg.width() / 2 - PROGRESS_START_WIDTH / 2;
        let progressCirclePosnX: number = this.svg.width() / 2;
        let progressCirclePosnY: number = PROGRESS_CIRCLE_RADIUS + (PROGRESS_START_HEIGHT - PROGRESS_CIRCLE_RADIUS*2)/2;

        this.playerDiv.css({
            top: -(PROGRESS_START_HEIGHT/2),
            left: -(PROGRESS_CIRCLE_RADIUS*2)
        });

        progress_circle.cx(progressCirclePosnX).cy(progressCirclePosnY);
        progress_start.x(startRecPosnX).y(0);

        progress_circle.filterWith((add: Filter) : void => {
            const blur: GaussianBlurEffect = add.offset(0, 0).gaussianBlur(2, 2);
            add.blend(add.$source, blur, "normal");
        });

        var $progressFilter = $("div.musicCircle div#playerControl").find("filter:first-child");

        $progressFilter[0].setAttribute("width", "200%");
        $progressFilter[0].setAttribute("height", "200%");
        $progressFilter[0].setAttribute("x", "-40%");
        $progressFilter[0].setAttribute("y", "-40%");
    }

    static updateVolumeUI(volume: number) {
        if (volume === 0 && this.volumeIcon.hasClass(VOL_ON_ICON)) {
            this.volumeIcon.removeClass(VOL_ON_ICON).addClass(VOL_OFF_ICON);
        } else if (volume > 0 && this.volumeIcon.hasClass(VOL_OFF_ICON)) {
            this.volumeIcon.removeClass(VOL_OFF_ICON).addClass(VOL_ON_ICON);
        }

        this.volumeSlider.val(volume.toString());
    }
}
