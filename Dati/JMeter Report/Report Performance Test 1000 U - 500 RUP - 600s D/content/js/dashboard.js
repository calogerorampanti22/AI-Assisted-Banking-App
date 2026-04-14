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

    var data = {"OkPercent": 98.43770913579513, "KoPercent": 1.562290864204875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9385216722674716, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9819444444444444, 500, 1500, "Dashboard Request"], "isController": false}, {"data": [0.916978589609223, 500, 1500, "Pay Bill Request"], "isController": false}, {"data": [0.9023186975826344, 500, 1500, "Deposit for Savings Goal Request"], "isController": false}, {"data": [0.977724011346571, 500, 1500, "Delete Savings Goal Request"], "isController": false}, {"data": [0.9024026512013256, 500, 1500, "Withdraw from Savings Goal Request"], "isController": false}, {"data": [0.9822175732217573, 500, 1500, "Get Phone TopUp Contact Request"], "isController": false}, {"data": [0.916187527642636, 500, 1500, "Transfer Request"], "isController": false}, {"data": [0.9827990617670055, 500, 1500, "Get Beneficiaries Request"], "isController": false}, {"data": [0.9814961880559085, 500, 1500, "Get Login History Request"], "isController": false}, {"data": [0.9821401657874905, 500, 1500, "Get Cards Request"], "isController": false}, {"data": [0.9801604993312528, 500, 1500, "Get Transaction Request"], "isController": false}, {"data": [0.9807483310045024, 500, 1500, "Add Beneficiary Request"], "isController": false}, {"data": [0.9324173190605528, 500, 1500, "Phone TopUp Request"], "isController": false}, {"data": [0.9787037037037037, 500, 1500, "Get Anagrafica Request"], "isController": false}, {"data": [0.9784685367702806, 500, 1500, "Add Card Request"], "isController": false}, {"data": [0.9796418184601255, 500, 1500, "Freeze Card Request"], "isController": false}, {"data": [0.9788629737609329, 500, 1500, "Create Savings Goal Request"], "isController": false}, {"data": [0.9907904278462654, 500, 1500, "Login Request"], "isController": false}, {"data": [0.9814272503082614, 500, 1500, "Unfreeze Card Request"], "isController": false}, {"data": [0.9813305070927768, 500, 1500, "Get Savings Goal Request"], "isController": false}, {"data": [0.33311014395714766, 500, 1500, "Application Flow"], "isController": true}, {"data": [0.9808480453972257, 500, 1500, "Delete Beneficiary Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 134482, 2101, 1.562290864204875, 102.06668550437972, 3, 2019, 200.0, 516.0, 626.0, 875.9900000000016, 224.54308965894936, 402.32318543438623, 93.18539734001877], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Dashboard Request", 6840, 0, 0.0, 82.08070175438591, 3, 1534, 9.0, 251.0, 419.0, 785.7200000000012, 11.476452299736746, 6.701911525613125, 4.164719887106273], "isController": false}, {"data": ["Pay Bill Request", 6679, 422, 6.318311124419823, 105.7691271148375, 5, 1978, 36.0, 284.0, 455.0, 794.9999999999982, 11.327653959590855, 7.211257661727318, 6.052051064967377], "isController": false}, {"data": ["Deposit for Savings Goal Request", 6081, 472, 7.761881269528038, 112.22742969906285, 4, 1490, 39.0, 294.0, 474.0, 828.7200000000012, 10.865603156224537, 3.9349716053254147, 5.251944456170398], "isController": false}, {"data": ["Delete Savings Goal Request", 5993, 0, 0.0, 113.37593859502753, 13, 1722, 41.0, 294.0, 471.0, 883.3600000000024, 10.813629539811767, 4.012870337039523, 4.23609851806542], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 6035, 467, 7.738193869096935, 111.60513670256836, 5, 1581, 39.0, 291.0, 471.1999999999998, 870.6800000000039, 10.843083424366124, 3.923015104293933, 5.241171648728116], "isController": false}, {"data": ["Get Phone TopUp Contact Request", 6214, 0, 0.0, 84.23817186997103, 3, 1451, 11.0, 258.0, 433.5, 759.4000000000015, 10.973486333471076, 15.107075621739652, 4.0892961876671015], "isController": false}, {"data": ["Transfer Request", 6783, 438, 6.457319770013268, 104.64514226743333, 5, 2019, 36.0, 276.0, 454.59999999999854, 842.0, 11.430988545418083, 7.288283128780207, 6.999343322212149], "isController": false}, {"data": ["Get Beneficiaries Request", 6395, 0, 0.0, 82.59468334636402, 4, 1225, 11.0, 243.0, 405.39999999999964, 760.2799999999997, 11.08355387785733, 9.17774040382179, 4.043777207893328], "isController": false}, {"data": ["Get Login History Request", 6296, 0, 0.0, 84.35117534942842, 4, 1560, 12.0, 254.30000000000018, 427.14999999999964, 789.2699999999977, 11.003914988814318, 65.64622405391412, 4.014609590739479], "isController": false}, {"data": ["Get Cards Request", 6635, 0, 0.0, 82.02260738507904, 4, 1661, 11.0, 241.0, 426.0, 758.2000000000016, 11.320960754571468, 20.745442636128793, 4.041993422197614], "isController": false}, {"data": ["Get Transaction Request", 6729, 0, 0.0, 86.22113241194809, 4, 1515, 12.0, 258.0, 453.5, 796.3999999999996, 11.361890305161902, 209.6101557315789, 4.134302505474948], "isController": false}, {"data": ["Add Beneficiary Request", 6441, 0, 0.0, 107.26626300263946, 13, 1521, 37.0, 289.0, 446.89999999999964, 777.5799999999999, 11.117075351367586, 6.534085484738832, 5.26982607671317], "isController": false}, {"data": ["Phone TopUp Request", 6259, 302, 4.8250519252276725, 108.93593225754884, 5, 1722, 38.0, 289.0, 456.0, 802.3999999999942, 10.984690931619026, 4.01372118361405, 5.764509477016214], "isController": false}, {"data": ["Get Anagrafica Request", 5940, 0, 0.0, 89.1430976430977, 3, 1690, 11.0, 263.0, 466.9499999999998, 797.5900000000001, 10.763326411463487, 6.8241081325855175, 3.8745504804991717], "isController": false}, {"data": ["Add Card Request", 6595, 0, 0.0, 109.49583017437455, 13, 1536, 38.0, 283.0, 463.0, 825.0, 11.302407524198635, 6.205318429693712, 4.6645242443710755], "isController": false}, {"data": ["Freeze Card Request", 6533, 0, 0.0, 107.52120006122755, 13, 1858, 38.0, 273.60000000000036, 440.0, 765.6599999999999, 11.224719467921151, 6.082451842744825, 4.335259029344403], "isController": false}, {"data": ["Create Savings Goal Request", 6174, 0, 0.0, 109.36329770003245, 12, 1722, 38.0, 289.0, 471.25, 785.0, 10.957085635285578, 5.428888947922785, 5.151284821002323], "isController": false}, {"data": ["Login Request", 6895, 0, 0.0, 158.95431472081265, 76, 1344, 122.0, 263.0, 367.0, 682.04, 11.513600074809178, 8.007824893401096, 2.963785660120029], "isController": false}, {"data": ["Unfreeze Card Request", 6488, 0, 0.0, 106.64611590628864, 14, 1873, 38.0, 284.0, 427.5499999999993, 764.0, 11.170221923798701, 6.063820443374136, 4.33599096605289], "isController": false}, {"data": ["Get Savings Goal Request", 6133, 0, 0.0, 87.78395564976348, 4, 1470, 12.0, 266.0, 439.3000000000002, 737.9799999999996, 10.932322276233206, 6.15793490484352, 3.9886315819202243], "isController": false}, {"data": ["Application Flow", 5974, 817, 13.675929025778373, 1974.2999665215934, 312, 8982, 1100.5, 5739.5, 6578.0, 7496.25, 10.74557064484216, 386.8804400828536, 93.69120775811673], "isController": true}, {"data": ["Delete Beneficiary Request", 6344, 0, 0.0, 106.80627364438854, 12, 1833, 37.0, 277.5, 441.0, 803.0, 11.05661811096355, 3.897889783259611, 4.329509800461506], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 2101, 100.0, 1.562290864204875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 134482, 2101, "400", 2101, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Pay Bill Request", 6679, 422, "400", 422, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Deposit for Savings Goal Request", 6081, 472, "400", 472, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 6035, 467, "400", 467, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Transfer Request", 6783, 438, "400", 438, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Phone TopUp Request", 6259, 302, "400", 302, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
