import { EOIBoundingBox } from "./eoiBoundingBox";
import { EOIVertex } from "./eoiVertex";

export class EOILine {
    constructor(
        public name: string, 
        public vertices: EOIVertex[]) { }

    public static fromJsonObj(obj: any) {
        return new EOILine(
            obj.name,
            obj.vertices.map(EOIVertex.fromJsonObj));
    }
}