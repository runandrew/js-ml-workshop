
//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype.train = function(arrTrainingData) {
    this.points = this.points.concat(arrTrainingData);
}

KNN.prototype._distance = function(V1, V2) {
    return Math.pow((V1.reduce((a, b, index) => {
        b = Math.pow((V2[index] - V1[index]), 2);
        return a + b;
    }, 0)), 0.5);
};

KNN.prototype._distances = function(V1, arrTrainingData) {
    return arrTrainingData.map((trainingData) => {
        var distance = this._distance(V1, trainingData[0]);
        return [distance, trainingData[1]];
    });
};

KNN.prototype._sorted = function(arrData) {
    return arrData.sort(function(a, b) {
        return a[0] - b[0];
    }).map((el) => {
        return el[1];
    });
};

KNN.prototype._majority = function(k, arr) {
    var counts = {};
    for (var i = 0; i <= k; i++) {
        var key = arr[i];
        if (counts[key]) {
            counts[key] = counts[key] + 1;
        } else {
            counts[key] = 1;
        }
    }

    var mostCommon = [null, null];
    for (var classification in counts) {
        if (counts[classification] > mostCommon[1]) {
            mostCommon = [classification, counts[classification]];
        }
    }

    return +mostCommon[0];
}

KNN.prototype.predictSingle = function(V1) {
    var distances = this._distances(V1, this.points);
    var sorted = this._sorted(distances);
    var majority = this._majority(this.kSize, sorted);
    return majority;
};

KNN.prototype.predict = function(arrVectors) {
    return arrVectors.map((vector) => this.predictSingle(vector));
};

KNN.prototype.score = function(validationData) {
    var validationVectors = [];
    var validationClassifications = [];
    validationData.forEach((data) => {
        validationVectors.push(data[0])
        validationClassifications.push(data[1]);
    });

    var algoResults = this.predict(validationVectors);

    var scores = algoResults.map((el, index) => {
        return el === validationClassifications[index] ? 1 : 0;
    });

    return scores.reduce((a, b) => (a + b), 0) / algoResults.length;
}

module.exports = KNN
