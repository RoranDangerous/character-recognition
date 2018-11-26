const utils = require('./utils');

class NeuralNetwork{
	constructor(net_arch){
		this.activity = utils.tanh;
		this.activity_derivative = utils.tanh_derivative;
		this.layers = net_arch.length;
		this.steps_per_epoch = 1000;
		this.arch = net_arch;
		this.weights = [];

		for(var layer = 0; layer < this.layers-1; layer++){
			var w = utils.rand(net_arch[layer] + 1, net_arch[layer+1]);
			this.weights.push(w);
		}
	}

	fit(data, labels, learning_rate=0.1, epochs=100){
		// Adding bias to each input
		var ones = utils.ones(1, data.length);
		var Z = utils.concatenate(utils.transpose(ones), data);
		
		var training = epochs*this.steps_per_epoch
		for(var k = 0; k < training; k++){
			// Choosing random input for the forward propagation
			var sample = Math.floor((Math.random() * data.length));
			var y = [Z[sample]];

			this.forward_propagation(y);

			var delta_vec = this.backward_propagation(labels[sample], y);

			delta_vec.reverse();

			this.update_weights(y, delta_vec);
		}
	}

	predict_single_data(x){
		var result = utils.concatenate(utils.transpose(utils.ones(1)), x);

		for(var i = 0 ; i < this.weights.length; i++){
			result = this.activity(result.dot(this.weights[i]));
			result = utils.concatenate(utils.transpose(utils.ones(1)), result);
		}

		return result[1];
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
		var error = expected_result - y[y.length-1];
		var delta_vec = [this.activity_derivative(y[y.length-1]).multiply(error)];

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
			var delta_weights = utils.transpose(layer).dot(delta).multiply(learning_rate);
			this.weights[i].add(delta_weights);
		}
	}
}

var nn = new NeuralNetwork([2,2,1])

var X = [[0, 0], [0, 1],[1, 0], [1, 1]]

var y = [0, 1, 1, 0]

nn.fit(X, y, learning_rate=0.1, epochs=10)

console.log("Final prediction")
X.forEach(s => console.log(s, nn.predict_single_data(s)));

module.exports = NeuralNetwork;