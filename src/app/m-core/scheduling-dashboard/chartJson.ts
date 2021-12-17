export const chardData =[
    {
        classGrid:'col-lg-4 col-md-6 mb-4',
        title:'Line Chart',
        objType:'lineChart',
        type:'line',
        datasets:[
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
          ],
        labels:['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        colors:[
            {
              backgroundColor: 'rgba(105, 0, 132, .2)',
              borderColor: 'rgba(200, 99, 132, .7)',
              borderWidth: 2,
            },
            {
              backgroundColor: 'rgba(0, 250, 220, .2)',
              borderColor: 'rgba(0, 213, 132, .7)',
              borderWidth: 2,
            }
          ],
        options:{
            responsive: true
          },
        legend:true
    },
    {
        classGrid:'col-lg-4 col-md-6 mb-4',
        title:'Radar Chart',
        objType:'radarChart',
        type:'radar',
        datasets:[
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
          ],
        labels:['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        colors:[
            {
              backgroundColor: 'rgba(105, 0, 132, .2)',
              borderColor: 'rgba(200, 99, 132, .7)',
              borderWidth: 2,
            },
            {
              backgroundColor: 'rgba(0, 250, 220, .2)',
              borderColor: 'rgba(0, 213, 132, .7)',
              borderWidth: 2,
            }
          ],
        options:{
            responsive: true
          },
        legend:true
    },
    {
        classGrid:'col-lg-4 col-md-6 mb-4',
        title:'Doughnut Chart',
        objType:'doughnutChart',
        type:'doughnut',
        datasets:[
            { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
          ],
        labels:['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'],
        colors:[
            {
              backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
              hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
              borderWidth: 2,
            }
          ],
        options:{
            responsive: true
          },
        legend:true
    },
    {
        classGrid:'col-lg-6 col-md-6 mb-4',
        title:'Pie Chart',
        objType:'pieChart',
        type:'pie',
        datasets:[
            { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
          ],
        labels:['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'],
        colors:[
            {
              backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
              hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
              borderWidth: 2,
            }
          ],
        options:{
            responsive: true
          },
        legend:true
    },
    {
        classGrid:'col-lg-6 col-md-6 mb-4',
        title:'Bar Chart',
        objType:'barChart',
        type:'bar',
        datasets:[
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
          ],
        labels:['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        colors:[
            {
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 2,
            }
          ],
        options:{
            responsive: true
          },
        legend:true
    }
]
export const tableData = [
    {
        tableGrid:'col-md-4 mb-4',
        tableClass:'table table-hover',
        tableTheadClass:'blue-grey lighten-4',
        tableGridColumnHeading:[
            {label:'Lorem',name:'lorem'},
            {label:'Ipsum',name:'ipsum'},
            {label:'Dolor',name:'dolor'}
        ],
        tableGridData:[
            {lorem:'Cell 1',ipsum:'Cell 2',dolor:'Cell 3'},
            {lorem:'Cell 4',ipsum:'Cell 5',dolor:'Cell 6'},
            {lorem:'Cell 7',ipsum:'Cell 8',dolor:'Cell 9'},
            {lorem:'Cell 10',ipsum:'Cell 11',dolor:'Cell 12'},
        ]
    },
    {
        tableGrid:'col-md-4 mb-4',
        tableClass:'table table-hover',
        tableTheadClass:'blue lighten-4',
        tableGridColumnHeading:[
            {label:'Lorem',name:'lorem'},
            {label:'Ipsum',name:'ipsum'},
            {label:'Dolor',name:'dolor'}
        ],
        tableGridData:[
            {lorem:'Cell 1',ipsum:'Cell 2',dolor:'Cell 3'},
            {lorem:'Cell 4',ipsum:'Cell 5',dolor:'Cell 6'},
            {lorem:'Cell 7',ipsum:'Cell 8',dolor:'Cell 9'},
            {lorem:'Cell 10',ipsum:'Cell 11',dolor:'Cell 12'},
        ]
    }
]
export const progressReportData =[
    {
        grid:'col-xl-3 col-md-6 my-4',        
        iconBgColor:'primary-color',        
        progress:90,
        progressValue:'9/10',
        progressLabel:'Better than last week',
        progressColor:'bg-danger',
        time:'-120min',
        jid:152412541252,
        parameter:['Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1'],
        status:'In-Progress',
        statusColor:'text-warning'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',
        
        iconBgColor:'warning-color',
       
        parameter:['Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1'],
        progress:40,
        progressValue:'4/10',
        progressLabel:'Better than last week',
        progressColor:'bg grey darken-2',
        time:'-120min',
        jid:152412541252,
        status:'Error',
        statusColor:'text-danger'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',        
        iconBgColor:'light-blue lighten-1',        
        progress:50,
        progressValue:'5/10',
        progressLabel:'Better than last week',
        progressColor:'bg-success',
        time:'-120min',
        jid:152412541252,
        parameter:['Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1'],
        status:'Complited',
        statusColor:'text-success'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',        
        iconBgColor:'red accent-2',        
        progress:60,
        progressValue:'6/10',
        progressLabel:'Better than last week',
        progressColor:'bg-success',
        time:'-120min',
        jid:152412541252,
        parameter:['Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1 ,','Parameter1'],
        status:'start',
        statusColor:'text-white'
    }
]
export const reportData =[
    {
        grid:'col-xl-3 col-md-6 my-4',
        icon:'fa-money-bill-alt',
        iconBgColor:'primary-color',
        name:'SALES',
        value:'$2000',
        progress:25,
        progressLabel:'Better than last week',
        progressColor:'bg grey darken-2'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',
        icon:'fa-chart-line',
        iconBgColor:'warning-color',
        name:'SUBSCRIPTIONS',
        value:'200',
        progress:25,
        progressLabel:'Better than last week',
        progressColor:'bg grey darken-2'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',
        icon:'fa-chart-pie',
        iconBgColor:'light-blue lighten-1',
        name:'TRAFFIC',
        value:'20000',
        progress:75,
        progressLabel:'Better than last week',
        progressColor:'grey darken-2'
    },
    {
        grid:'col-xl-3 col-md-6 my-4',
        icon:'fa-chart-bar',
        iconBgColor:'red accent-2',
        name:'ORGANIC TRAFFIC',
        value:'2000',
        progress:25,
        progressLabel:'Better than last week',
        progressColor:'bg grey darken-2'
    }
]