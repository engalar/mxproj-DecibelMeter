export function executer(
    start: number,
    end: number,
    duration: number,
    init: number,
) {
    let dir = true; // true 表示向上，false 表示向下
    let lastValue = init;

    return function getNext(elapsedTime: number) {
        if (elapsedTime > duration) {
            elapsedTime = elapsedTime % duration;
        }

        const t = elapsedTime / duration;
        let newValue = lastValue + (dir ? 1 : -1) * ((end - start) * t);

        if (newValue >= end) {
            dir = false;
            newValue = end - (newValue - end); // 反向并保持在范围内
        } else if (newValue <= start) {
            dir = true;
            newValue = start + (start - newValue); // 反向并保持在范围内
        }

        lastValue = newValue; // 更新 lastValue
        return newValue;
    };
}
