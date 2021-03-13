import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');
var options = {
    url: 'http://www.nmc.cn/rest/province/all?_=1615625990208',         //请求后台的URL（*）
    // ajax : function (request) {
    //     $.ajax({
    //         type : "GET",
    //         url : "http://www.nmc.cn/rest/province/all?_=1615625990208",
    //         contentType: "application/json;charset=utf-8",
    //         dataType:"json",
    //         data:'',
    //         jsonp:'callback',
    //         success : function (msg) {
    //             request.success({
    //                 row : msg
    //             });
    //             $('#tb_departments').bootstrapTable('load', msg);
    //         },
    //         error:function(){
    //             alert("错误");
    //         }
    //     });
    // },
    method: 'get',                      //请求方式（*）
    toolbar: '#toolbar',                //工具按钮用哪个容器
    striped: true,                      //是否显示行间隔色
    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,                   //是否显示分页（*）
    sortable: false,                     //是否启用排序
    sortOrder: "asc",                   //排序方式
    // queryParams: oTableInit.queryParams,//传递参数（*）
    sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
    pageNumber: 1,                       //初始化加载第一页，默认第一页
    // pageSize: 3,                       //每页的记录行数（*）
    pageList: [5,10],        //可供选择的每页的行数（*）
    search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    showColumns: false,                  //是否显示所有的列
    showRefresh: true,                  //是否显示刷新按钮
    minimumCountColumns: 2,             //最少允许的列数
    clickToSelect: true,                //是否启用点击选中行
    // height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
    uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
    showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
    cardView: false,                    //是否显示详细视图
    detailView: false,                   //是否显示父子表
    columns: [{
        checkbox: true
    }, {
        field: 'code',
        title: '部门名称'
    }, {
        field: 'name',
        title: '描述'
    },]
    // , theadClasses: "thead-dark",//这里设置表头样式
    // classes: "table table-bordered table-striped table-sm table-dark",
};
$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $(".container"), false, true);

    $('#table').bootstrapTable(options);
});

