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
        this.ia.resolve({cells: this.cells, blankCell: this.blankCell});
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

        this.cells = [
            [7, 2, 4],
            [5, 0, 6],
            [8, 3, 1]
        ];
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
    },

    ia: {
        finalCells: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ],
        size: 3,

        resolve: function(initialState) {
            initialState.heuristic = this.heuristic(initialState.cells);
            initialState.nbRound = 0;
            initialState.previousState = {cost: 0};
            initialState.cost = initialState.heuristic;

            var statesList = {};
            this.addStateToList(initialState, statesList);
            var alreadyExploredStates = {};
            var nbExplored = 0;
            while (true) {
                var state;
                do {
                    state = this.getStateFromList(statesList);
                    if (state === false) {
                        alert('IMPOSSIBLE');
                        return;
                    }
                } while(typeof alreadyExploredStates[state.cells] != 'undefined');
                alreadyExploredStates[state.cells] = true;
                nbExplored++;

                if (nbExplored % 1000 == 0) {
                    console.log(nbExplored);
                }
                //console.log(state.nbRound, state.cost, state.cells, alreadyExploredStates);
                if (state.heuristic < 5) {
                    console.log(state.heuristic);
                }

                if (this.isFinalState(state)) {
                    alert('FOUND');
                    console.log(state);
                    return state;
                }

                var nextStates = this.nextStates(state);
                for (var i = 0; i < nextStates.length; i++) {
                    this.addStateToList(nextStates[i], statesList);
                }
            }
        },

        isFinalState: function(state) {
            return state.heuristic == 0;
        },

        getStateFromList: function(statesList) {
            for (var cost in statesList) {
                var state = statesList[cost][0];
                statesList[cost].splice(0, 1);
                if (statesList[cost].length == 0) {
                    delete statesList[cost];
                }
                return state;
            }
            return false;
        },

        addStateToList: function(state, statesList) {
            if (typeof statesList[state.cost] === 'undefined') {
                statesList[state.cost] = [];
            }
            statesList[state.cost].push(state);
        },

        nextStates: function(state) {
            var states = [];

            if (state.blankCell.i > 0) {
                states.push(this.newStateMoving(state, -1, 0));
            }

            if (state.blankCell.j > 0) {
                states.push(this.newStateMoving(state, 0, -1));
            }

            if (state.blankCell.i < this.size - 1) {
                states.push(this.newStateMoving(state, 1, 0));
            }

            if (state.blankCell.j < this.size - 1) {
                states.push(this.newStateMoving(state, 0, 1));
            }

            return states;
        },

        newStateMoving: function(state, i, j) {
            var newState = $.extend(true, {}, state);
            var tmp = newState.cells[state.blankCell.i + i][state.blankCell.j + j];
            newState.cells[state.blankCell.i + i][state.blankCell.j + j] = newState.cells[state.blankCell.i][state.blankCell.j];
            newState.cells[state.blankCell.i][state.blankCell.j] = tmp;

            newState.blankCell.i += i;
            newState.blankCell.j += j;

            newState.previousState = state;

            newState.heuristic = this.heuristic(newState.cells);
            newState.nbRound = state.nbRound + 1;
            newState.cost = newState.heuristic + newState.nbRound;

            return newState;
        },

        heuristic: function(cells) {
            var currentPH = this.positionsHash(cells);
            var finalPH = this.positionsHash(this.finalCells);
            var cost = 0;
            for (var i in currentPH) {
                cost += Math.abs(currentPH[i].i - finalPH[i].i) + Math.abs(currentPH[i].j - finalPH[i].j);
            }
            return cost;
        },

        positionsHash: function(cells) {
            var positionsHash = {};
            for (var i = 0; i < cells.length; i++) {
                for (var j = 0; j < cells[i].length; j++) {
                    if (cells[i][j] != 0) {
                        positionsHash[cells[i][j]] = {i: i, j: j};
                    }
                }
            }
            return positionsHash;
        }
    }
});