import { Point } from "./type";

export const random = (
    min: number, 
    max: number,
): number => {
    return Math.random() * (max - min) + min;
};

export const calulateDistance = (
    starting: Point,
    ending: Point
): number => {
    const differencePoint: Point = {
        x: starting.x - ending.x,
        y: starting.y - ending.y
    };

    return Math.sqrt(
        Math.pow(differencePoint.x, 2) + Math.pow(differencePoint.y, 2)
    )
};
