export class EOIBoundingBox {
    public right: number;
    public bottom: number;

    constructor(
        public top: number,
        public left: number,
        public width: number,
        public height: number) { 
            this.right = left + width;
            this.bottom = top + height;
        }

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