import { EOIVertex } from "./eoiVertex";

export class EOILine {
    public id: number;

    constructor(
        public name: string,
        public vertices: EOIVertex[]) {
    }

    public static fromJsonObj(obj: any) {
        let line = new EOILine(
            obj.name,
            obj.vertices?.map(EOIVertex.fromJsonObj));

        line.id = obj.id;

        return line;
    }

    public flipDirection() {
        this.vertices.reverse();
    }
}