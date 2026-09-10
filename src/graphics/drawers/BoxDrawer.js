export class BoxDrawer {
    static draw(ctx, data) {
        // console.log("d");
        
        const halfW = data.width  * 0.5;
        const halfH = data.height * 0.5;

        // Fast path — no rotation, no scale
        if (data.rot === 0 && data.scaleX === 1 && data.scaleY === 1) {
            ctx.fillRect(
                data.x - halfW,
                data.y - halfH,
                data.width,
                data.height
            );
            return;
        }

        // Full transform path
        ctx.save();
        ctx.translate(data.x, data.y);
        if (data.rot   !== 0) ctx.rotate(data.rot);
        if (data.scaleX !== 1 || data.scaleY !== 1) ctx.scale(data.scaleX, data.scaleY);
        ctx.fillRect(-halfW, -halfH, data.width, data.height);
        ctx.restore();
    }

}