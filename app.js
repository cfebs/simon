// app.js

var Simon = function(el) {
    this.pattern = [];
    this.value_pool = [1, 2, 3, 4];
    this.value_els = {};
    this.el = el;
    this.accept_touch = false;

    this.streak_el = this.el.find('.js-streak_count');

    for (var i = 0; i < this.value_pool.length; i++) {
        this.value_els[this.value_pool[i]] = this.el.find('[data-simon-value=' + this.value_pool[i] + ']');
    }

    this.attachEvents();
};

Simon.prototype.attachEvents = function() {
    var self = this;

    self.el.on('click', '.js-simon_panel', function() {
        if (self.accept_touch === false) {
            return;
        }

        var is_correct = self.testTouchedEl(self.touch_count, $(this));

        if (!is_correct) {
            self.lose();
            return;
        }

        if (self.touch_count == (self.pattern.length - 1)) {
            self.accept_touch = false;
            setTimeout(self.advanceTurn.bind(self), 1000);
            return;
        }

        self.touch_count++;
    });

    self.el.on('mousedown', '.js-simon_panel', function() {
        if (self.accept_touch === false) {
            return;
        }

        $(this).addClass('lit');
    })
    .on('mouseup', '.js-simon_panel', function() {
        var el = $(this);
        if (self.accept_touch === false) {
            return;
        }

        setTimeout(function() {
            el.removeClass('lit');
        }, 100);
    });
};

Simon.prototype.startGame = function() {
    this.pattern = [];
    this.accept_touch = true;
    this.advanceTurn();
};

Simon.prototype.lose = function() {
    this.accept_touch = false;
    alert('you lose');
}

Simon.prototype.advanceTurn = function() {
    this.touch_count = 0;
    this.pattern.push(this.value_pool[_.random(0, this.value_pool.length - 1)]);
    this.updateStreak(this.pattern.length - 1);
    this.playPattern();
};

Simon.prototype.playPattern = function() {
    var self = this;

    this.accept_touch = false;
    this.lightPanel(0);
}

Simon.prototype.lightPanel = function(i) {
    var self = this,
        value,
        el;

    value = self.pattern[i];

    if (value === undefined) {
        self.el.find('.lit').removeClass('lit');
        self.accept_touch = true;
        return;
    }

    el = self.value_els[value];

    el.addClass('lit');

    setTimeout(function() {
        el.removeClass('lit');
        setTimeout(function() {
            self.lightPanel(i + 1);
        }, 300);
    }, 700);
}

Simon.prototype.updateStreak = function(touch_number) {
    this.streak_el.text(touch_number);
}

Simon.prototype.testTouchedEl = function(touch_number, el) {
    return this.pattern[touch_number] == el.data('simonValue');
}

$(function() {
    window.GAME = new Simon($('.js-simon'));

    $('.js-start_game').on('click', function() {
        window.GAME.startGame();
    });
});
