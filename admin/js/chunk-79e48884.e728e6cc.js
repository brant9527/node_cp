(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-79e48884"],{3028:function(t,e,n){"use strict";n.r(e);n("ac6a");var i={data:function(){return{tableData:[],multipleSelection:[]}},methods:{handleSelectionChange:function(t){this.multipleSelection=t},toggleSelection:function(t){var e=this;t?t.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t)}):this.$refs.multipleTable.clearSelection()},getData:function(){var e=this;this.$get(this.$api.getNotice,{params:{pageSize:100}}).then(function(t){e.tableData=t}).catch(function(t){e.$msg(t)})},deleteNotice:function(){var e=this,t={list:this.multipleSelection.filter(function(t){return t._id})};this.$post(this.$api.delNotice,t).then(function(t){e.$msg.success("删除成功"),e.getData()}).catch(function(t){e.$msg(t)})},add:function(){this.$router.push({name:"noticeAdd"})}},created:function(){this.getData()}},l=(n("4d1d"),n("2877")),o=function(t){t.options.__source="src/views/notice/list/index.vue"},a=Object(l.a)(i,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticStyle:{"margin-top":"10px"}},[n("el-button",{on:{click:e.add}},[e._v("新增公告")]),n("el-button",{on:{click:function(t){return e.toggleSelection()}}},[e._v("取消选择")]),n("el-button",{on:{click:e.deleteNotice}},[e._v("删除公告")])],1),n("el-table",{ref:"multipleTable",staticClass:"table_height",staticStyle:{width:"100%"},attrs:{data:e.tableData,"tooltip-effect":"dark",stripe:""},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55"}}),n("el-table-column",{attrs:{label:"标题",prop:"title",width:"200"}}),n("el-table-column",{attrs:{label:"内容"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{domProps:{innerHTML:e._s(t.row.editorContent)}})]}}])}),n("el-table-column",{attrs:{label:"时间",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n      "+e._s(e._f("dateformat")(t.row.createTime))+"\n      ")]}}])})],1)],1)},[],!1,null,"cdb857a0",null);"function"==typeof o&&o(a);e.default=a.exports},"4d1d":function(t,e,n){"use strict";var i=n("bbef");n.n(i).a},bbef:function(t,e,n){}}]);