export default function Circle(radius) {
    this.radius = radius;

    this.calculateMomentOfInertia = function (mass) {
        return (mass * this.radius * this.radius) / 2;
    };
}
