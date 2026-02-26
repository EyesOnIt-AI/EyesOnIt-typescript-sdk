
export class EOISimilarityDetectionObject {
    constructor(
        public confidence: number) 
        { }


    public static fromJsonObj(obj: any) {
        let result: EOISimilarityDetectionObject | undefined = undefined;

        if (obj != null) {
            result = new EOISimilarityDetectionObject(obj.confidence);
        }

        return result;
    }

}