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

export interface Settings {
    bannerMessage: string;
    phone: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    hoursMonday: string;
    hoursTuesday: string;
    hoursWednesday: string;
    hoursThursday: string;
    hoursFriday: string;
    hoursSaturday: string;
    hoursSunday: string;
}
