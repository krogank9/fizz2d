import GSSolver from "../solver/GSSolver";
import { getContactPointsAndMTV } from "../collision/Narrowphase";
import vec2 from "../math/vec2";

export default function World() {
    this.bodies = [];
}

World.prototype.step = function (deltaTime) {
    // Apply gravity and update positions
    const gravity = [0, -9.8]; // Example gravity
    for (let i = 0; i < this.bodies.length; i++) {
        let body = this.bodies[i];
        if (body.mass === 0) continue;
        vec2.scaleAndAdd(body.velocity, body.velocity, gravity, deltaTime);
        vec2.scaleAndAdd(
            body.position,
            body.position,
            body.velocity,
            deltaTime
        );

        body.rotation += body.rotationalVelocity * deltaTime;
    }

    // Get all pairs of objects in the bodies array
    const contactsAndBodies = [];
    for (let i = 0; i < this.bodies.length; i++) {
        for (let j = i + 1; j < this.bodies.length; j++) {
            let collision = getContactPointsAndMTV(
                {},
                this.bodies[i],
                this.bodies[j]
            );
            //console.log(collision)
            if (collision.contactPoints.length > 0)
                contactsAndBodies.push(collision);
        }
    }
    //console.log(contactsAndBodies)

    // Use the GSSolver module to resolve the collisions for each body
    if (contactsAndBodies.length > 0) GSSolver(contactsAndBodies);
};
