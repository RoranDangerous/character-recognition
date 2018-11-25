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
		var ones = utils.ones(1, data.length);
		var Z = utils.concatenate(utils.transpose(ones), data)
		
		var training = epochs*this.steps_per_epoch
		for(var k = 0; k < training; k++){
	// #             if k % self.steps_per_epoch == 0:
	// #                 print('epochs: {}'.format(k/self.steps_per_epoch))
	// #                 print(self.weights[0][0][0], ' ',self.weights[0][1][0], ' ',self.weights[0][2][0])
	// #                 print(self.weights[0][0][1], ' ',self.weights[0][1][1], ' ',self.weights[0][2][1])
	// #                 for s in data:
	// #                     print(s, nn.predict_single_data(s))
		
			// # We will now go ahead and set up our feed-forward propagation:
			var sample = Math.floor((Math.random() * data.length));
			var y = [Z[sample]]
			for(var i = 0; i < this.weights.length-1; i++){
				var activation = utils.multiply(y[i], this.weights[i])
				var activity = this.activity(activation)

				// # add the bias for the next layer
				activity = utils.concatenate(utils.ones(1), activity)
				y.push(activity)
			}
			// # last layer
			var activation = utils.multiply(y[y.length-1], this.weights[this.weights.length-1])
			var activity = this.activity(activation)
			y.push(activity)


			// # Now we do our back-propagation of the error to adjust the weights:
			var error = labels[sample] - y[y.length-1]
			var delta_vec = [this.activity_derivative(y[y.length-1]).map(function(el){ return el * error })]

			// # we need to begin from the back, from the next to last layer
			for(var i = this.layers-2; i > 0; i--){
				error = utils.multiply(delta_vec[delta_vec.length-1], utils.transpose(this.weights[i].slice(1)));
				var derivative = this.activity_derivative(y[i].slice(1));
				for(var k2 = 0; k2 < derivative.length; k2++){
					error[k2] *= derivative[k2];
				}
				delta_vec.push(error)
			}
			// # Now we need to set the values from back to front
			delta_vec.reverse()

			// # Finally, we adjust the weights, using the backpropagation rules
			for(var i = 0; i < this.weights.length; i++){
				var layer = [y[i]];
				var delta = [delta_vec[i]]
				var arr = utils.multiply(utils.transpose(layer), delta)
				for(var w = 0; w < arr.length; w++){
					for(var w2 = 0; w2 < arr[0].length; w2++){
						arr[w][w2] *= learning_rate;
					}
				}
				for(var w = 0; w < this.weights[i].length; w++){
					for(var w2 = 0; w2 < this.weights[i][w].length; w2++){
						this.weights[i][w][w2] += arr[w][w2];
					}
				}
			}
		}
	}

	predict_single_data(x){
		var result = utils.concatenate(utils.transpose(utils.ones(1)), x);

		for(var i = 0 ; i < this.weights.length; i++){
			result = this.activity(utils.multiply(result, this.weights[i]));
			result = utils.concatenate(utils.transpose(utils.ones(1)), result);
		}

		return result[1];
	}
}

var nn = new NeuralNetwork([2,2,1])

var X = [[0, 0], [0, 1],[1, 0], [1, 1]]

var y = [0, 1, 1, 0]

nn.fit(X, y, learning_rate=0.1, epochs=10)

console.log("Final prediction")
for(s in X){
	console.log(X[s], nn.predict_single_data(X[s]))
}

module.exports = NeuralNetwork;