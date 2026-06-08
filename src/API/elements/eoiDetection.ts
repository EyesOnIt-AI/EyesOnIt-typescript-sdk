import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIObjectDescription } from "./eoiObjectDescription";

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

    public getDetectedObjects(): EOIDetectionObject[] | null {
        return null;
    }

    public getObjectByDescription(object_description: string): [EOIDetectionObject, EOIObjectDescription] | [null, null] {
        const detectedObjects = this.getDetectedObjects();

        if (detectedObjects != null) {
            for (const detectedObject of detectedObjects) {
                if (detectedObject.object_descriptions == null) {
                    continue;
                }

                for (const detectedObjectDescription of detectedObject.object_descriptions) {
                    if (detectedObjectDescription.text == object_description) {
                        return [detectedObject, detectedObjectDescription];
                    }
                }
            }
        }

        return [null, null];
    }
}
