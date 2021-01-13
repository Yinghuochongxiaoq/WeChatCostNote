function Grid(size) {
    this.size = size;
    this.cells = this.empty();
}

Grid.prototype = {
    empty: function () {
        var cells = [];
        for (var x = 0; x < this.size; x++) {
            var row = cells[x] = [];
            for (var y = 0; y < this.size; y++) {
                row.push(null);
            }
        }
        return cells;
    },
    /**
     * 在空格子中随机挑选出一个格子
     */
    randomAvailableCell: function () {
        var cells = this.availableCells();
        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    },
    /**
     * 获取可填充的格子坐标
     */
    availableCells: function () {
        var cells = [];

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {

                // 当前格子无内容
                if (!this.cells[i][j]) {
                    cells.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        return cells;
    },
    /**
     * 是否存在空单元格
     */
    cellsAvailable: function () {
        return !!this.availableCells().length;
    },
    /* 
     * 获取单元格内容
     * @param {object} cell {x:0,y:0} 单元格坐标
     */
    cellContent: function (cell) {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y] || null;
        } else {
            return null;
        }
    },
    /**
     * 插入值
     * @param {object} tile 
     */
    insertTile: function (tile) {
        this.cells[tile.x][tile.y] = tile;
    },
    /**
     * 删除值
     * @param {object} tile 
     */
    removeTile: function (tile) {
        this.cells[tile.x][tile.y] = null;
    },
    /*
     * 空单元格，格子还未填充数字
     */
    emptyCell: function (cell) {
        return !this.cellContent(cell);
    },
    /**
     * 判断是否在边界内
     * @param {object} cell 
     */
    withinBounds: function (cell) {
        return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
    },
    eachCell: function (callback) {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }
};

module.exports = Grid;