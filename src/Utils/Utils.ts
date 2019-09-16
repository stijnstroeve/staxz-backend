
export class Utils {
    static fastClone(originalObject: Object) {
        return JSON.parse(JSON.stringify(originalObject));
    }
    static currentDate() {
        let date = new Date();
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }
}