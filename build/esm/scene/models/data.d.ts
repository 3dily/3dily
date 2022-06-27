export interface ISceneData {
    layers: ILayerData[];
    ar: boolean;
    framesCount: number;
    shadow: boolean;
}
export interface ILayerData {
    code: string;
    variants: IVariantData[];
}
export interface IVariantData {
    code: string;
}
