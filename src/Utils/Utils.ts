
export class Utils {
    static fastClone(originalObject: Object) {
        return JSON.parse(JSON.stringify(originalObject));
    }
}