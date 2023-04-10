import HalfCircle from "./HalfCircle";
import Quad from "./Quad";

export default function Capsule(radius1, radius2, length) {
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.length = length;

    let quad = new Quad(
        -length / 2,
        length / 2,
        length / 2,
        -length / 2,
        radius1,
        radius2,
        -radius1,
        -radius2
    );
    let halfCircle1 = new HalfCircle(-radius1);
    let halfCircle2 = new HalfCircle(radius2);

    quad.area = quad.calculateArea();
    quad.centerOfMass = quad.calculateCenterOfMass();
    halfCircle1.area = halfCircle1.calculateArea();
    halfCircle1.centerOfMass = halfCircle1.calculateCenterOfMass();
    halfCircle2.area = halfCircle2.calculateArea();
    halfCircle2.centerOfMass = halfCircle2.calculateCenterOfMass();

    this.calculateCenterOfMass = function () {
        // Calculate the total mass of the capsule
        let totalArea = halfCircle1.area + halfCircle2.area + quad.area;

        // Calculate the weighted average of the centers of mass of the component parts
        let centerOfMassX =
            (halfCircle1.centerOfMass[0] * halfCircle1.area +
                halfCircle2.centerOfMass[0] * halfCircle2.area +
                quad.centerOfMass[0] * quad.area) /
            totalArea;

        return [centerOfMassX, 0];
    };

    this.calculateMomentOfInertia = function (mass) {
        let totalArea = halfCircle1.area + halfCircle2.area + quad.area;
        let centerOfMass = this.calculateCenterOfMass();

        let massPerArea = mass / totalArea;

        // Moment of inertia about the centroidal axis for each shape
        let I_quad = quad.calculateMomentOfInertia(massPerArea * quad.area);
        let I_halfCircle1 = halfCircle1.calculateMomentOfInertia(
            massPerArea * halfCircle1.area
        );
        let I_halfCircle2 = halfCircle2.calculateMomentOfInertia(
            massPerArea * halfCircle2.area
        );

        // Parallel axis theorem
        let d_quad = Math.abs(centerOfMass[0] - quad.centerOfMass[0]);
        let d_halfCircle1 = Math.abs(
            centerOfMass[0] - halfCircle1.centerOfMass[0]
        );
        let d_halfCircle2 = Math.abs(
            centerOfMass[0] - halfCircle2.centerOfMass[0]
        );

        let I_capsule =
            I_quad +
            quad.area * d_quad * d_quad +
            I_halfCircle1 +
            halfCircle1.area * d_halfCircle1 * d_halfCircle1 +
            I_halfCircle2 +
            halfCircle2.area * d_halfCircle2 * d_halfCircle2;

        return I_capsule;
    }
}
