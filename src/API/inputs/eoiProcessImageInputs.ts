import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIResponse } from "../eoiResponse";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIValidator } from "../eoiValidator";
import { EOIEffects } from "../elements/eoiEffects";

/**
 * Request payload for processing a single image.
 */
export class EOIProcessImageInputs extends EOIBaseInputs {
    /**
     * @param base64Image Base64-encoded image payload.
     * @param regions Detection regions and configuration.
     * @param return_image Whether to include an annotated image in the response.
     * @param effects Optional visual effects/overlays configuration.
     */
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

    /**
     * Serializes this payload for the API request body.
     * The serializer excludes nested `confidence` values.
     */
    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateProcessImageInputs(this);
    }
}
