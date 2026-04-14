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

    var data = {"OkPercent": 96.59914375844976, "KoPercent": 3.400856241550248};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8809011789980347, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.875718524012609, 500, 1500, "Dashboard Request"], "isController": false}, {"data": [0.8165536591068506, 500, 1500, "Pay Bill Request"], "isController": false}, {"data": [0.8123171375125905, 500, 1500, "Deposit for Savings Goal Request"], "isController": false}, {"data": [0.92539399489132, 500, 1500, "Delete Savings Goal Request"], "isController": false}, {"data": [0.797346026251262, 500, 1500, "Withdraw from Savings Goal Request"], "isController": false}, {"data": [0.9844942748091603, 500, 1500, "Get Phone TopUp Contact Request"], "isController": false}, {"data": [0.7669487584860039, 500, 1500, "Transfer Request"], "isController": false}, {"data": [0.9831548521607278, 500, 1500, "Get Beneficiaries Request"], "isController": false}, {"data": [0.9884445289837843, 500, 1500, "Get Login History Request"], "isController": false}, {"data": [0.9683618467307241, 500, 1500, "Get Cards Request"], "isController": false}, {"data": [0.9370221890732798, 500, 1500, "Get Transaction Request"], "isController": false}, {"data": [0.9738497186362132, 500, 1500, "Add Beneficiary Request"], "isController": false}, {"data": [0.8597076051240535, 500, 1500, "Phone TopUp Request"], "isController": false}, {"data": [0.9154061760015464, 500, 1500, "Get Anagrafica Request"], "isController": false}, {"data": [0.9697268838433696, 500, 1500, "Add Card Request"], "isController": false}, {"data": [0.969981635824269, 500, 1500, "Freeze Card Request"], "isController": false}, {"data": [0.9761802370030581, 500, 1500, "Create Savings Goal Request"], "isController": false}, {"data": [0.9152914528729256, 500, 1500, "Login Request"], "isController": false}, {"data": [0.9694932049830125, 500, 1500, "Unfreeze Card Request"], "isController": false}, {"data": [0.9731754008135918, 500, 1500, "Get Savings Goal Request"], "isController": false}, {"data": [4.096977876319468E-4, 500, 1500, "Application Flow"], "isController": true}, {"data": [0.9868015002611213, 500, 1500, "Delete Beneficiary Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 443800, 15093, 3.400856241550248, 187.00126858944887, 3, 7445, 81.0, 284.90000000000146, 362.9500000000007, 562.0, 369.90885639151327, 1083.0420927736286, 153.63199885731876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Dashboard Request", 21572, 0, 0.0, 378.0982755423716, 3, 7445, 161.0, 620.0, 830.9500000000007, 1305.9900000000016, 18.009233363665963, 10.511733327141581, 6.535620664034129], "isController": false}, {"data": ["Pay Bill Request", 21385, 2996, 14.009819967266775, 205.64372223521113, 5, 2759, 129.0, 496.0, 646.0, 1022.0, 18.03638314220193, 10.94325415101433, 9.637788655401764], "isController": false}, {"data": ["Deposit for Savings Goal Request", 20849, 3184, 15.271715669816299, 176.23943594416977, 4, 2356, 95.0, 460.0, 629.0, 1099.9900000000016, 18.05833685567189, 6.383540525154694, 8.738298904549099], "isController": false}, {"data": ["Delete Savings Goal Request", 20749, 0, 0.0, 252.69531061738027, 13, 3107, 140.0, 601.0, 855.9500000000007, 1480.0, 18.044585754613113, 6.6962329948759605, 7.07706276405067], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 20799, 3171, 15.245925284869465, 213.55925765661806, 5, 2997, 116.0, 538.0, 746.9500000000007, 1315.9900000000016, 18.06099003298026, 6.371570031111117, 8.739739054448687], "isController": false}, {"data": ["Get Phone TopUp Contact Request", 20960, 0, 0.0, 94.41083015267162, 3, 1766, 36.0, 271.0, 419.0, 735.9900000000016, 18.062238890344286, 44.913383752236236, 6.731242687260003], "isController": false}, {"data": ["Transfer Request", 21506, 3081, 14.326234539198364, 322.8729656839965, 4, 5404, 174.0, 586.0, 769.0, 1257.9900000000016, 18.012132602663545, 10.890137610680895, 11.029902077716581], "isController": false}, {"data": ["Get Beneficiaries Request", 21104, 0, 0.0, 95.61533358605013, 4, 1971, 34.0, 249.0, 375.0, 647.0, 18.012374118649173, 15.13679251485526, 6.571893491723987], "isController": false}, {"data": ["Get Login History Request", 21029, 0, 0.0, 83.9040848352272, 4, 1710, 31.0, 239.0, 363.9500000000007, 667.9800000000032, 18.03217820720927, 127.28386865692471, 6.579176726107943], "isController": false}, {"data": ["Get Cards Request", 21335, 0, 0.0, 156.08333723927882, 4, 2077, 85.0, 413.90000000000146, 549.0, 906.9800000000032, 18.04829685324328, 65.34193197881578, 6.443967905585455], "isController": false}, {"data": ["Get Transaction Request", 21452, 0, 0.0, 226.6234849897457, 5, 4145, 132.0, 512.0, 678.0, 1092.0, 18.029739152067723, 697.7863381725433, 6.560622372746703], "isController": false}, {"data": ["Add Beneficiary Request", 21147, 0, 0.0, 139.77557100297932, 13, 2186, 68.0, 301.0, 419.0, 725.9900000000016, 18.0214959196613, 10.593877051194701, 8.542965307906636], "isController": false}, {"data": ["Phone TopUp Request", 20999, 2661, 12.672032001523881, 110.05757417019814, 5, 2098, 58.0, 276.0, 414.9500000000007, 732.0, 18.063624836774473, 6.432817393808785, 9.481016114649696], "isController": false}, {"data": ["Get Anagrafica Request", 20693, 0, 0.0, 264.1639201662397, 3, 3183, 138.0, 631.0, 903.0, 1504.9400000000096, 18.058893653860586, 11.44952974676488, 6.500710375409517], "isController": false}, {"data": ["Add Card Request", 21273, 0, 0.0, 165.96427396230013, 13, 2092, 96.0, 406.0, 535.0, 832.9900000000016, 18.03005942215325, 9.904253383125837, 7.4410949883588176], "isController": false}, {"data": ["Freeze Card Request", 21237, 0, 0.0, 157.85525262513505, 13, 2167, 84.0, 364.0, 485.0, 783.9900000000016, 18.033157165371446, 9.771877446580689, 6.96494935498368], "isController": false}, {"data": ["Create Savings Goal Request", 20928, 0, 0.0, 133.59432339449526, 12, 2414, 71.0, 346.0, 497.0, 842.9800000000032, 18.074739670374374, 8.964873590232058, 8.499135716222787], "isController": false}, {"data": ["Login Request", 21633, 0, 0.0, 353.52341330374884, 79, 5747, 200.0, 471.0, 673.9500000000007, 1125.0, 18.03266936521803, 12.542175338961753, 4.642009420304654], "isController": false}, {"data": ["Unfreeze Card Request", 21192, 0, 0.0, 151.60801245752964, 13, 1692, 75.0, 327.0, 446.0, 736.0, 18.015781661512094, 9.780051334871914, 6.993415095836359], "isController": false}, {"data": ["Get Savings Goal Request", 20895, 0, 0.0, 126.11318497248084, 4, 2064, 55.0, 367.0, 525.9500000000007, 901.0, 18.06874163904543, 10.431619180462153, 6.59247519763632], "isController": false}, {"data": ["Application Flow", 20747, 5624, 27.107533619318456, 3954.4306164746913, 1001, 15816, 3532.0, 5087.9000000000015, 5858.950000000001, 9895.960000000006, 17.908935218114895, 1080.7132069090794, 156.21373270270018], "isController": true}, {"data": ["Delete Beneficiary Request", 21063, 0, 0.0, 107.93647628542934, 13, 1607, 57.0, 263.0, 381.0, 646.0, 18.0107382068272, 6.349488762367792, 7.0638161956409276], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 15093, 100.0, 3.400856241550248], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 443800, 15093, "400", 15093, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Pay Bill Request", 21385, 2996, "400", 2996, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Deposit for Savings Goal Request", 20849, 3184, "400", 3184, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Withdraw from Savings Goal Request", 20799, 3171, "400", 3171, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Transfer Request", 21506, 3081, "400", 3081, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Phone TopUp Request", 20999, 2661, "400", 2661, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
