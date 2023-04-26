import { Firework } from "./firework";

export interface FireworkState {
    /**
     * The canvas context
     */
    context: CanvasRenderingContext2D;

    /**
     * The height of the canvas
     */
    height: number;

    /**
     * The width of the canvas
     */
    width: number;

    /**
     * Create a random hue
     */
    hue: number;

    /**
     * A list of fireworks to be deployed
     */
    fireworks: Firework[];
}

export interface Point {
    x: number;
    y: number;
}