import {metrique} from './carte.js'

 export default function buildGoogleChart() {
    //let metrique = {total:0, accepte:0, refuse:0}

    google.charts.load('current', {'packages':['corechart','bar']});
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
            // let accept = document.getElementById('chart_div').dataset.accept
            // let refuse = document.getElementById('chart_div').dataset.refuse
            
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            // console.log(accept)
            
            data.addRows([
                ['accepté', metrique.refuse],
                ['refusé', metrique.accepte]
            ]);
            
            // Set chart options
            var options = {'title':'Stats des idées',
            'colors':['#ce0033', '#198754'],
            'width':400,
            'height':250,
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'white',
            },
        };
        
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
  }