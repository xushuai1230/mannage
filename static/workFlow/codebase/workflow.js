$(document).ready(function () {
  //获取用户信息下拉框
  function Tenant() {
    var data = {
      "Name": "TMP_CstInformation",
      "Properties": [
        "Id",
        "Code",
        "Name"
      ],
      "SortCondition": {
        "CreateTime": "DESC"
      },
      "PageSize": 1000,
      "DefaultVal": "SearchAll"
    };
    var str = JSON.stringify(data);
    $.ajax({
      url: Yukon.StaticUrl.Bus,
      type: "post",
      dataType: 'json',
      data: {
        "name": Yukon.ServiceName.Tenant,
        "operation": "GetJsonData",
        "token": token,
        "reqInfo": str
      },
      success: function (returnValue) {
        var data = returnValue;
        var datas = data.data;
        for (var i = 0; i < datas.length; i++) {
          html = "<option value=" + datas[i].PropertyValueMap.Id + ">" + datas[i].PropertyValueMap.Name +
            "</option>";
          $("#Tenant").append(html);
          $("#ToTenant").append(html);
        }
      },
      error: function (returnValue) {
        alert("对不起！数据加载失败！");
      }
    });
  }
  Tenant();
  //撤销按钮关闭当前页面 
  $('.back').click(function () {
    window.parent.iframeClose();
  })
  $('.hidPair').click(function () {
    $('#test').css("display", "none")
    $('.cover').css("display", "none")
  })
  $('.getPair').click(function () {
    if ($('#Tenant').val() == "-请选择-" || $('#ToTenant').val() == "-请选择-" || $('#select1').val() == "-请选择-" || $('#select2').val() == "-请选择-") {
      alert("请选择列表！")
    } else {
      $('#test').css("display", "none")
      $(".cover").hide();

      var data = {}
      data.Bill = $('#select1').val()
      data.ToBill = $('#select2').val()
      data.TriggerState = $('#select4').val()
      data.Tenant = $('#Tenant').val()
      data.ToTenant = $('#ToTenant').val()
      data.id = localStorage.getItem('rightId')
      data.DataMap = {}
      // console.log(arr)
      data.DataMap.PropertyValueMap = arr
      var workData = $.parseJSON(localStorage.getItem('data')).workFlowData
      if (workData.length > 0) {
        for (let i = 0; i < workData.length; i++) {
          if (data.id == workData[i].id) {
            nodeList.workFlowData[i] = data
          } else {
            nodeList.workFlowData.push(data)
          }
        }
      } else {
        nodeList.workFlowData.push(data)
      }
      localStorage.setItem('data', JSON.stringify(nodeList))
    }
    // console.log(data,nodeList)
  })
});

