sex_list = ["Female", "Male"]
ch_list = ["0","typical angina","atypical angina","non-anginal pain","asymptomatic"]
google.charts.load("current", {
  packages: ["corechart", "bar", "line"]
});
google.charts.setOnLoadCallback(loadTable);


function loadTable(page) {
  $.ajax({
    url: "http://localhost:3000/slist?page=",
    type: 'GET',
    success: function (objects) {
      var trHTML = '';
      var num = 1
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td style:'text-align:center;'>" + num + "</td>";
        trHTML += "<td>" + object["ID"] + "</td>";
        trHTML += "<td>" + object["Age"] + "</td>";
        trHTML += "<td>" + [sex_list[object["Sex"]]] + "</td>";
        trHTML += "<td>" + [ch_list[object["Chest_pain_type"]]] + "</td>";
        //trHTML += "<td>" + object["Chest_pain_type"] + "</td>";
        trHTML += "<td>" + object["BP"] + "</td>";
        trHTML += "<td>" + object["Cholesterol"] + "</td>";
        trHTML += "<td>" + object["Max_HR"] + "</td>";
        trHTML += "<td>" + object["Heart_Disease"] + "</td>";
        trHTML += "<td>";
        trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showStudentUpdateBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
        trHTML += '<a type="button" class="btn btn-outline-danger" onclick="deletepopup(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
        trHTML += "<tr>";
        num++;
      }

      document.getElementById("mytable").innerHTML = trHTML;
      loadGraph();
    }
  });
}

function loadQueryTable() {
  document.getElementById("mytable").innerHTML = "<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>";
  const searchText = document.getElementById('searchTextBox').value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist/field/" + searchText);
  if (searchText == "" || searchText == null) {
    document.getElementById("mytable").innerHTML = '<tr>โปรดกรอกข้อมูลที่ต้องการค้นหา</tr>'
  } else {
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        var num = 1;
        const objects = JSON.parse(this.responseText).Complaint;
        for (let object of objects) {
          trHTML += "<tr>";
          trHTML += "<td>" + num + "</td>";
          trHTML += "<td>" + object["ID"] + "</td>";
          trHTML += "<td>" + object["Age"] + "</td>";
          trHTML += "<td>" + object["Sex"] + "</td>";
          trHTML += "<td>" + object["Chest_pain_type"] + "</td>";
          trHTML += "<td>" + object["BP"] + "</td>";
          trHTML += "<td>" + object["Cholesterol"] + "</td>";
          trHTML += "<td>" + object["EKG_results"] + "</td>";
          trHTML += "<td>" + object["Max_HR"] + "</td>";
          trHTML += "<td>" + object["Heart_Disease"] + "</td>";
          trHTML += "<td>";
          trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showStudentUpdateBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
          trHTML += '<a type="button" class="btn btn-outline-danger" onclick="deletepopup(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
          trHTML += "<tr>";
          num++;

        }
        console.log(trHTML);
        document.getElementById("mytable").innerHTML = trHTML;

      }
    }
  }
}

function loadGraph() {
  console.log("loadegraph");
  var male = 0;
  var female = 0;
  var typical = 0;
  var atypical = 0;
  var non = 0;
  var asymptomatic = 0;
  //ค่า BP
  var sumi = 0;
  var sumavg = 0;
  var sumBP = 0;
  //ค่า MaxHR
  var suma = 0;
  var sumavg1 = 0;
  var sumHR = 0;
  //ค่า Cholesterol
  var sumb = 0;
  var sumavg2 = 0;
  var sumCho = 0;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      var data = new google.visualization.DataTable();
      for (let object of objects) {
        if (object["Sex"] == "1") {
          male = male + 1
        } else {
          female = female + 1
        }

        if (object["Chest_pain_type"] == "1") {
          typical = typical + 1;
        } else if (object["Chest_pain_type"] == "2") {
          atypical = atypical + 1;
        } else if (object["Chest_pain_type"] == "3") {
          non = non + 1;
        } else {
          asymptomatic = asymptomatic + 1;
        }

        if (object["BP"] >= 0){
          sumBP += Number(object["BP"]);
          sumi += 1;
        }

        if (object["Max_HR"] >= 0){
          sumHR += Number(object["Max_HR"]);
          suma += 1;
        }

        if (object["Cholesterol"] >= 0){
          sumCho += Number(object["Cholesterol"]);
          sumb += 1;
        }
      }

      sumavg = sumBP / sumi;
      savg1 = sumavg.toFixed(2)

      sumavg1 = sumHR / suma;
      savg2 = sumavg1.toFixed(2)

      sumavg2 = sumCho / sumb;
      savg3 = sumavg2.toFixed(2)

      document.getElementById('1').innerHTML = "Average BP = "+savg1+"&nbsp;|&nbsp;Average Max HR = "+ savg2 +"&nbsp;|&nbsp;Average Cholesterol = "+savg3
    }
    //วงกลม
    var data1 = google.visualization.arrayToDataTable([
      ['Task', 'Sex'],
      ['male', male],
      ['female', female],
    ]);
    var options1 = {
      title: 'Sex',
      colors: ['#ff0000', '#ff9999'],
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data1, options1);



    //แท่ง
    var test = google.visualization.arrayToDataTable([
      ['Heart disease patients', 'Sum', { role: 'style' }],
      ['asymptomatic', asymptomatic, 'color: #CCFF66'],
      ['non-anginal pain', non, 'color: #FFFF66'],
      ['typical angina', typical, 'color: #FF3366'],
      ['atypical angina', atypical, 'color: #FF0000']

    ])

    var view = new google.visualization.DataView(test);
    view.setColumns([0, 1,
      {
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
      },
      2]);

    var optionsTimelyResponse = {
      title: "Chest pain type",
      legend: { position: "none" },
      vAxis: {
        title: "People"
      }
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('barchartSubmitted'));
    chart.draw(view, optionsTimelyResponse);

  }


}

function showStudentCreateBox() {
  var d = new Date();
  const date = d.toISOString().split('T')[0];

  Swal.fire({
    title: 'Patients Heart Disease',
    html: //'<div class="mb-3"><label for="Created_Date" class="form-label">Created Date</label>' +
      // //       '<input id="Created_Date" class="swal2-input" placeholder="Created_Date" type="hidden" value="' + date + '">' +

      '<div class="mb-3"><label for="ID" class="form-label">ID</label>' +
      '<input class="form-control" id="ID" placeholder="ID"></div>' +

      '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
      '<input class="form-control" id="Age" placeholder="Age"></div>' +

      '<div class="mb-3"><label for="Sex" class="form-label">Sex</label>' +
      '<input class="form-control" id="Sex" placeholder="Enter numbers 0 or 1 (0=Female 1=Male)"></div>' +

      '<div class="mb-3"><label for="Chest pain type" class="form-label">Chest pain type</label>' +
      '<input class="form-control" id="Chest_pain_type" placeholder="Enter numbers 1-4"></div>' +

      '<div class="mb-3"><label for="BP" class="form-label">BP</label>' +
      '<input class="form-control" id="BP" placeholder="Blood pressure"></div>' +

      '<div class="mb-3"><label for="Cholesterol" class="form-label">Cholesterol</label>' +
      '<input class="form-control" id="Cholesterol" placeholder="Cholesterol"></div>' +

      '<div class="mb-3"><label for="FBS_over_120" class="form-label">FBS over 120</label>' +
      '<input class="form-control" id="FBS_over_120" placeholder="Fasting Blood Sugar"></div>' +

      '<div class="mb-3"><label for="EKG_results" class="form-label">EKG results</label>' +
      '<input class="form-control" id="EKG_results" placeholder="Abnormal ECG value"></div>' +

      '<div class="mb-3"><label for="Max_HR" class="form-label">Max HR</label>' +
      '<input class="form-control" id="Max_HR" placeholder="Maximum heart rate"></div>' +

      '<div class="mb-3"><label for="Exercise_angina" class="form-label">Exercise angina</label>' +
      '<input class="form-control" id="Exercise_angina" placeholder="Exercise angina"></div>' +

      '<div class="mb-3"><label for="ST_depression" class="form-label">ST depression</label>' +
      '<input class="form-control" id="ST_depression" placeholder="ST depression"></div>' +

      '<div class="mb-3"><label for="Slope_of_ST" class="form-label">Slope of ST</label>' +
      '<input class="form-control" id="Slope_of_ST" placeholder="Slope of ST"></div>' +

      '<div class="mb-3"><label for="Number_of_vessels_fluro" class="form-label">Number of vessels fluro</label>' +
      '<input class="form-control" id="Number_of_vessels_fluro" placeholder="Number of vessels fluro"></div>' +

      '<div class="mb-3"><label for="Thallium" class="form-label">Thallium</label>' +
      '<input class="form-control" id="Thallium" placeholder="Thallium"></div>' +

      '<div class="mb-3"><label for="Heart_Disease" class="form-label">Heart Disease</label>' +
      '<input class="form-control" id="Heart_Disease" placeholder="Heart Disease"></div>',

    focusConfirm: false,
    preConfirm: () => {
      slistCreate();
    }
  });
}

function slistCreate() {

  // const Created_Date = document.getElementById('Created_Date').value;
  const ID = document.getElementById('ID').value;
  const Age = document.getElementById('Age').value;
  const Sex = document.getElementById('Sex').value;
  const Chest_pain_type = document.getElementById('Chest_pain_type').value;
  const BP = document.getElementById('BP').value;
  const Cholesterol = document.getElementById('Cholesterol').value;
  const FBS_over_120 = document.getElementById('FBS_over_120').value;
  const EKG_results = document.getElementById('EKG_results').value;
  const Max_HR = document.getElementById('Max_HR').value;
  const Exercise_angina = document.getElementById('Exercise_angina').value;
  const ST_depression = document.getElementById('ST_depression').value;
  const Slope_of_ST = document.getElementById('Slope_of_ST').value;
  const Number_of_vessels_fluro = document.getElementById('Number_of_vessels_fluro').value;
  const Thallium = document.getElementById('Thallium').value;
  const Heart_Disease = document.getElementById('Heart_Disease').value;
  console.log(JSON.stringify({
    // Created_Date: Created_Date,
    "ID": ID,
    "Age": Age,
    "Sex": Sex,
    "Chest_pain_type": Chest_pain_type,
    "BP": BP,
    "Cholesterol": Cholesterol,
    "FBS_over_120": FBS_over_120,
    "EKG_results": EKG_results,
    "Max_HR": Max_HR,
    "Exercise_angina": Exercise_angina,
    "ST_depression": ST_depression,
    "Slope_of_ST": Slope_of_ST,
    "Number_of_vessels_fluro": Number_of_vessels_fluro,
    "Thallium": Thallium,
    "Heart_Disease": Heart_Disease,
  }));

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/slist/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    //Created_Date: Created_Date,
    "ID": ID,
    "Age": Age,
    "Sex": Sex,
    "Chest_pain_type": Chest_pain_type,
    "BP": BP,
    "Cholesterol": Cholesterol,
    "FBS_over_120": FBS_over_120,
    "EKG_results": EKG_results,
    "Max_HR": Max_HR,
    "Exercise_angina": Exercise_angina,
    "ST_depression": ST_depression,
    "Slope_of_ST": Slope_of_ST,
    "Number_of_vessels_fluro": Number_of_vessels_fluro,
    "Thallium": Thallium,
    "Heart_Disease": Heart_Disease,
  }));

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        'Good job!',
        'Successfully created heart disease patient data.',
        'success'
      );
      loadTable();
    }
  };
}

function deletepopup(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      studentDelete(id);
      Swal.fire(
        'Deleted!',
        'Your heart disease patient Data has been deleted.',
        'success'
      )
    }
  })

}

function studentDelete(id) {
  console.log("Delete: ", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:3000/slist/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "_id": id
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        'Good job!',
        'Your heart disease patient Data has been deleted.',
        'success'
      );
      loadTable();
    }
  };
}

function showStudentUpdateBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      console.log("showStudentUpdateBox", object);
      Swal.fire({
        title: 'Update Patients Heart',
        html: '<input id="id" class="swal2-input" placeholder="ID" type="hidden" value="' + object['_id'] + '"><br>' +

          // '<div class="mb-3"><label for="Created_Date" class="form-label">Created Date</label>' +
          // '<input class="form-control" id="Created_Date" placeholder="Created_Date" value="' + object['Created_Date'] + '"></div>' +

          '<div class="mb-3"><label for="ID" class="form-label">ID</label>' +
          '<input class="form-control" id="ID" placeholder="ID" value="' + object['ID'] + '"></div>' +

          '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
          '<input class="form-control" id="Age" placeholder="Age" value="' + object['Age'] + '"></div>' +

          '<div class="mb-3"><label for="Sex" class="form-label">Sex</label>' +
          '<input class="form-control" id="Sex" placeholder="Sex" value="' + object['Sex'] + '"></div>' +

          '<div class="mb-3"><label for="Chest_pain_type" class="form-label">Chest_pain_type</label>' +
          '<input class="form-control" id="Chest_pain_type" placeholder="Chest_pain_type" value="' + object['Chest_pain_type'] + '"></div>' +

          '<div class="mb-3"><label for="BP" class="form-label">BP</label>' +
          '<input class="form-control" id="BP" placeholder="BP" value="' + object['BP'] + '"></div>' +

          '<div class="mb-3"><label for="Cholesterol" class="form-label">Cholesterol</label>' +
          '<input class="form-control" id="Cholesterol" placeholder="Cholesterol" value="' + object['Cholesterol'] + '"></div>' +

          '<div class="mb-3"><label for="FBS_over_120" class="form-label">FBS_over_120</label>' +
          '<input class="form-control" id="FBS_over_120" placeholder="FBS_over_120" value="' + object['FBS_over_120'] + '"></div>' +

          '<div class="mb-3"><label for="EKG_results" class="form-label">EKG_results</label>' +
          '<input class="form-control" id="EKG_results" placeholder="EKG_results" value="' + object['EKG_results'] + '"></div>' +

          '<div class="mb-3"><label for="Max_HR" class="form-label">Max_HR</label>' +
          '<input class="form-control" id="Max_HR" placeholder="Max_HR" value="' + object['Max_HR'] + '"></div>' +

          '<div class="mb-3"><label for="Exercise_angina" class="form-label">Exercise_angina</label>' +
          '<input class="form-control" id="Exercise_angina" placeholder="Exercise_angina" value="' + object['Exercise_angina'] + '"></div>' +

          '<div class="mb-3"><label for="ST_depression" class="form-label">ST_depression</label>' +
          '<input class="form-control" id="ST_depression" placeholder="ST_depression" value="' + object['ST_depression'] + '"></div>' +

          '<div class="mb-3"><label for="Slope_of_ST" class="form-label">Slope_of_ST</label>' +
          '<input class="form-control" id="Slope_of_ST" placeholder="Slope_of_ST" value="' + object['Slope_of_ST'] + '"></div>' +

          '<div class="mb-3"><label for="Number_of_vessels_fluro" class="form-label">Number_of_vessels_fluro</label>' +
          '<input class="form-control" id="Number_of_vessels_fluro" placeholder="Number_of_vessels_fluro" value="' + object['Number_of_vessels_fluro'] + '"></div>' +

          '<div class="mb-3"><label for="Thallium" class="form-label">Thaillim</label>' +
          '<input class="form-control" id="Thallium" placeholder="Thallium" value="' + object['Thallium'] + '"></div>' +

          '<div class="mb-3"><label for="Heart_Disease" class="form-label">Heart_Disease</label>' +
          '<input class="form-control" id="Heart_Disease" placeholder="Heart_Disease" value="' + object['Heart_Disease'] + '"></div>',

        focusConfirm: false,
        preConfirm: () => {
          studentUpdate();
        }
      });
    }
  };
}

function studentUpdate() {

  const id = document.getElementById("id").value;
  const ID = document.getElementById('ID').value;
  const Age = document.getElementById('Age').value;
  const Sex = document.getElementById('Sex').value;
  const Chest_pain_type = document.getElementById('Chest_pain_type').value;
  const BP = document.getElementById('BP').value;
  const Cholesterol = document.getElementById('Cholesterol').value;
  const FBS_over_120 = document.getElementById('FBS_over_120').value;
  const EKG_results = document.getElementById('EKG_results').value;
  const Max_HR = document.getElementById('Max_HR').value;
  const Exercise_angina = document.getElementById('Exercise_angina');
  const ST_depression = document.getElementById('ST_depression').value;
  const Slope_of_ST = document.getElementById('Slope_of_ST').value;
  const Number_of_vessels_fluro = document.getElementById('Number_of_vessels_fluro').value;
  const Thallium = document.getElementById('Thallium').value;
  const Heart_Disease = document.getElementById('Heart_Disease').value;

  console.log(JSON.stringify({
    _id: id,
    ID, Age, Sex, Chest_pain_type, BP, Cholesterol, FBS_over_120, EKG_results, Max_HR, Exercise_angina, ST_depression, Slope_of_ST, Number_of_vessels_fluro,
    Thallium, Heart_Disease
  }));


  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:3000/slist/update");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.send(JSON.stringify({
    _id: id,
    ID, Age, Sex, Chest_pain_type, BP, Cholesterol, FBS_over_120, EKG_results, Max_HR, Exercise_angina, ST_depression, Slope_of_ST, Number_of_vessels_fluro,
    Thallium, Heart_Disease
  }));



  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        'Good job!',
        'Update heart disease patient Data Successfully!',
        'success'
      );
      loadTable();
    }
  };
}