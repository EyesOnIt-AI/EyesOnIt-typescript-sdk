export class DelayUtil {

    public async abortableDelay(ms: number, signal: AbortSignal) {
        const abortPromise = new Promise((_, reject) => {
            signal.addEventListener("abort", () => {
                reject(new Error("Delay aborted."));
            });
        });

        try {
            await Promise.race([
                abortPromise,
                new Promise(resolve => setTimeout(resolve, ms)),
            ]);
        }
        catch (err: any) {
            console.error(`abortableDelay: message: ${err.message}`);
        }
    }

    public static delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}
