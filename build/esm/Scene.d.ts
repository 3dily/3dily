import { Controller } from './Controller.js';
export interface ISceneOpts {
    panelId: string;
    productCode: string;
    containerId: string;
}
export declare class Scene {
    opts: ISceneOpts;
    container: HTMLElement;
    wrapper: HTMLElement;
    baseUrl: string;
    controller: Controller;
    framesCount: number;
    activeFrame: number;
    frameElements: HTMLElement[];
    constructor(opts?: ISceneOpts);
    init(): void;
    setupScene(): void;
    onChangeFrame: (i: number) => void;
}
