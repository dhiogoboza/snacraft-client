function createCanvas(width, height, src, rotation) {
    var c = document.createElement("canvas");
    c.width = width;
    c.height = height;

    if (src !== undefined) {
        var ctx = c.getContext("2d");
        ctx.drawImage(src, 0, 0, width, height);

        if (rotation !== undefined) {
            var img = new Image();
            img.src = c.toDataURL();
            img.onload = function () {
                ctx.clearRect(0, 0, width, height);
                ctx.save();
                ctx.translate(width, height / width);
                ctx.rotate(rotation);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
            };
        }
    }

    return c;
}
