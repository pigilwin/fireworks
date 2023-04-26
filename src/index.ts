import { canvasId, createCanvasElement } from "./canvas";
import { drawFirework, Firework, initialiseFirework, updateFirework } from "./firework";
import { random } from "./helpers";
import { FireworkState } from "./type";

export const initialiseFireworks = () => {
    let canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
    /**
     * Check if the canvas does not exist on the document,
     * if it does not create a new element and append
     * it to the document and assign it
     */
    if (canvas === null) {
        canvas = createCanvasElement(
            window.innerWidth, 
            window.innerHeight
        );
        document.body.appendChild(canvas);
    }
    
    const state: FireworkState = {
        context: canvas.getContext('2d'),
        height: canvas.height,
        width: canvas.width,
        hue: 120,
        fireworks: []
    };
    state.fireworks = createFireworks(10, canvas.height, canvas.width, state.hue);

    /**
     * If the window size changes then resize the canvas
     */
    window.addEventListener('resize', () => {
        state.width = window.innerWidth;
        state.height = window.innerHeight;

        canvas.height = state.height;
        canvas.width = state.width;
    });

    const loop = () => {
        state.hue = random(0, 360);
        
        const context = state.context;

        /**
         * setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
         */
        context.globalCompositeOperation = 'destination-out';

        /**
         * Clear the canvas
         */
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, state.width, state.height);

        /**
         * Reset the composite as the firework render will be better
         */
        context.globalCompositeOperation = 'lighter';

        let i = state.fireworks.length;
        while (i--) {
            const firework: Firework = state.fireworks[i];

            /**
             * Draw the firework
             */
            drawFirework(state.context, firework, state.hue);

            /**
             * Update the firework location
             */
            updateFirework(firework, state, i);
        }

        window.requestAnimationFrame(() => {
            loop();
        });

    };

    /**
     * Initialise the first loop
     */
    loop();
};

const createFireworks = (count: number, height: number, width: number, hue: number): Firework[] => {

    const fireworks: Firework[] = [];
    for (let i = 0; i <= count; i++) {
        fireworks.push(
            initialiseFirework(
                {x: width / 2, y: height},
                {x: random(0, width), y: random(0, height / 2)},
                hue
            )
        )
    }
    return fireworks;
}
