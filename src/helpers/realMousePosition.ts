export function realMousePosition(element: HTMLCanvasElement,
    clientX: number,
    clientY: number
): {
    readonly x: number,
    readonly y: number,
} {
    const rect = element.getBoundingClientRect();
    const sx = element.scrollWidth / element.width || 1;
    const sy = element.scrollHeight / element.height || 1;

    return {
        x: (clientX - rect.left) / sx,
        y: (clientY - rect.top) / sy,
    }
}