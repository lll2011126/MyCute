import windowControl from "../../../common/custom/windowControl.js";
import dbUtil from "../../../common/custom/dbUtil.js";
import ipcRendererUtil from "../../../common/custom/ipcRendererUtil.js";

const path = require('path');
const {remote} = require('electron');

var tableName = 'planTable';
var columns = [
    {
        checkbox: true
    },
    {
        field: 'tableId',
        title: '序号',
        width: 50,
        formatter: function (value, row, index) {
            return index + 1;
        }
    },
    {
        field: 'title',
        title: '标题',
        width: 150,
        editable: true
    },
    {
        field: 'content',
        title: '内容',
        width: 600,
        editable: true
    },
    {
        field: 'createDate',
        title: '创建时间',
        width: 150
    },
    {
        field: 'updateDate',
        title: '更新时间',
        width: 150
    },
    {
        field: 'operate',
        title: '操作',
        width: 100,
        formatter: function (value, row, index) {
            return [
                '<button name="edit" type="button" class="btn btn-primary btn-xs">进入</button>',
                '<button name="detail" type="button" class="btn btn-primary btn-xs">详情</button>'
            ].join("&nbsp;&nbsp;");
        }
    }
];
var options = {
    // url: 'http://www.nmc.cn/rest/province/all?_=1615625990208',         //请求后台的URL（*）
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
    data: dbUtil.getAllByTableName(tableName),
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
    pageList: [5, 10],        //可供选择的每页的行数（*）
    search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: false,                //严格搜索
    showColumns: false,                  //是否显示所有的列
    showRefresh: true,                  //是否显示刷新按钮
    minimumCountColumns: 2,             //最少允许的列数
    clickToSelect: false,                //是否启用点击选中行
    // showPaginationSwitch: true,     //显示切换分页按钮
    // height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
    uniqueId: "id",                     //每一行的唯一标识，一般为主键列
    showToggle: false,                    //是否显示详细视图和列表视图的切换按钮0
    cardView: false,                    //是否显示详细视图
    detailView: false,                   //是否显示父子表
    clickEdit: true,
    columns: columns,
    onClickCell: function (field, value, row, $element) {
        let editable = false;
        columns.forEach(function (item, index) {
            if (item.field == field) {
                editable = item.editable;
            }
        });
        if (editable) {
            $element.attr('contenteditable', true);
            $element.blur(function () {
                let index = $element.parent().data('index');
                let tdValue = $element.html();
                updateData(index, field, tdValue);
                updateData(index, 'updateDate', dbUtil.nowDate());
                dbUtil.updateById(tableName, row.id, row);
            });
        }
    }
    // , theadClasses: "thead-dark",//这里设置表头样式
    // classes: "table table-bordered table-striped table-sm table-dark",
};
$(document).ready(function () {
    let thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#planBox"), false, true);

    $('#table').bootstrapTable(options);
    //刷新
    $("[name='refresh']").on('click', function () {
        $('#table').bootstrapTable('load', dbUtil.getAllByTableName(tableName));
    });
    //添加一行
    $("#addRow").click(function () {
        let row = {
            id: dbUtil.shortId(),
            createDate: dbUtil.nowDate()
        };
        $('#table').bootstrapTable('insertRow', {
            index: 0,
            row: row
        });
        dbUtil.insert(tableName, row);
    });
    //删除选中行
    $("#deleteRow").click(function () {
        let selections = $('#table').bootstrapTable('getSelections');
        let ids = selections.map((item) => {
            return item.id
        });
        $('#table').bootstrapTable('remove', {
            field: "id",
            values: ids
        });
        dbUtil.removeByIds(tableName, ids);
    });

    $("[name='edit']").click(function () {
        // window.location ="./noteDetail.html";
        // let a =window.btoa(encodeURIComponent('我是啊  啊啊'));
        // console.log(a);
        // console.log(decodeURIComponent(window.atob(a)))
        // ipcRendererUtil.switchPage(thisWindow.id, './view/note/noteDetail.html');
    });
});

function updateData(index, field, value) {
    $('#table').bootstrapTable('updateCell', {
        index: index,       //行索引
        field: field,       //列名
        value: value        //cell值
    })
}
