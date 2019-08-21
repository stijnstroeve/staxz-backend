import {SortType} from "./SortType";

export class Sort {
    static sortObject(array: any[], sortBy: string, sortType: SortType) {
        array.sort((c1, c2) => {return sortType.func(c1, c2, sortBy)});
        return array;
    }
}