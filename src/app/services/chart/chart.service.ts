import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getDownloadData(chart:any){
    let DataList = [];
    chart.getData().then((chartdata: any) => {      
      let data = chartdata.documents;
      let fields = chartdata.fields;
      if(data && data.length > 0){
        data.forEach(obj => {          
          let modifyObj = {};
          Object.keys(fields).forEach((key) => {
            const value = fields[key];
            modifyObj[value] = obj[key];
          });
          DataList.push(modifyObj);
        });
      }
    });
    return DataList;
  }
  downloadFile(data: any,fileName:any) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
