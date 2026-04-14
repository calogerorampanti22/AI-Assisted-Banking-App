/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.4322541511866, "KoPercent": 8.567745848813406};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8788957966374911, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9869984417608103, 500, 1500, "Dashboard Request"], "isController": false}, {"data": [0.6324899480239287, 500, 1500, "Pay Bill Request"], "isController": false}, {"data": [0.6192744223753547, 500, 1500, "Deposit for Savings Goal Request"], "isController": false}, {"data": [0.9858509771986971, 500, 1500, "Delete Savings Goal Request"], "isController": false}, {"data": [0.6184504467912266, 500, 1500, "Withdraw from Savings Goal Request"], "isController": false}, {"data": [0.9881395115086944, 500, 1500, "Get Phone TopUp Contact Request"], "isController": false}, {"data": [0.6346153846153846, 500, 1500, "Transfer Request"], "isController": false}, {"data": [0.9871692858563755, 500, 1500, "Get Beneficiaries Request"], "isController": false}, {"data": [0.9868526294741051, 500, 1500, "Get Login History Request"], "isController": false}, {"data": [0.9856496953017495, 500, 1500, "Get Cards Request"], "isController": false}, {"data": [0.9860105654470749, 500, 1500, "Get Transaction Request"], "isController": false}, {"data": [0.9853130892130595, 500, 1500, "Add Beneficiary Request"], "isController": false}, {"data": [0.6466225696532372, 500, 1500, "Phone TopUp Request"], "isController": false}, {"data": [0.9866904640489547, 500, 1500, "Get Anagrafica Request"], "isController": false}, {"data": [0.9842903575297941, 500, 1500, "Add Card Request"], "isController": false}, {"data": [0.9853333333333333, 500, 1500, "Freeze Card Request"], "isController": false}, {"data": [0.9867042707493956, 500, 1500, "Create Savings Goal Request"], "isController": false}, {"data": [0.9890173972203324, 500, 1500, "Login Request"], "isController": false}, {"data": [0.9849549638721172, 500, 1500, "Unfreeze Card Request"], "isController": false}, {"data": [0.9873584142394822, 500, 1500, "Get Savings Goal Request"], "isController": false}, {"data": [0.3867453934643184, 500, 1500, "Application Flow"], "isController": true}, {"data": [0.985839648982848, 500, 1500, "Delete Beneficiary Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 211024, 18080, 8.567745848813406, 44.38930642960064, 3, 3447, 23.0, 1005.9000000000015, 1189.0, 1559.0, 176.11354109029426, 958.6706546422338, 73.13587319405046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Dashboard Request", 10268, 0, 0.0, 29.709485781067396, 3, 2208, 5.0, 7.0, 9.0, 933.4799999999959, 8.588278689141616, 5.005569033841648, 3.1166304887970973], "isController": false}, {"data": ["Pay Bill Request", 10197, 3657, 35.863489261547514, 45.3167598313229, 4, 2463, 17.0, 30.0, 44.0, 1026.0600000000013, 8.572343704157046, 4.451320606820969, 4.579473176958327], "isController": false}, {"data": ["Deposit for Savings Goal Request", 9868, 3675, 37.24158897446291, 41.17288204296724, 4, 2194, 17.0, 29.0, 41.0, 984.3099999999995, 8.486083699891214, 2.7849513880826766, 4.1052618389596205], "isController": false}, {"data": ["Delete Savings Goal Request", 9824, 0, 0.0, 49.66734527687298, 12, 1805, 21.0, 33.0, 52.0, 1042.5, 8.49826989619377, 3.1536548442906573, 3.3329664184147925], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 9848, 3669, 37.256295694557274, 43.85499593826155, 4, 2165, 17.0, 29.0, 41.0, 1041.0, 8.487635700471266, 2.7698765544254123, 4.106097217116876], "isController": false}, {"data": ["Get Phone TopUp Contact Request", 9949, 0, 0.0, 28.69032063523969, 4, 2416, 6.0, 8.0, 11.0, 911.0, 8.513882874849601, 41.287373257687655, 3.1728599712723846], "isController": false}, {"data": ["Transfer Request", 10244, 3644, 35.57204217102694, 45.832877782116405, 4, 2194, 18.0, 31.0, 43.0, 1044.0, 8.594075088256218, 4.408990631638093, 5.261022536795796], "isController": false}, {"data": ["Get Beneficiaries Request", 10054, 0, 0.0, 30.011637159339568, 3, 2181, 5.0, 7.0, 10.0, 941.4500000000007, 8.558045149774303, 7.4365545140730225, 3.1224270908434706], "isController": false}, {"data": ["Get Login History Request", 10002, 0, 0.0, 30.839932013597274, 4, 2249, 6.0, 8.0, 11.0, 920.9399999999987, 8.533124939213643, 83.62560551743908, 3.1133537803889135], "isController": false}, {"data": ["Get Cards Request", 10174, 0, 0.0, 32.92982111264009, 4, 2213, 7.0, 9.0, 12.0, 938.0, 8.56249552897017, 68.99728986554298, 3.057104453250912], "isController": false}, {"data": ["Get Transaction Request", 10222, 0, 0.0, 36.21893954216393, 4, 2092, 10.0, 14.0, 19.0, 964.0, 8.583424300948863, 698.1926549773281, 3.1232558162419175], "isController": false}, {"data": ["Add Beneficiary Request", 10077, 0, 0.0, 51.425225761635446, 12, 2269, 22.0, 33.0, 47.0, 1055.4399999999987, 8.55001807238116, 5.018889794481814, 4.05297375251783], "isController": false}, {"data": ["Phone TopUp Request", 9978, 3435, 34.425736620565246, 43.865504109039925, 4, 1944, 18.0, 30.0, 44.0, 1022.0, 8.525297783063724, 2.816885423528643, 4.473577894162589], "isController": false}, {"data": ["Get Anagrafica Request", 9805, 0, 0.0, 29.466904640489492, 3, 2225, 5.0, 6.0, 9.0, 923.880000000001, 8.491280091866903, 5.383524959968443, 3.0566035656340014], "isController": false}, {"data": ["Add Card Request", 10153, 0, 0.0, 53.36107554417405, 12, 2280, 22.0, 33.0, 49.0, 1107.4599999999991, 8.555312501053299, 4.700017466323938, 3.5307729149848996], "isController": false}, {"data": ["Freeze Card Request", 10125, 0, 0.0, 52.594864197530846, 5, 3447, 22.0, 33.0, 47.0, 1090.4799999999996, 8.543164708840509, 4.629357864362811, 3.2995246269379277], "isController": false}, {"data": ["Create Savings Goal Request", 9928, 0, 0.0, 47.38789282836424, 12, 2160, 21.0, 31.0, 45.0, 1008.1299999999974, 8.5102516473183, 4.219918801480036, 4.0006211932417735], "isController": false}, {"data": ["Login Request", 10289, 0, 0.0, 105.82894353192737, 75, 1455, 88.0, 106.0, 121.0, 691.0, 8.588287242274173, 5.973168051773874, 2.2107018195332824], "isController": false}, {"data": ["Unfreeze Card Request", 10103, 0, 0.0, 52.60358309413043, 12, 2338, 22.0, 33.0, 49.0, 1061.9599999999991, 8.55028529161356, 4.641569913424448, 3.318987493525717], "isController": false}, {"data": ["Get Savings Goal Request", 9888, 0, 0.0, 29.958029935275093, 3, 2821, 5.0, 7.0, 10.0, 939.4400000000023, 8.491161480629108, 5.1662030956822855, 3.0980169685832175], "isController": false}, {"data": ["Application Flow", 9823, 5853, 59.584648274457905, 600.5797617835698, 272, 13370, 391.0, 461.0, 503.0, 9472.28, 8.51499464291287, 959.2047036964117, 74.26776385279452], "isController": true}, {"data": ["Delete Beneficiary Request", 10028, 0, 0.0, 49.60071798962904, 12, 2210, 21.0, 31.0, 46.0, 1036.4199999999983, 8.544729032054663, 3.0123507622770833, 3.3512384339832773], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 18080, 100.0, 8.567745848813406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 211024, 18080, "400", 18080, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Pay Bill Request", 10197, 3657, "400", 3657, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Deposit for Savings Goal Request", 9868, 3675, "400", 3675, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 9848, 3669, "400", 3669, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Transfer Request", 10244, 3644, "400", 3644, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Phone TopUp Request", 9978, 3435, "400", 3435, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
