type Landmark = {
    x: number;
    y: number;
    z: number;
    visibility?: number;
};

export class LandmarkSmoother {
    private previous: Landmark[] | null = null;//либо массив либо нул

    //коэфицент сглаживания
    private alpha = 0.5;

    smooth(landmarks: Landmark[]) {
        if (!this.previous) {
            this.previous = landmarks.map((landmark) => ({
                ...landmark,
            }));

            return this.previous;
        }

        const smoothed = landmarks.map((landmark, index) => {
            const previous = this.previous![index];

            return {
                //Линейная интерполяция
                x: previous.x + (landmark.x - previous.x) * this.alpha,
                y: previous.y + (landmark.y - previous.y) * this.alpha,
                z: previous.z + (landmark.z - previous.z) * this.alpha,
                visibility: landmark.visibility,
            };
        });

        this.previous = smoothed;

        return smoothed;
    }

    reset() {
        this.previous = null;
    }
}