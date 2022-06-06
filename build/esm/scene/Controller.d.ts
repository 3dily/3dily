export declare class Controller {
    pointerPosition: {
        x: number;
        y: number;
    };
    pointerIsDown: boolean;
    element: HTMLElement;
    moved: boolean;
    activeIndex: number;
    framesCount: number;
    onChangeFrame: (i: number) => void;
    onZoom: (transform: string) => void;
    zoomIsEnable: boolean;
    zoomScale: number;
    translate: {
        x: number;
        y: number;
    };
    constructor(element: HTMLElement, framesCount: number, onChangeFrame: (i: number) => void, onZoom: (transform: string) => void);
    init(): void;
    getTranslate(clientX: number, clientY: number): {
        x: number;
        y: number;
    };
}
