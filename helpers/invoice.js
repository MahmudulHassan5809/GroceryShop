const fs = require('fs');
const moment = require('moment');

const path = require('path');
const _ = require('underscore');

const jsPDF = require('jsPDF');



module.exports = function(order,user){
	const items = [];
	let balance = 0;
  	let paid;
	for (i = 0; i <_.size(order.order); i++) {
		const item = order.order[i];
		items.push({name: item.title, description: item.category, quantity: item.qty, rate: item.price,total: item.qty * item.price})

	  	balance += item.qty * item.price

	}

	if(order.ispaid){
  		paid = balance;
	}else{
	  	paid = 0;
	}



	const location = path.join(__dirname, '../public/invoice/');
	invoice.generatePDFStream(input).pipe(fs.createWriteStream(`${location}${user.phone}.pdf`));




}
