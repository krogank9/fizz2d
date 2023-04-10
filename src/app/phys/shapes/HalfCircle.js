export default function HalfCircle(r) {
    this.radius = r;
    
    this.calculateCenterOfMass = function() {
        return [r/2, 0];
    }

    this.calculateArea = function() {
        return Math.PI * r * r / 2;
    }

    this.calculateMomentOfInertia = function(mass) {
        // The moment of inertia of a half circle with uniform density
        // is 1/8 * M * R^2, where M is the mass and R is the radius.
        return (1/8) * mass * r * r;
    }
}
