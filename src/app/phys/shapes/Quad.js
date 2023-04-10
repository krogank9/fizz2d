export default function Quad(x1, x2, x3, x4, y1, y2, y3, y4) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.x4 = x4;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.y4 = y4;

    this.calculateCenterOfMass = function () {
        let x = (x1 + x2 + x3 + x4) / 4;
        let y = (y1 + y2 + y3 + y4) / 4;
        return [x, y];
    };

    this.calculateArea = function () {
        let area1 = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2;
        let area2 = Math.abs((x4 - x1) * (y3 - y1) - (x3 - x1) * (y4 - y1)) / 2;
        return area1 + area2;
    };

    this.calculateMomentOfInertia = function (mass) {
        let a = this.x2 - this.x1;
        let b = this.y2 - this.y1;
        let h = Math.sqrt(a * a + b * b);

        let I1 =
            (mass / 12) *
            (h * h + b * b + h * b + (y1 + y2) * (y1 * y2 - y1 * y2));
        let I2 =
            (mass / 12) *
            (h * h + b * b + h * b + (y3 + y4) * (y3 * y4 - y3 * y4));

        return I1 + I2;
    };
}