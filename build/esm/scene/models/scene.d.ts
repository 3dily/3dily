export interface ISceneOpts {
    panelId: string;
    productCode: string;
    containerId: string;
    thumbnails?: number[];
    shadow?: boolean;
    variants?: {
        [key: string]: string;
    };
    background?: string;
    API_URL?: string;
    autoAR?: boolean;
    arUrl?: string;
    ar?: boolean;
    mode: 'model' | '360' | 'auto';
}
