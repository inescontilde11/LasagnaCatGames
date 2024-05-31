import { Game } from "../../lasagnaCat/interfaces/game.interfaces";


export interface User {
    _id: string;
    email: string;
    username: string;
    tfno: string | undefined;
    desc: string | undefined;
    img: string | undefined;
    isActive: boolean;
    role: string;
    games: Game[] | undefined;
}