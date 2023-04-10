import * as renderer from "./renderer";
import * as phys from "./phys/index.js";

export function setupState() {
    let world = new phys.World();
    world.bodies.push(new phys.Body({ shape: new phys.Plane(), mass: 0 }));
    world.bodies.push(
        new phys.Body({
            shape: new phys.Capsule(3, 2, 10),
            position: [0, 30],
            rotation: 0,
            mass: 100,
        })
    );
    return world;
}

export function render(world) {
    renderer.render(world);
}

export function update(world, deltaTime) {
    const FIXED_TIME_STEP = 1 / 60; // 60 FPS
    let lagTime = deltaTime;
    let iters = 0;
    do {
        world.step(FIXED_TIME_STEP); // Update the physics simulation
        lagTime -= FIXED_TIME_STEP;
    } while (lagTime >= FIXED_TIME_STEP && iters++ < 10);
}
