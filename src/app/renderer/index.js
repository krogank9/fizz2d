import * as PIXI from "pixi.js";

import * as phys from "../phys";
import seedrandom from "seedrandom";

const graphicsScale = 20;

import { randomColor } from "randomcolor"; // import the script

function setupRendererIfNeeded() {
    if (window.rendererState) return; // already set up

    var color = randomColor({
        hue: "blue", // Specify the hue you want (e.g., 'purple', 'blue', etc.)
        seed: 2
    });

    // Create a Pixi.js application
    let app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x4B65FE,
        antialias: true,
    });

    // Add the Pixi.js canvas to the DOM
    document.body.appendChild(app.view);

    // Resize the application when the window size changes
    window.addEventListener("resize", () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    app.stage.position.x += window.innerWidth * 0.5;
    app.stage.position.y += window.innerHeight * 0.6;

    // Set up mouse controls
    setupControls(app);

    window.rendererState = { app, rendererBodies: {} };
}

function setupControls(app) {
    let isDragging = false;
    let lastPosition = { x: 0, y: 0 };
    let mousePosition = { x: 0, y: 0 };
    let zooming = false;
    let zoomTargetScale = app.stage.scale.x;
    const zoomSpeed = 0.2;
    const zoomThreshold = 0.1;

    app.view.addEventListener("wheel", (event) => {
        event.preventDefault();
        const oldScale = app.stage.scale.x;
        const zoomFactor = 1 + event.deltaY * -0.003;
        zoomTargetScale = Math.max(0.1, Math.min(oldScale * zoomFactor, 10));
        zooming = true;
        const pos = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - pos.left;
        const mouseY = event.clientY - pos.top;
        mousePosition = {
            x: (mouseX - app.stage.position.x) / oldScale,
            y: (mouseY - app.stage.position.y) / oldScale,
        };
    });

    app.view.addEventListener("mousedown", (event) => {
        isDragging = true;
        lastPosition = { x: event.clientX, y: event.clientY };
    });

    app.view.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const dx = event.clientX - lastPosition.x;
            const dy = event.clientY - lastPosition.y;
            app.stage.position.x += dx;
            app.stage.position.y += dy;
            lastPosition = { x: event.clientX, y: event.clientY };
        }
    });

    app.view.addEventListener("mouseup", () => {
        isDragging = false;
    });

    app.ticker.add(() => {
        if (zooming) {
            const oldScale = app.stage.scale.x;
            const zoomDelta = zoomTargetScale - oldScale;
            const zoomAmount = zoomDelta * zoomSpeed;
            const newScale = oldScale + zoomAmount;
            const newPosition = {
                x: mousePosition.x * (1 - newScale / oldScale) * oldScale + app.stage.position.x,
                y: mousePosition.y * (1 - newScale / oldScale) * oldScale + app.stage.position.y,
            };
            app.stage.scale.set(newScale);
            app.stage.position.set(newPosition.x, newPosition.y);
            if (Math.abs(zoomDelta) < zoomThreshold) {
                zooming = false;
            }
        }
    });
}

let pastelSeed = 5;
let first = true;
function generateRandomPastelColor() {
    if(first) {
        first = false;
        return randomColor({ hue: "blue", seed: 333,});
    }

    // Create a seeded PRNG using the given seed
    const prng = seedrandom(pastelSeed++);

    return randomColor({ seed: Math.round(prng() * Number.MAX_SAFE_INTEGER), luminosity: "light" });

    // Generate random values for red, green, and blue channels
    let r = Math.floor(prng() * 128) + 128; // Red value between 128 and 255
    let g = Math.floor(prng() * 128) + 128; // Green value between 128 and 255
    let b = Math.floor(prng() * 128) + 128; // Blue value between 128 and 255

    // Combine the RGB values into a single integer
    let color = (r << 16) + (g << 8) + b;

    // Return the integer color value
    return color;
}

function makeCircle(radius) {
    const circle = new PIXI.Graphics();
    circle.lineStyle(1, 0x000000); // Set line style
    circle.beginFill(generateRandomPastelColor());
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    return circle;
}

function makePlane() {
    const length = 1e6; // Set a very large length to make it appear infinite
    const line = new PIXI.Graphics();
    line.lineStyle(2, 0x00); // Set the line style with a random color
    line.moveTo(-length / 2, 0); // Start the line at the left end
    line.lineTo(length / 2, 0); // Draw the line to the right end

    const fillRect = new PIXI.Graphics();
    fillRect.beginFill(generateRandomPastelColor()); // Use a random color for the fill
    fillRect.drawRect(-length / 2, 0, length, length); // Draw a rectangle below the line
    fillRect.endFill();

    const container = new PIXI.Container();
    container.addChild(fillRect); // Add the rectangle to the container first
    container.addChild(line); // Add the line to the container on top of the rectangle

    return container;
}

function makeCapsule(radius1, radius2, length) {
    const capsule = new PIXI.Graphics();

    const startX = -length / 2;
    const endX = length / 2;

    capsule.lineStyle(2, 0x000000); // Set line style
    capsule.beginFill(generateRandomPastelColor());

    // Start at top of left circle
    capsule.moveTo(startX * graphicsScale, -radius1 * graphicsScale);

    // Draw top line
    capsule.lineTo(endX * graphicsScale, -radius2 * graphicsScale);

    // Draw right circle
    capsule.arc(endX * graphicsScale, 0, radius2 * graphicsScale, -Math.PI / 2, (-Math.PI * 3) / 2);

    // Draw bottom line
    capsule.lineTo(startX * graphicsScale, radius1 * graphicsScale);

    // Draw left circle
    capsule.arc(startX * graphicsScale, 0, radius1 * graphicsScale, Math.PI / 2, -Math.PI / 2);

    capsule.closePath();

    capsule.endFill();
    return capsule;
}

function initDraw(app, body) {
    let renderBody = { body };

    let bodyGraphic;

    if (body.shape instanceof phys.Circle) {
        bodyGraphic = makeCircle(body.shape.radius);
    } else if (body.shape instanceof phys.Capsule) {
        bodyGraphic = makeCapsule(body.shape.radius1, body.shape.radius2, body.shape.length);
    } else if (body.shape instanceof phys.Plane) {
        bodyGraphic = makePlane();
    } else {
        throw Error(`Unrecognized body shape. constructor name: ${Object.getPrototypeOf(body.shape).constructor.name}, json: ${JSON.stringify(body.shape, 2)}`);
    }

    renderBody.delete = () => {
        app.stage.removeChild(bodyGraphic);
        delete rendererBodies[body.id];
    };
    renderBody.updateDraw = () => {
        bodyGraphic.x = (body.position[0] + body.shape.offset[0]) * graphicsScale;
        bodyGraphic.y = (-body.position[1] - body.shape.offset[1]) * graphicsScale;
        bodyGraphic.rotation = (body.rotation + body.shape.rotation) * graphicsScale;
    };

    renderBody.updateDraw();
    app.stage.addChild(bodyGraphic);
    return renderBody;
}

export function render(world) {
    setupRendererIfNeeded();
    const { rendererBodies, app } = window.rendererState;

    // Update pixi js scene per what bodies are in the world
    world.bodies.forEach((body) => {
        if (body.id in rendererBodies) {
            if (rendererBodies[body.id].body.deleted) rendererBodies[body.id].delete();
            else rendererBodies[body.id].updateDraw(body);
        } else {
            rendererBodies[body.id] = initDraw(app, body);
        }
    });
}
