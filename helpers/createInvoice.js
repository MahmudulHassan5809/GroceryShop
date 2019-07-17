const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require('path');
const _ = require('underscore');
const moment = require('moment');


module.exports = function(order,user,path){
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc);
	generateCustomerInformation(doc, order,user);
	generateInvoiceTable(doc, order);
	generateFooter(doc);

	doc.end();
	doc.pipe(fs.createWriteStream(path));
}


function generateHeader(doc) {
  doc
    .image(path.join(__dirname, '../public/admin/img/logo.png'), 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Shamme Grocery Inc.", 110, 57)
    .fontSize(10)
    .text("1409 Main Street", 200, 65, { align: "right" })
    .text("Dhaka,Bangladesh,1207", 200, 80, { align: "right" })
    .moveDown();
}


function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}


function generateCustomerInformation(doc, order,user) {
  //const shipping = invoice.shipping;
  let balanceDue = 0;
  let due;
  for(let j = 0; j < _.size(order.order); j++){
  		if(!order.ispaid){
	  		balanceDue += order.order[j].qty * order.order[j].price
	  	}
  }

  if(balanceDue > 0){
  	due = balanceDue;
  }else{
  	due = 0;
  }

  doc
    .font(path.join(__dirname, '../public/admin/fonts/kalpurush.ttf'))
    .text(`Order Id: ${order.id}`, 50, 220)
    .text(`Invoice Number: ${order.invoice}`, 50, 235)
    .text(`Invoice Date: ${moment().format("MMM Do YY")}`, 50, 250)
    .text(`Balance Due: ${due}`, 50, 130)

    .text(`Customer Name : ${user.name}`, 300, 130)
    .text(`Phone Number : ${user.phone}`, 300, 150)
    .text(
      `Address: ${user.address}`,
      300,
      170
    )
    .text(
      `Email: ${user.email}`,
      300,
      190
    )
    .moveDown();
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}


function generateInvoiceTable(doc,order) {
  let i,
    invoiceTableTop = 330;
  generateTableRow(
        doc,
        invoiceTableTop,
        'Title',
        'Category',
        'Price',
        'Quantity',
        'Total'
  );
  for (i = 0; i <_.size(order.order); i++) {
    const item = order.order[i];
    const position = invoiceTableTop + (i + 1) * 30;

    generateTableRow(
        doc,
        position,
        item.title,
        item.category,
        item.price,
        item.qty,
        item.price * item.qty
    );


  }
}
