export default function World() {
    this.bodies = [];
}

World.prototype.step = function () {
    this.bodies[0].position[1] = 2;
};
