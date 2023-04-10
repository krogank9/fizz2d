import vec2 from "../math/vec2";

let id = 0;

export default function Body({ shape, position, rotation, velocity, mass }) {
    this.id = id++;
    this.shape = shape;
    this.position = position || [0, 0];
    this.rotation = rotation || 0;
    this.rotationalVelocity = 0;
    this.velocity = velocity || [0, 0];
    this.mass = mass || 0;
    this.invMass = mass === 0 ? 0 : 1 / mass;
    this.momentOfInertia = (
        this.shape.calculateMomentOfInertia || (() => 0)
    ).bind(this.shape)(mass);
    this.invMomentOfInertia =
        this.momentOfInertia === 0 ? 0 : 1 / this.momentOfInertia;

    let calculateCenterOfMass = (
        this.shape.calculateCenterOfMass || (() => [0, 0])
    ).bind(this.shape);
    this.shape.offset = vec2.negate([], calculateCenterOfMass());
    this.shape.rotation = 0;

    this.getVelocityAt = function (globalPosition) {
        // Calculate the vector from the center of mass to the global position
        const r = vec2.sub([], globalPosition, this.position);

        // Calculate the linear velocity due to the rotation of the body
        const rotationalVelocity = vec2.scale(
            [],
            vec2.perp([], r),
            this.rotationalVelocity
        );

        // Add the rotational velocity to the body's linear velocity to get the total velocity at the global position
        const totalVelocity = vec2.add([], this.velocity, rotationalVelocity);

        return totalVelocity;
    };
}

Body.prototype.applyImpulse = function (impulseVector, relativePoint) {
    if (this.mass === 0) return;

    // Calculate linear velocity change
    let linearImpulseVelocity = vec2.scale([], impulseVector, this.invMass);
    vec2.add(this.velocity, this.velocity, linearImpulseVelocity);

    // Calculate angular velocity change
    let rotationalImpulseVelocity =
        vec2.cross(impulseVector, relativePoint) * this.invMomentOfInertia;
    this.rotationalVelocity += rotationalImpulseVelocity;
};
