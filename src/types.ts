interface BaseEntity {
    id: string;
    createdOn: number;
}

export interface ImageSource {
    originalName: string;
    uuidName: string;
}

export interface Menuitem extends BaseEntity {
    content: string;
    imageSource: ImageSource;
}

export interface NewOrUpdatedMenuitem {
    id?: string;
    content: string;
    imageSource: ImageSource;
}

export interface ImageDataPayload {
    image: string;
    fileExt: string;
}
