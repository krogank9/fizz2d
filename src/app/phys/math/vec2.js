var vec2 = {};

export default vec2;

vec2.rotate = function (out, v, angle) {
    var x = v[0];
    var y = v[1];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    out[0] = x * cos - y * sin;
    out[1] = x * sin + y * cos;
    return out;
};

vec2.normalize = function (out, v) {
    var len = vec2.length(v);
    if (len > 0) {
        out[0] = v[0] / len;
        out[1] = v[1] / len;
    }
    return out;
};

vec2.dot = function (v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
};

vec2.length = function (v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

vec2.squaredLength = function (v) {
    return v[0] * v[0] + v[1] * v[1];
};

vec2.squaredDistance = function (v1, v2) {
    var dx = v2[0] - v1[0];
    var dy = v2[1] - v1[1];
    return dx * dx + dy * dy;
};

vec2.distance = function (v1, v2) {
    return Math.sqrt(vec2.squaredDistance(v1, v2));
};

vec2.add = function (out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
};
vec2.sub = function (out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
};

vec2.dot = function (v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
};

vec2.scaleAndAdd = function (out, v1, v2, scale) {
    out[0] = v1[0] + v2[0] * scale;
    out[1] = v1[1] + v2[1] * scale;
    return out;
};

vec2.cross = function (v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
};

vec2.perp = function (out, v) {
    out[0] = -v[1];
    out[1] = v[0];
    return out;
};

vec2.scale = function (out, v, scale) {
    out[0] = v[0] * scale;
    out[1] = v[1] * scale;
    return out;
};

vec2.negate = function (out, v) {
    out[0] = -v[0];
    out[1] = -v[1];
    return out;
};
