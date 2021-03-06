import { Controller } from './Controller.js';
import { ISceneOpts } from './models/scene.js';
import { ISceneData } from './models/data.js';
import { EventsOnArgsType, EventsOffArgsType } from './Events.js';
export declare class Scene {
    opts: ISceneOpts;
    container: HTMLElement;
    sceneElement: HTMLElement;
    baseUrl: string;
    controller: Controller;
    data: ISceneData;
    activeFrame: number;
    frameElements: HTMLImageElement[];
    progressbar: HTMLDivElement;
    loading: number;
    private events;
    zoom: boolean;
    constructor(opts: ISceneOpts);
    private init;
    private setupScene;
    private createLoading;
    private validateOpts;
    private buildURL;
    private onChangeFrame;
    private onZoom;
    private onLoading;
    remove(): void;
    changeVariants(variants: {
        [key: string]: string;
    }): void;
    toggleShadow(): void;
    getData(): ISceneData | undefined;
    on(...args: EventsOnArgsType): void;
    off(...args: EventsOffArgsType): void;
}
