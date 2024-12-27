
export class JSONUtil {

    public static stringifyWithoutCircularLinks(obj: any): string {
        const cache: any[] = [];

        const replacer = (key: string, value: any) => {
            // Check if the value is an object and if it has already been visited
            if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
              }
              // Add the object to the cache
              cache.push(value);
            }
            return value;
          };
    
        const jsonString = JSON.stringify(obj, replacer);

        return jsonString;
    }
}
