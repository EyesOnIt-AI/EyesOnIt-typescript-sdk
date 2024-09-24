export class EOIVertex {
    constructor(
        public x: number,
        public y: number) { }

    static fromJsonObj(obj: any): EOIVertex {
        return new EOIVertex(obj.x, obj.y);
    }
}