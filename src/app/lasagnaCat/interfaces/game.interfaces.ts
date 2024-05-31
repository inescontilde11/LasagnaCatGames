export interface Game {
    _id?: string;
    title: string;
    devname: string;
    desc: string;
    categories: string[];
    shortvideo?: string;
    imgs: string[];
    releasedate: string
    archiveexegame: string;
    tamanyo?: number;
}