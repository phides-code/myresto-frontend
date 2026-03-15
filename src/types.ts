interface BaseEntity {
    id: string;
    createdOn: number;
}

export interface ImageSource {
    originalName: string;
    uuidName: string;
}

export interface Menuitem extends BaseEntity {
    title: string;
    imageSource: ImageSource;
    description: string;
    price: string;
    category: string;
}

export interface NewOrUpdatedMenuitem {
    id?: string;
    title: string;
    imageSource: ImageSource;
    description: string;
    price: string;
    category: string;
}

export interface ImageDataPayload {
    image: string;
    fileExt: string;
}
