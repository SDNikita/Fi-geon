import { detectPushUp } from './PushUpDetector';
import { detectSitUp } from './SitUpDetector';
import { detectJumpingJack } from './JumpingJackDetector';
import { detectSquat } from './SquatDetector';
import { hasVisible, type Detection, type ExerciseType, type Landmark, type MovementState } from './ExerciseDetector';

type Candidate = 'pushUpSide' | 'pushUpFront' | 'sitUp' | 'jumpingJack' | 'squat';
const candidates: Candidate[] = ['pushUpSide', 'pushUpFront', 'sitUp', 'jumpingJack', 'squat'];
const exerciseFor: Record<Candidate, ExerciseType> = {
    pushUpSide: 'pushUp', pushUpFront: 'pushUp', sitUp: 'sitUp', jumpingJack: 'jumpingJack', squat: 'squat',
};
export type AutoDetection = Detection & { exercise: ExerciseType | null; hint: string };
type Track = {
    state: MovementState;
    pending: MovementState;
    since: number;
    lastValid: number;
    started: number;
};
const CONFIRM_MS = 80;
const LOST_MS = 400;
const MAX_REP_MS = 10000;

export class AutoExerciseDetector {
    private tracks = this.initialTracks();
    private locked: Candidate | null = null;
    private lastFrame = -Infinity;

    private initialTracks(): Record<Candidate, Track> {
        return Object.fromEntries(candidates.map((candidate) => [candidate, {
            state: 'waiting', pending: 'waiting', since: 0, lastValid: -Infinity, started: 0,
        }])) as Record<Candidate, Track>;
    }

    reset() {
        this.tracks = this.initialTracks();
        this.locked = null;
        this.lastFrame = -Infinity;
    }

    detect(points: Landmark[], world: Landmark[] = [], now = performance.now()): AutoDetection {
        // Do not complete a repetition across a camera stall or hidden tab.
        if (now - this.lastFrame > LOST_MS) this.reset();
        this.lastFrame = now;
        const run = (candidate: Candidate): Detection => {
            const track = this.tracks[candidate];
            let raw: Detection;
            switch (candidate) {
                case 'pushUpSide': raw = detectPushUp(points, track.state, 'side', world); break;
                case 'pushUpFront': raw = detectPushUp(points, track.state, 'front', world); break;
                case 'sitUp': raw = detectSitUp(points, track.state); break;
                case 'jumpingJack': raw = detectJumpingJack(points, track.state); break;
                case 'squat': raw = detectSquat(points, track.state, world); break;
            }
            if (raw.state === 'waiting') {
                // A single occluded joint must not erase the whole movement.
                track.pending = track.state;
                if (now - track.lastValid <= LOST_MS && now - track.started <= MAX_REP_MS) {
                    return { state: track.state, result: { completed: false } };
                }
                track.state = 'waiting';
                return { state: 'waiting', result: { completed: false } };
            }
            track.lastValid = now;
            if (track.state !== 'waiting' && now - track.started > MAX_REP_MS) {
                track.state = 'waiting';
                track.pending = 'waiting';
                return { state: 'waiting', result: { completed: false } };
            }
            if (raw.state === track.state) {
                track.pending = track.state;
                return { state: track.state, result: { completed: false, angle: raw.result.angle } };
            }
            if (raw.state !== track.pending) {
                track.pending = raw.state;
                track.since = now;
            }
            if (now - track.since < CONFIRM_MS) {
                return { state: track.state, result: { completed: false, angle: raw.result.angle } };
            }
            track.state = raw.state;
            if (raw.state === 'ready') track.started = now;
            return raw;
        };
        const waiting = (hint: string): AutoDetection => ({
            exercise: null, state: 'waiting', result: { completed: false }, hint,
        });
        const explain = (candidate: Candidate, detection: Detection): AutoDetection => ({
            ...detection, exercise: exerciseFor[candidate], hint: detection.result.completed
                ? 'Повтор засчитан' : detection.state === 'active'
                    ? 'Вернитесь в исходное положение' : 'Исходное положение видно — начните движение',
        });

        if (this.locked) {
            const candidate = this.locked;
            const detection = run(candidate);
            if (detection.state === 'waiting') {
                this.reset();
                this.lastFrame = now;
            } else {
                if (detection.result.completed) {
                    this.reset();
                    this.lastFrame = now;
                    this.tracks[candidate] = { state: 'ready', pending: 'ready', since: now, lastValid: now, started: now };
                }
                const output = explain(candidate, detection);
                if (now > this.tracks[candidate].lastValid) output.hint = 'Точки тела временно потеряны — проверьте кадр';
                return output;
            }
        }

        const detections = candidates.map((candidate) => ({ candidate, detection: run(candidate) }));
        const active = detections.filter(({ detection }) => detection.state === 'active');
        const types = new Set(active.map(({ candidate }) => exerciseFor[candidate]));
        if (types.size > 1) {
            this.reset();
            return waiting('Движение неоднозначно — вернитесь в исходное положение');
        }
        if (active.length) {
            const { candidate, detection } = active[0];
            this.locked = candidate;
            return explain(candidate, detection);
        }
        const ready = detections.filter(({ detection }) => detection.state === 'ready');
        if (ready.length === 1 || (ready.length > 1 && ready.every(({ candidate }) => exerciseFor[candidate] === exerciseFor[ready[0].candidate]))) {
            return explain(ready[0].candidate, ready[0].detection);
        }
        if (ready.length) return waiting('Исходная стойка видна — начните упражнение');
        if (!points.length) return waiting('Человек не найден — встаньте в кадр');
        if (!hasVisible(points, [11, 12, 23, 24, 27, 28])) {
            return waiting('Часть тела плохо видна — отойдите от камеры, покажите ноги и корпус');
        }
        return waiting('Примите исходное положение и задержитесь ненадолго');
    }
}
