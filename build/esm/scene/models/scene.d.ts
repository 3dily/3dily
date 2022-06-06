export interface ISceneOpts {
    panelId: string;
    productCode: string;
    containerId: string;
    thumbnails?: number[];
    shadow?: boolean;
    variants?: {
        [key: string]: string;
    };
}
