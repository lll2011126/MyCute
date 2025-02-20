var defaultOptions = {
    striped: true,                      //是否显示行间隔色
    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,                   //是否显示分页（*）
    sortable: false,                     //是否启用排序
    sortOrder: "asc",                   //排序方式
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
    // height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数决定表格高度
    uniqueId: "id",                     //每一行的唯一标识，一般为主键列
    showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
    cardView: false,                    //是否显示详细视图
    detailView: false,                   //是否显示父子表
    clickEdit: true
    // , theadClasses: "thead-dark",//这里设置表头样式
    // classes: "table table-bordered table-striped table-sm table-dark",
};

const newTable = function (options) {

};

export default newTable;
