import { EOIRegion } from "../elements/eoiRegion";

/**
 * Base request payload for APIs that require one or more detection regions.
 */
export class EOIBaseInputs {
    /**
     * @param regions Detection regions to evaluate. Must include at least one region.
     */
    constructor(public regions: EOIRegion[]) { }
}
