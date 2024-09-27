import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIResponse } from "../eoiResponse";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIValidation } from "./eoiValidation";
import { EOIEffects } from "../elements/eoiEffects";

export class EOIProcessImageInputs extends EOIBaseInputs {
    constructor(public base64Image: string | undefined, public regions: EOIRegion[], public return_image?: boolean, public effects?: EOIEffects) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIProcessImageInputs | undefined {
        let inputs;

        if (obj != null) {
            if (obj.regions != null) {
                let regions = obj.regions?.map(EOIRegion.fromJsonObj)
                let effects = EOIEffects.fromJsonObj(obj.effects);                

                inputs = new EOIProcessImageInputs(
                    obj.base64Image,
                    regions,
                    obj.return_image,
                    effects
                );
            }
        }

        return inputs;
    }

    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    public validate(): EOIResponse {
        return EOIValidation.validateProcessImageInputs(this);
    }
}