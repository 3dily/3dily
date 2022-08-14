import { ISceneData } from './models/data';
declare type Handler<T> = (event: T) => void;
export declare type EventsOnArgsType = [eventName: 'load-data', handler: Handler<ISceneData>] | [eventName: 'loading', handler: Handler<string>] | [eventName: 'change-frame', handler: Handler<string>];
declare type EventsTriggerArgsType = [eventName: 'load-data', data: ISceneData] | [eventName: 'loading', data: string] | [eventName: 'change-frame', data: number];
export declare type EventsOffArgsType = [eventName: 'loaded-data', handler?: Handler<ISceneData>] | [eventName: 'loading', handler?: Handler<string>] | [eventName: 'change-frame', handler: Handler<string>];
export declare class Events {
    private handlers;
    on(...args: EventsOnArgsType): void;
    trigger(...args: EventsTriggerArgsType): void;
    off(...args: EventsOffArgsType): void;
}
export {};
