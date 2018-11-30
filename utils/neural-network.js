const utils = require('./utils');

class NeuralNetwork{
	constructor(arg){
		if(typeof arg == "string"){
			this.loadFromFile(arg);
			return;
		}
		
		this.loadFromShape(arg);
	}

	loadFromFile(filePath){
		utils.loadFromFile(filePath, (data) => {
			var data = JSON.parse(data);
			this.loadFromShape(data.shape, data.weights);
		});
	}

	loadFromShape(shape, weights=undefined){
		this.activity = utils.sigmoid;
		this.activity_derivative = utils.sigmoid_derivative;
		this.layers = shape.length;
		this.steps_per_epoch = 1000;
		this.arch = shape;
		this.weights = [];

		if(weights == undefined){
			for(var layer = 0; layer < this.layers-1; layer++){
				var w = utils.rand(shape[layer] + 1, shape[layer+1]);
				this.weights.push(w);
			}
		}
		else{
			this.weights = weights;
		}
	}

	fit(data, labels, learning_rate=0.1, epochs=100, filePath=undefined){
		this.learning_rate = learning_rate;

		var Z = this.addBias(data);

		var episodes = epochs*this.steps_per_epoch

		for(var k = 0; k < episodes; k++){
			// Choosing random input for the forward propagation
			var sample = Math.floor((Math.random() * data.length));
			var y = [Z[sample]];

			this.forward_propagation(y);

			var delta_vec = this.backward_propagation(labels[sample], y);

			delta_vec.reverse();

			this.update_weights(y, delta_vec);
		}

		if(filePath){
			utils.saveToFile(filePath, JSON.stringify({shape:this.arch, weights:this.weights}));
		}
	}

	fitByIndex(data, labels, learning_rate=0.1, epochs=100, filePath=undefined){
		this.learning_rate = learning_rate;

		var episodes = epochs*this.steps_per_epoch

		for(var k = 0; k < episodes; k++){
			if(k % 100 == 0){
				console.log("Episode: "+k+"/"+episodes);
			}
			// Choosing random input for the forward propagation
			var sample = Math.floor((Math.random() * labels.length));

			var image = [Array.prototype.slice.call(data, (sample * 28 * 28), (sample+1)*28*28).divide(255)];
			
			var y = this.addBias(image);

			this.forward_propagation(y);

			//var expected_result = utils.numberToBinArray(labels[sample], this.arch[this.arch.length-1]);
			var expected_result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			expected_result[labels[sample]] = 1;

			var delta_vec = this.backward_propagation(expected_result, y);

			delta_vec.reverse();

			this.update_weights(y, delta_vec);
		}
		
		if(filePath){
			utils.saveToFile(filePath, JSON.stringify({shape:this.arch, weights:this.weights}));
		}
	}

	addBias(data){
		var ones = utils.ones(1, data.length);
		return utils.concatenate(utils.transpose(ones), data);
	}

	forward_propagation(y){
		for(var i = 0; i < this.weights.length; i++){
			var activation = y[i].dot(this.weights[i]);
			var activity = this.activity(activation);

			if(i != this.weights.length - 1){
				// Add the bias for the next layer
				activity = utils.concatenate(utils.ones(1), activity);
			}
			y.push(activity);
		}
	}

	backward_propagation(expected_result, y){
		var result = (expected_result.length == undefined ? [expected_result] : expected_result).slice(0)
		var error = result.subtract(y[y.length-1]);
		var delta_vec = [error.multiply(this.activity_derivative(y[y.length-1]))];

		for(var i = this.layers-2; i > 0; i--){
			error = delta_vec[delta_vec.length-1].dot(utils.transpose(this.weights[i].slice(1)));
			var derivative = this.activity_derivative(y[i].slice(1));
			error.multiply(derivative);
			delta_vec.push(error);
		}

		return delta_vec;
	}

	update_weights(y, delta_vec){
		for(var i = 0; i < this.weights.length; i++){
			var layer = [y[i]];
			var delta = [delta_vec[i]]
			var delta_weights = utils.transpose(layer).dot(delta).multiply(this.learning_rate);
			this.weights[i].add(delta_weights);
		}
	}

	predict_single_data(x){
		x = x.divide(255);
		var result = utils.concatenate(utils.transpose(utils.ones(1)), x);

		for(var i = 0 ; i < this.weights.length; i++){
			result = this.activity(result.dot(this.weights[i]));
			result = utils.concatenate(utils.transpose(utils.ones(1)), result);
		}

		return result.slice(1);
	}
}

module.exports = NeuralNetwork;