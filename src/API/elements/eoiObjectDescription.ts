export class EOIObjectDescription {
    public display_text: string;

    constructor(
        public text: string, 
        public background_prompt: boolean = false,
        public alert: boolean = true,
        public threshold?: number, 
        public confidence?: number, 
        public over_threshold: boolean = false) { }

    public static fromJsonObj(obj: any) {
        let object_description = new EOIObjectDescription(
            obj.text,
            obj.background_prompt,
            obj.alert == true,
            obj.threshold,
            obj.confidence,
            obj.over_threshold
        );

        object_description.display_text = obj.display_text;

        return object_description;
    }

    public toJSON() {
        if (this.background_prompt) {
            return {
                text: this.text,
                background_prompt: this.background_prompt,
                alert: false
            };
        } else {
            return {
                text: this.text,
                background_prompt: this.background_prompt,
                threshold: this.threshold,
                alert: this.alert,
                display_text: this.display_text
            };
        }
    }

    public static default(): EOIObjectDescription {
        return new EOIObjectDescription("", false);
    }
}