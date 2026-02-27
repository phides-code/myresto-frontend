export interface ImageSource {
    originalName: string;
    uuidName: string;
}

export interface Menuitem {
    id: string;
    content: string;
    createdOn: number;
    imageSource: ImageSource;
}

export interface ImageDataPayload {
    image: string;
    fileExt: string;
}
