/*==================================================================
=            BarChart Of Number Of Product Each Catgory            =
==================================================================*/

    var eachCategoryProducts = JSON.parse($('#eachCategoryProducts').text());
    var labels = [];
    var data = [];
    for (var i = 0; i < eachCategoryProducts.length; i++) {
          labels.push(eachCategoryProducts[i].name);
          data.push(eachCategoryProducts[i].number_of_product);
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

/*=====  End of BarChart Of Number Of Product Each Catgory  ======*/



/*=============================================
=            Order Per Month Chart            =
=============================================*/

var perDayOrder = JSON.parse($('#perDayOrder').text());

var labels = [];
var data = [];

let orderJan = 0,orderFeb = 0,orderMar = 0,orderApr = 0,orderMay = 0,orderJune = 0,orderJly = 0,orderAug = 0,orderSep = 0,orderOct = 0,orderNov = 0,orderDec = 0;

$.each(perDayOrder, function(index,value) {
    switch (value._id.month) {
        case 1:
            orderJan = orderJan + parseInt(value.count)
            break;
        case 2:
            orderFeb = orderFeb + parseInt(value.count)
            break;
        case 3:
            orderMar = orderMar + parseInt(value.count)
            break;
        case 4:
            orderApr = orderApr + parseInt(value.count)
            break;
        case 5:
            orderMay = orderMay + parseInt(value.count)
            break;
        case 6:
            orderJune = orderJune + parseInt(value.count)
            break;
        case 7:
            orderJly = orderJly + parseInt(value.count)
            break;
        case 8:
            orderAug = orderAug + parseInt(value.count)
            break;
        case 9:
            orderSep = orderSep + parseInt(value.count)
            break;
        case 10:
            orderOct = orderOct + parseInt(value.count)
            break;
        case 11:
            orderNov = orderNov + parseInt(value.profit)
            break;
        case 12:
            OrderDec = profitDec + parseInt(value.profit)
            break;
        default:
            // statements_def
            break;
    }
});

data = [orderJan,orderFeb,orderMar,orderApr,orderMay,orderJune,orderJly,orderAug,orderSep,orderOct,orderNov,orderDec];

var ctx2 = document.getElementById('lineChart').getContext('2d');
var myLineChart = new Chart(ctx2, {
    type: 'line',
    data: {
        datasets: [{
            data: data,
            fill: false,
            borderColor: "#070707",
            borderDash: [5, 5],
            backgroundColor: "#070707",

        }],
        labels: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Nov','Dec'],

    },
    options: {
       legend: {
          display: false,
        },
        scales: {
            xAxes: [{
               ticks: {
                  fontColor: "#070707", // this here
                },
            }],
            yAxes: [{
                ticks: {
                  fontColor: "#070707", // this here
                },
            }],
        }
   }

});
/*=====  End of Order Per Month Chart  ======*/



/*==============================================
=            Product Quantity Chart            =
==============================================*/

var eachProductQuantity = JSON.parse($('#eachProductQuantity').text());
    var labels = [];
    var data = [];
    for (var i = 0; i < eachProductQuantity.length; i++) {
          labels.push(eachProductQuantity[i].name);
          data.push(eachProductQuantity[i].quantity);
    }

    var ctx = document.getElementById('myChart2').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#070707", // this here
                    }
                }],
                xAxes: [{
                  beginAtZero: true,
                  ticks: {
                     autoSkip: false,
                     fontColor: "#070707", // this here
                  }
                }]
            }
        }
    });


/*=====  End of Product Quantity Chart  ======*/




/*============================================
=            Profit Per Day Chart            =
============================================*/

var perMonthProfit = JSON.parse($('#perMonthProfit').text());

var data = [];

let profitJan = 0,profitFeb = 0,profitMar = 0,profitApr = 0,profitMay = 0,profitJune = 0,profitJly = 0,profitAug = 0,profitSep = 0,profitOct = 0,profitNov = 0,profitDec = 0;

$.each(perMonthProfit, function(index,value) {
    switch (value.month) {
        case 1:
            profitJan = profitJan + parseInt(value.profit)
            break;
        case 2:
            profitFeb = profitFeb + parseInt(value.profit)
            break;
        case 3:
            profitMar = profitMar + parseInt(value.profit)
            break;
        case 4:
            profitApr = profitApr + parseInt(value.profit)
            break;
        case 5:
            profitMay = profitMay + parseInt(value.profit)
            break;
        case 6:
            profitJune = profitJune + parseInt(value.profit)
            break;
        case 7:
            profitJly = profitJly + parseInt(value.profit)
            break;
        case 8:
            profitAug = profitAug + parseInt(value.profit)
            break;
        case 9:
            profitSep = profitSep + parseInt(value.profit)
            break;
        case 10:
            profitOct = profitOct + parseInt(value.profit)
            break;
        case 11:
            profitNov = profitNov + parseInt(value.profit)
            break;
        case 12:
            profitDec = profitDec + parseInt(value.profit)
            break;
        default:
            // statements_def
            break;
    }
});

console.log(profitJan,profitFeb,profitMar,profitApr,profitMay,profitJune,profitJly,profitAug,profitSep,profitOct,profitNov,profitDec)

data = [profitJan,profitFeb,profitMar,profitApr,profitMay,profitJune,profitJly,profitAug,profitSep,profitOct,profitNov,profitDec];

var ctx = document.getElementById('pieChart').getContext('2d');

var data = {
    datasets: [{
        data: data,
        backgroundColor: [
              "#ff0000",
              "#006600",
              "#000099",
              "#3399ff",
              "#996600",
              "#660033",
              "#993300",
              "#cc00ff",

              "#ffff66",
              "#00ff00",
              "#00ffff",
              "#cccc00"
         ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Nov','Dec']
};

var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
        legend: {
            labels: {
                fontColor: "black",
                fontSize: 10
            }
        },
    }
});

/*=====  End of Profit Per Day Chart  ======*/
