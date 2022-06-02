export interface ISceneData {
    layers: ILayerData[];
    files: IFileData[];
}
export interface ILayerData {
    code: string;
    variants: string[];
}
export interface IFileData {
    frames: IFramesData;
    ar: IARData;
}
export interface IFramesData {
    length: number;
}
export interface IARData {
    android: boolean;
    ios: boolean;
}
