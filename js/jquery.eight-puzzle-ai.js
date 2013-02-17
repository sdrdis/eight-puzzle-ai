$.widget("jquery.eightPuzzleAi", {
    options: {
        size: 3
    },
    instances: {
        cells: []
    },
    cells: [],
    blankCell: {i: 0, j: 0},

    _create: function() {
        this._initCells();
        this.randomCells();
        this.displayCells();
    },

    randomCells: function() {
        var i;
        var arrayToBeShuffled = [];
        for (i = 0; i < this.options.size * this.options.size; i++) {
            arrayToBeShuffled.push(i);
        }
        var shuffledArray = this.shuffle(arrayToBeShuffled);

        for (i = 0; i < this.options.size; i++) {
            for (var j = 0; j < this.options.size; j++) {
                this.cells[i][j] = shuffledArray[i * this.options.size + j];
            }
        }
    },

    displayCells: function() {
        for (var i = 0; i < this.options.size; i++) {
            for (var j = 0; j < this.options.size; j++) {
                this.instances.cells[i][j].text(this.cells[i][j] == 0 ? ' ' : this.cells[i][j]);
                if (this.cells[i][j] == 0) {
                    this.blankCell = {i: i, j: j};
                }
            }
        }
    },

    _initCells: function() {
        for (var i = 0; i < this.options.size; i++) {
            var $row = $('<tr></tr>');
            var instancesRow = [];
            var row = [];
            for (var j = 0; j < this.options.size; j++) {
                var $cell = $('<td class="cell"></td>');
                instancesRow.push($cell);
                $cell.appendTo($row);
            }
            $row.appendTo(this.element);
            this.cells.push(row);
            this.instances.cells.push(instancesRow);
        }
    },

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    // found at http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    shuffle: function(o){ //v1.0
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
});