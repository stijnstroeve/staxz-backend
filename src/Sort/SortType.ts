
export class SortType {
    static readonly NUMERIC  = new SortType('NUMERIC', (o1, o2, by) => {return o1[by] - o2[by]});

    private constructor(public key: string, public func: ((a: any, b: any, by: string) => number)) {}

    toString() {
        return this.key;
    }
}

