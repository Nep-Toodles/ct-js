color-input
    .color-input-aPicker(style="background-color: {value};" onclick="{openPicker}")
        span(style="color: {dark? '#fff' : '#000'};") {value}
    color-picker(
        ref="colorPicker" if="{opened}"
        color="{value}" onapply="{applyColor}" oncancel="{cancelColor}"
    )
    script.
        this.opened = false;
        this.openPicker = e => {
            this.opened = !this.opened;
        };
        this.value = this.lastValue = this.opts.value || '#FFFFFF'; 
        this.applyColor = color => {
            this.value = color;
            this.dark = this.refs.colorPicker.dark;
            if (this.opts.onapply) {
                this.opts.onapply(value);
            }
            if (this.opts.onchange) {
                this.opts.onchange({
                    target: this
                }, this.value);
            }
            this.opened = false;
            this.update();
        };
        this.cancelColor = () => {
            this.opened = false;
            this.update();
        };
        this.on('update', () => {
            if (this.lastValue != this.opts.value) {
                this.value = this.lastValue = this.opts.value;
            }
        });