export class EOIBoundingBox {

    constructor(
        public top: number,
        public left: number,
        public width: number,
        public height: number) { }

    public static fromJsonObj(obj: any): EOIBoundingBox | undefined {
        let boundingBox;

        if (obj != null) {
            boundingBox = new EOIBoundingBox(
                obj.top,
                obj.left,
                obj.width,
                obj.height);
        }

        return boundingBox;
    }
}