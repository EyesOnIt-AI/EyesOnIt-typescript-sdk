export class EOIObjectDescription {
    constructor(
        public text: string, 
        public background_prompt: boolean = false,
        public threshold: number = 0, 
        public confidence: number = 0, 
        public over_threshold: boolean = false) { }

    public static fromJsonObj(obj: any) {
        let object_description = new EOIObjectDescription(
            obj.text,
            obj.background_prompt,
            obj.threshold,
            obj.confidence,
            obj.over_threshold
        );

        return object_description;
    }

    public toJSON() {
        // if (this.background_prompt) {
        //     return {
        //         text: this.text,
        //         background_prompt: this.background_prompt
        //     };
        // } else {
            return {
                text: this.text,
                background_prompt: this.background_prompt,
                threshold: this.threshold
            };
        // }
    }
}