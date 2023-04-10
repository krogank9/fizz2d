import Circle from "../shapes/Circle";
import Capsule from "../shapes/Capsule";
import Plane from "../shapes/Plane";
import vec2 from "../math/vec2";

const collisionTypeIndex = [
    [Circle, Plane, circlePlane],
    [Capsule, Plane, capsulePlane],
];


export function getContactPointsAndMTV(out, bodyA, bodyB) {
    let cType = collisionTypeIndex.filter(
        (cType) =>
            cType.includes(bodyA.shape.constructor) &&
            cType.includes(bodyB.shape.constructor)
    )[0];

    out = { bodyA, bodyB };

    if (cType) {
        // Normalize so order is always the same for things like circlePlane
        if (cType[0] !== bodyA.shape.constructor) {
            let tmp = out.bodyA;
            out.bodyA = out.bodyB;
            out.bodyB = tmp;
        }

        let [mtv, contactPoints] = cType[2](
            out.bodyA,
            out.bodyB
        );

        out = {...out, mtv, contactPoints}
    }
    else {
        throw new Error(`Collison behavior undefined for ${bodyA.shape.constructor.name} and ${bodyB.shape.constructor.name}`)
    }

    return out;
}

function circlePlane(circle, plane) {
    const circlePos = circle.position;
    const planePos = plane.position;
    const planeNormal = { x: 0, y: 1 }; // The normal of the flat plane (points upwards)

    const circleProj = circlePos[1] - circle.radius; // Project the circle onto the plane normal
    const planeProj = planePos[1]; // Project the plane onto the plane normal
    const overlap = circleProj - planeProj; // Calculate the overlap between the circle and the plane

    if (overlap > 0) {
        // No overlap, return null
        return [null, []];
    }

    //console.log(overlap)

    // Calculate the MTV
    const mtvLen = -overlap;
    const mtv = [0, mtvLen];
    const contactPoint = [circle.position[0], circle.position[1] - circle.radius];

    return [mtv, [contactPoint]];
}

function capsulePlane(capsule, plane) {
    const length = capsule.shape.length / 2; // Half the length of the capsule

    // Calculate the positions of the two circles based on the rotation
    const circle1Pos = [capsule.position[0] - length, capsule.position[1]];
    const circle2Pos = [capsule.position[0] + length, capsule.position[1]];
    const rotatedCircle1Pos = vec2.rotate([], circle1Pos, capsule.rotation);
    const rotatedCircle2Pos = vec2.rotate([], circle2Pos, capsule.rotation);

    const circle1 = {
        position: rotatedCircle1Pos,
        radius: capsule.shape.radius1,
    };
    const circle2 = {
        position: rotatedCircle2Pos,
        radius: capsule.shape.radius2,
    };

    const [mtv1, contactPoints1] = circlePlane(circle1, plane);
    const [mtv2, contactPoints2] = circlePlane(circle2, plane);

    let contactPoints = [...contactPoints1, ...contactPoints2]
    let greatestMtv = vec2.squaredLength(mtv1 || [0,0]) > vec2.squaredLength(mtv2 || [0,0]) ? mtv1 : mtv2;

    return [greatestMtv, contactPoints]
}
