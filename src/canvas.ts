export const canvasId = 'blizzard-canvas';

export const createCanvasElement = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.id = canvasId;

    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.position = 'fixed';
    canvas.style.touchAction = 'none';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    return canvas;
};