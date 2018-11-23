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

	// fit(data, labels, learning_rate=0.1, epochs=100){
	// 	var ones = ones(1, data.length);
	// 	var Z = concatenate((transpose(ones), data))
		
	// 	var training = epochs*this.steps_per_epoch
	// 	for(var k = 0; k < training; k++){
	// // #             if k % self.steps_per_epoch == 0:
	// // #                 print('epochs: {}'.format(k/self.steps_per_epoch))
	// // #                 print(self.weights[0][0][0], ' ',self.weights[0][1][0], ' ',self.weights[0][2][0])
	// // #                 print(self.weights[0][0][1], ' ',self.weights[0][1][1], ' ',self.weights[0][2][1])
	// // #                 for s in data:
	// // #                     print(s, nn.predict_single_data(s))
		
	// 		// # We will now go ahead and set up our feed-forward propagation:
	// 		var sample = Math.random(data.length)
	// 		var y = [Z[sample]]
	// 		for(var i = 0; i < this.weights.length-1; i++){
	// 			activation = dot(y[i], this.weights[i])
	// 			activity = this.activity(activation)

	// 			// # add the bias for the next layer
	// 			activity = numpy.concatenate((numpy.ones(1), numpy.array(activity)))
	// 			y.push(activity)
	// 		}
	// 		// # last layer
	// 		activation = numpy.dot(y[-1], self.weights[-1])
	// 		activity = self.activity(activation)
	// 		y.append(activity)


	// 		// # Now we do our back-propagation of the error to adjust the weights:
	// 		error = labels[sample] - y[-1]
	// 		delta_vec = [error * self.activity_derivative(y[-1])]

	// 		// # we need to begin from the back, from the next to last layer
	// 		for(var i = this.layers-2; i >= 0, i--){
	// 			error = delta_vec[-1].dot(self.weights[i][1:].T)
	// 			error = error*self.activity_derivative(y[i][1:])
	// 			delta_vec.push(error)
	// 		}
	// 		// # Now we need to set the values from back to front
	// 		delta_vec.reverse()

	// 		// # Finally, we adjust the weights, using the backpropagation rules
	// 		for(var i = 0; i < this.weights.length; i++){
	// 			layer = y[i].reshape(1, nn.arch[i]+1)
	// 			delta = delta_vec[i].reshape(1, nn.arch[i+1])
	// 			self.weights[i] += learning_rate*layer.T.dot(delta)
	// 		}
	// 	}
	// }
}

module.exports = NeuralNetwork;