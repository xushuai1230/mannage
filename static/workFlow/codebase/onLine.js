var uique = []
$.fn.workflowList = function (options) {
  if (options) {
    if ($('#showLeftInfo').val() != null && $('#showrightInfo').val() != null) {
      arr.push({
        "From": $('#showLeftInfo').val(),
        "To": $('#showrightInfo').val(),
        "Format": ""
      })
    } else {
      alert('请选择字段')
    }
  }
  uique = JSON.parse(JSON.stringify(arr));
  for (let i = 0; i < leftData.length; i++) {
    for (let j = 0; j < uique.length; j++) {
      if (leftData[i].PropertyValueMap.EngCode == uique[j].From) {
        uique[j].From = leftData[i].PropertyValueMap.ShowCode
      }
    }
  }
  for (let i = 0; i < rightData.length; i++) {
    for (let j = 0; j < uique.length; j++) {
      if (rightData[i].PropertyValueMap.EngCode == uique[j].To) {
        uique[j].To = rightData[i].PropertyValueMap.ShowCode
      }
    }  
  }
  // console.log(arr,uique) 
  var temp = [];
  var newTemp = []
  function removeRepeat(array,newarr) {
    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (var j = 0; j < newarr.length; j++) {
        if (array[i].From == newarr[j].From && array[i].To == newarr[j].To) {
           flag=false
        }
      };
      if (flag) {
        newarr.push(array[i])
      };
    };
    return newarr
  }
  temp =removeRepeat(uique,temp); 
  arr = removeRepeat(arr,newTemp)


  $('#workTable').off().on('click',function(e){
    var target = e.target || e
    let i = target.getAttribute("id")
    if(target.getAttribute("class") == 'detele') {
      temp.splice(i, 1)
      arr.splice(i,1)
      var id = localStorage.getItem('rightId')
      var nodeList = $.parseJSON(localStorage.getItem('data'))
      for (let j = 0; j < nodeList.workFlowData.length; j++) {
        if (nodeList.workFlowData[j].id == id) {
          nodeList.workFlowData[j].DataMap.PropertyValueMap = arr
        }
      }
      localStorage.setItem('data', JSON.stringify(nodeList))
    }
    workList()
    });
  workList()
  function workList() {
    $('#workTable').empty()
    for (let i = 0; i < temp.length; i++) {
      var s = "<tr><td>" + temp[i].From + "</td><td>" + temp[i].To + "</td><td><a class='detele' id=" + i + ">删除</a></td></tr>"
      $('#workTable').append(s)
    }
  }
}
