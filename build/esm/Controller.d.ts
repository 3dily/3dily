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
    constructor(element: HTMLElement, framesCount: number, onChangeFrame: (i: number) => void);
    init(): void;
}
