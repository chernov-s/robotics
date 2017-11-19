/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Initialize

(function() {

    // Configs

    var BACKGROUND_COLOR      = 'rgba(255, 255, 255, 1)',
        BLUE_COLOR            = 'rgba(1, 53, 66, 1)',
        ORANGE_COLOR          = 'rgba(160, 104, 17, 1)',
        PARTICLE_RADIUS       = 1;

    // Vars

    var canvas, context,
        bufferCvs, bufferCtx,
        screenWidth, screenHeight,
        particles = [],
        grad,
        control,
        colors = [BLUE_COLOR, ORANGE_COLOR],
        center = new Vector();


    // Event Listeners

    function resize(e) {
        screenWidth  = canvas.width  = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;
        bufferCvs.width  = screenWidth;
        bufferCvs.height = screenHeight;
        context   = canvas.getContext('2d');
        bufferCtx = bufferCvs.getContext('2d');
        center.set(screenWidth/2, screenHeight/2);

        var cx = canvas.width * 0.5,
            cy = canvas.height * 0.5;

        grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    }

    // Functions

    function addParticle(num) {
        var i, p;
        for (i = 0; i < num; i++) {
            p = new Particle(
                center.x,
                center.y,
                PARTICLE_RADIUS,
                colors[Utils.randomInt(0, colors.length - 1)]
            );
            p.addSpeed(Vector.random());
            particles.push(p);
        }
    }

    function removeParticle(num) {
        if (particles.length < num) num = particles.length;
        for (var i = 0; i < num; i++) {
            particles.pop();
        }
    }


    // GUI Control

    control = {
        particleNum: 200,
        countRoute: 360
    };


    // Init

    canvas  = document.getElementById('c');
    bufferCvs = document.createElement('canvas');

    window.addEventListener('resize', resize, false);
    resize(null);

    addParticle(control.particleNum);

    // Start Update

    var loop = function() {
        var i, len, p;

        context.save();
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.fillStyle = grad;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        bufferCtx.save();
        bufferCtx.globalCompositeOperation = 'destination-out';
        bufferCtx.globalAlpha = 0.35;
        bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
        bufferCtx.restore();

        len = particles.length;
        bufferCtx.save();
        bufferCtx.lineCap = bufferCtx.lineJoin = 'round';
        bufferCtx.lineWidth = PARTICLE_RADIUS * 2;
        bufferCtx.beginPath();
        for (i = 0; i < len; i++) {
            p = particles[i];
            p.update();
            p.render(bufferCtx);
        }

        context.drawImage(bufferCvs, 0, 0);

        requestAnimationFrame(loop);
    };
    loop();

})();


