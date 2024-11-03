// vitest

import { describe, it, expect } from "vitest";
import { executer } from "./util";

describe("executer function", () => {
    it("returns the initial value correctly when elapsed time is 0", () => {
        const start = 0;
        const end = 10;
        const duration = 100;
        const init = 5;
        const getNext = executer(start, end, duration, init);

        expect(getNext(0)).toBe(init);
    });

    it("changes value correctly within duration", () => {
        const start = 0;
        const end = 10;
        const duration = 100;
        const init = 0;
        const getNext = executer(start, end, duration, init);

        expect(getNext(50)).toBeCloseTo(5, 1); // 中间点的值应该在 start 和 end 中间
    });

    it("reaches end and reverses direction", () => {
        const start = 0;
        const end = 10;
        const duration = 100;
        const init = 0;
        const getNext = executer(start, end, duration, init);

        // 当 `elapsedTime` 接近 `duration` 时，应接近 `end`
        expect(getNext(100)).toBeCloseTo(end);

        // 再次调用应该开始下降
        expect(getNext(150)).toBeCloseTo(5, 1); // 回落到中间点
    });

    it("reaches start and reverses direction", () => {
        const start = 0;
        const end = 10;
        const duration = 100;
        const init = 10;
        const getNext = executer(start, end, duration, init);

        // 当值反弹回 start
        expect(getNext(200)).toBe(end);

        // 再次调用应上升
        expect(getNext(250)).toBe(5); // 上升到中间点
    });

    it("handles elapsed time exceeding duration (cyclic behavior)", () => {
        const start = 0;
        const end = 10;
        const duration = 100;
        const init = 0;
        const getNext = executer(start, end, duration, init);

        // 当 `elapsedTime` 超过 `duration` 的倍数，应该在周期内
        expect(getNext(250)).toBeCloseTo(5, 1); // 250 % 100 = 50，应该等于 `getNext(50)` 的值
    });
});
