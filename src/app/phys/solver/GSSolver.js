import vec2 from "../math/vec2";

export default function gaussSeidelSolver(contactsAndBodies) {
    const maxIterations = 10;
    const tolerance = 1e-6;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let maxImpulse = 0;

        contactsAndBodies.forEach(({ bodyA, bodyB, contactPoints, mtv }) => {
            contactPoints.forEach((contact) => {
                // Calculate the relative velocities at the contact point
                const relVelA = bodyA.getVelocityAt(contact);
                const relVelB = bodyB.getVelocityAt(contact);

                // Calculate the relative velocity along the mtv
                const relVel = vec2.sub([], relVelA, relVelB);
                const relVelAlongMtv = vec2.dot(relVel, mtv);

                // Calculate the impulse magnitude denominator
                const ra = vec2.sub([], contact, bodyA.position);
                const rb = vec2.sub([], contact, bodyB.position);
                const raCrossMtv = vec2.cross(ra, mtv);
                const rbCrossMtv = vec2.cross(rb, mtv);
                const denom =
                    bodyA.invMass +
                    bodyB.invMass +
                    bodyA.invMomentOfInertia * raCrossMtv * raCrossMtv +
                    bodyB.invMomentOfInertia * rbCrossMtv * rbCrossMtv;

                // Calculate the impulse magnitude
                const impulseMagnitude = -relVelAlongMtv / denom;

                // Calculate the impulse vector
                const impulse = vec2.scale([], mtv, impulseMagnitude);

                //debugger;

                // Apply the impulse to the bodies
                bodyA.applyImpulse(impulse, vec2.sub([], contact, bodyA.position));
                bodyB.applyImpulse(vec2.negate([], impulse), vec2.sub([], contact, bodyB.position));


                // Update the maximum impulse for this iteration
                maxImpulse = Math.max(maxImpulse, Math.abs(impulseMagnitude));
            });
        });

        // Check for convergence
        if (maxImpulse < tolerance) {
            break;
        }
    }
}