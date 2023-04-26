import { calulateDistance, random } from "./helpers";
import { FireworkState, Point } from "./type";

const PARTICLE_COUNT: number = 100;
const STARTING_FIREWORK_COORDINATE_COUNT: number = 3;
const STARTING_PARTICLE_COORDINATE_COUNT: number = 5;

export interface Firework {
    
    /**
     * The list of particles to be generated
     */
    particles: Particle[];
    
    /**
     * Where did the firework start
     */
    startingPoint: Point;

    /**
     * Where does the firework end
     */
    endingPoint: Point;

    /**
     * Where currently is the firework
     */
    currentPoint: Point;

    /**
     * How far do we need to go
     */
    distanceToTarget: number;

    /**
     * How far have we gone
     */
    distanceTraveled: number;

    /**
     * Coordinates following the firework
     */
    coordinates: Point[];

    /**
     * What angle will the firework launch at
     */
    angle: number;

    /**
     * What speed shoud the firework launch at
     */
    speed: number;

    /**
     * How fast should the firework increase
     */
    acceleration: number;

    /**
     * How bright should the firework be
     */
    brightness: number;
}

interface Particle {
    /**
     * Where currently is the particle
     */
    currentPoint: Point;

    /**
     * Coordinates following the firework
     */
    coordinates: Point[];

    /**
     * What angle should the particle launch at
     */
    angle: number;

    /**
     * What speed should the particle launch at
     */
    speed: number;

    friction: number;

    gravity: number;

    hue: number;

    brightness: number;

    alpha: number;

    decay: number;
}

export const initialiseFirework = (
    startingPoint: Point,
    endingPoint: Point,
    hue: number
): Firework => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(
            initialiseParticle(endingPoint, hue)
        );
    }

    const coordinates: Point[] = [];
    for (let i = 0; i < STARTING_FIREWORK_COORDINATE_COUNT; i++) {
        coordinates.push(startingPoint);
    }

    return {
        particles: particles,
        startingPoint: startingPoint,
        endingPoint: endingPoint,
        currentPoint: startingPoint,
        distanceToTarget: calulateDistance(startingPoint, endingPoint),
        distanceTraveled: 0,
        coordinates: coordinates,
        angle: Math.atan2(endingPoint.y - startingPoint.y, endingPoint.x - startingPoint.x),
        speed: 2,
        acceleration: 1.05,
        brightness: random(50, 70)
    };
};

export const drawFirework = (
    context: CanvasRenderingContext2D,
    firework: Firework,
    hue: number
): void => {
    const latestCoordinate: Point = firework.coordinates[firework.coordinates.length - 1];
    const point: Point = firework.currentPoint;

    context.beginPath();
    context.moveTo(latestCoordinate.x, latestCoordinate.y);
    context.lineTo(point.x, point.y);
    context.lineWidth = 2;
    context.strokeStyle = 'hsl(' + hue + ', 100%, ' + firework.brightness + '%)';
    context.stroke();

    if (firework.distanceTraveled >= firework.distanceToTarget) {
        for (const particle of firework.particles) {
            const latestCoordinate: Point = particle.coordinates[particle.coordinates.length - 1];
            const point = particle.currentPoint;

            context.beginPath();
            context.moveTo(latestCoordinate.x, latestCoordinate.y);
            context.lineTo(point.x, point.y);
            context.strokeStyle = 'hsla(' + hue + ', 100%, ' + particle.brightness + '%, ' + particle.alpha + ')';
	        context.stroke();
        }
    }
};

export const updateFirework = (
    firework: Firework,
    state: FireworkState,
    index: number
): void => {
    /**
     * Remove the current coordinate
     */
    firework.coordinates.pop();

    /**
     * Append the latest coordinate
     */
    firework.coordinates.unshift(firework.currentPoint);

    /**
     * Update the speed so its faster each update
     */
    firework.speed *= firework.acceleration;

    /**
     * Figure out the velocity of the firework
     */
    const velocityPoint: Point = {
        x: Math.cos(firework.angle) * firework.speed,
        y: Math.sin(firework.angle) * firework.speed
    };

    /**
     * Update the distance travelled
     */
    firework.distanceTraveled = calulateDistance(
        firework.startingPoint,
        {
            x: firework.currentPoint.x + velocityPoint.x,
            y: firework.currentPoint.y + velocityPoint.y
        }
    );

    /**
     * Remove the firework if its reached the target
     */
    if (firework.distanceTraveled >= firework.distanceToTarget) {
        for (let i = 0; i < firework.particles.length; i++) {
            const particle = firework.particles[i];
            particle.coordinates.pop();
            particle.coordinates.unshift(particle.currentPoint);
            particle.speed *= particle.friction;
            particle.currentPoint = {
                x: particle.currentPoint.x += Math.cos(particle.angle) * particle.speed,
                y: particle.currentPoint.y += Math.sin(particle.angle) * particle.speed + particle.gravity
            };
            particle.alpha -= particle.decay;

            if (particle.alpha <= particle.decay) {
                firework.particles.splice(i, 1);
            }
        }

        if (firework.particles.length === 0) {
            state.fireworks.splice(index, 1);
        }

        return;
    }

    firework.currentPoint = {
        x: firework.currentPoint.x += velocityPoint.x,
        y: firework.currentPoint.y += velocityPoint.y
    };
}

export const initialiseParticle = (location: Point, hue: number): Particle => {
    const coordinates: Point[] = [];
    for (let i = 0; i < STARTING_PARTICLE_COORDINATE_COUNT; i++) {
        coordinates.push(location);
    }
    
    return {
        currentPoint: location,
        coordinates: coordinates,
        angle: random(0, Math.PI * 2),
        speed: random(1, 10),
        friction: 0.95,
        gravity: 1,
        hue: random(hue - 50, hue + 50),
        brightness: random(50, 80),
        alpha: 1,
        decay: random(0.015, 0.03)
    };
}
