import { EOIVertex } from "./eoiVertex";

export class EOILine {
    private static nextId = 1;

    public id: number;

    constructor(
        public name: string,
        public vertices: EOIVertex[]) {
        this.id = EOILine.nextId;
        EOILine.nextId++;
    }

    public static fromJsonObj(obj: any) {
        let line = new EOILine(
            obj.name,
            obj.vertices?.map(EOIVertex.fromJsonObj));

        line.id = obj.id;

        if (line.id == null) {
            line.id = EOILine.nextId;
            EOILine.nextId++;
        }

        return line;
    }
}