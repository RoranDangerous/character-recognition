const utils = require('./utils');

class NeuralNetwork{
	constructor(net_arch){
		this.activity = utils.sigmoid;
		this.activity_derivative = utils.sigmoid_derivative;
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
	}

	fitByIndex(data, labels, learning_rate=0.1, epochs=100){
		this.learning_rate = learning_rate;

		var episodes = epochs*this.steps_per_epoch

		for(var k = 0; k < episodes; k++){
			if(k % 100 == 0)
				console.log("Episode: "+k+"/"+episodes);
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
		var result = utils.concatenate(utils.transpose(utils.ones(1)), x);

		for(var i = 0 ; i < this.weights.length; i++){
			result = this.activity(result.dot(this.weights[i]));
			result = utils.concatenate(utils.transpose(utils.ones(1)), result);
		}

		return result.slice(1);
	}
}

class NeuralNetwork2{
	fit(X, y){
		X = X.divide(255);
		var digits = 10;
		var examples = y.shape()[0];
		X = X.reshape([examples, 784])
		y = y.reshape([1, examples]);
		var Y_new = utils.eye(digits, y);
		Y_new = utils.transpose(Y_new).reshape([digits, examples])

		var m = 45;
		var m_test = X.shape()[0] - m;

		var X_train = utils.transpose(X.slice(0, m));
		var X_test = utils.transpose(X.slice(m));
		var Y_train = [];
		var Y_test = [];
		for(var i = 0; i < Y_new.length; i++){
			Y_train.push(Y_new[i].slice(0, m));
			Y_test.push(Y_new[i].slice(m));
		}

		var n_x = X_train.shape()[0];
		var n_h = 64;
		var learning_rate = 1;

		var W1 = utils.rand(n_h, n_x);
		var b1 = utils.zeros([n_h, 1]);
		var W2 = utils.rand(digits, n_h);
		var b2 = utils.zeros([digits, 1]);

		X = X_train;
		var Y = Y_train;

		for(var i = 0; i < 1; i++){
			var Z1 = W1.dot(X).add(b1);
			var A1 = utils.sigmoid(Z1);
			var Z2 = W2.dot(A1).add(b2);
			var A2 = utils.softmax(Z2);

			var cost = this.compute_multiclass_loss(Y, A2);

			var dZ2 = A2.subtract(Y);
			var dW2 = dZ2.dot(utils.transpose(A1)).multiply(1/m);
			var db2 = []
			for(var j = 0; j < dZ2.length; j++){
				db2.push([dZ2[j].sum()].multiply(1/m));
			}
			
			var dA1 = utils.transpose(W2).dot(dZ2);
			var dZ1 = dA1.multiply(utils.sigmoid_derivative(Z1));

			var dW1 = dZ1.mult(utils.transpose(X)).multiply(1/m);
			console.log(dZ1.shape())
			console.log(utils.transpose(X).shape())
			console.log(dW1)
			var db1 = []
			for(var j = 0; j < dZ1.length; j++){
				db1.push([dZ1[j].sum()].multiply(1/m));
			}
			//console.log(db1);

			W2 = W2.subtract(dW2.multiply(learning_rate));
			b2 = b2.subtract(db2.multiply(learning_rate));
			W1 = W1.subtract(dW1.multiply(learning_rate));
			b1 = b1.subtract(db1.multiply(learning_rate));

			if( i % 10 == 0){
				console.log("Epoch "+i+" cost: "+ cost);
			}
		}
		console.log("Final cost: "+cost);
	}

	compute_multiclass_loss(Y, Y_hat){
		var L_sum = Y.multiply(utils.log(Y_hat)).sum();
		var m = Y.shape()[1];
		var L = L_sum * -(1/m);

		return L;
	}
}

module.exports = NeuralNetwork2;