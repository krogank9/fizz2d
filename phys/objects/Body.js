let id = 0;

export default function Body({ shape, position = [0,0], rotation = 0 }) {
    this.id = id++;
    this.shape = shape;
    this.position = position;
    this.rotation = rotation;
}
