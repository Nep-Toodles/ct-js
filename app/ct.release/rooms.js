/* global Copy */

(function () {
    var nextRoom;
    ct.rooms = {
        templates: {},
        addBg(graph, depth) {
            var canv = document.createElement('canvas'),
                g = ct.res.graphs[graph];
            canv.width = g.width;
            canv.height = g.height;
            canv.x = canv.getContext('2d');
            canv.x.drawImage(g.atlas, g.frames[0][0], g.frames[0][1], g.width, g.height, 0, 0, g.width, g.height);
            var pat = ct.x.createPattern(canv, 'repeat');
            var copy = new Copy('BACKGROUND');
            copy.pattern = pat;
            copy.depth = depth;
            ct.room.backgrounds.push(copy);
            ct.stack.push(copy);
            return copy;
        },
        addTileLayer(layer) {
            var copy = new Copy('TILELAYER');
            copy.depth = layer.depth;
            copy.tiles = layer.tiles;
            ct.room.tileLayers.push(copy);
            ct.stack.push(copy);
            return copy;
        },
        make() { // utility: not for regular use
            const created = [];
            for (let i = 0, li = this.bgs.length; i < li; i++) {
                created.push(ct.rooms.addBg(this.bgs[i].graph, this.bgs[i].depth));
            }
            for (let i = 0, li = this.tiles.length; i < li; i++) {
                created.push(ct.rooms.addTileLayer(this.tiles[i]));
            }
            for (let i = 0, li = this.objects.length; i < li; i++) {
                var copy = ct.types.make(this.objects[i].type, this.objects[i].x, this.objects[i].y);
                if (this.objects[i].tx) {
                    copy.tx = this.objects[i].tx;
                }
                if (this.objects[i].ty) {
                    copy.ty = this.objects[i].ty;
                }
                created.push(copy);
            }
            return created;
        },
        clear() {
            ct.stack = [];
            ct.types.list = { };
        },
        'switch'(room) {
            nextRoom = room;
            ct.rooms.switching = true;
        },
        switching: false,
        forceSwitch(room) {
            room = room || nextRoom;
            if (ct.room) {
                ct.room.onLeave();
                ct.rooms.onLeave.apply(ct.room);
            }
            ct.stack = [];
            for (var i in ct.types.list) {
                ct.types.list[i] = [];
            }
            ct.rooms.current = ct.room = ct.rooms.templates[room];
            ct.room.backgrounds = [];
            ct.room.tileLayers = [];
            ct.room.uid = 0;
            ct.room.x = ct.room.y = ct.room.follow = ct.room.borderx = ct.room.bordery = 0;
            ct.rooms.make.apply(ct.room);
            ct.width = ct.room.width;
            ct.height = ct.room.height;
            /*@pixelatedrender@*/
            ct.room.onCreate();
            ct.rooms.onCreate.apply(ct.room);
            /*%switch%*/
            ct.rooms.switching = false;
        },
        onCreate() {
            /*%roomoncreate%*/
        },
        onLeave() {
            /*%roomonleave%*/
        },
        starting: '@startroom@'
    };
})();

/*@rooms@*/