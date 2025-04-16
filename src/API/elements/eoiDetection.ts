export class EOIDetection {
    public region: string;
    public class_name?: string;

    constructor() {
    }

    protected parseSuperClassFields(obj: any) {
        if (obj != null) {
            this.region = obj.region;
            this.class_name = obj.class_name;
        }
    }
}