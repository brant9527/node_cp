(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-9fccee38"],{"55e4":function(t,e,n){"use strict";var l=n("f6a1");n.n(l).a},a6bc:function(t,e,n){"use strict";n.r(e);n("ac6a");var l={data:function(){return{tableData:[],multipleSelection:[]}},methods:{handleSelectionChange:function(t){this.multipleSelection=t},toggleSelection:function(t){var e=this;t?t.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t)}):this.$refs.multipleTable.clearSelection()},getData:function(){var e=this;this.$get(this.$api.getProduct).then(function(t){e.tableData=t}).catch(function(t){e.$msg(t)})},deleteProduct:function(){var e=this,t={list:this.multipleSelection.filter(function(t){return t._id})};this.$post(this.$api.delProduct,t).then(function(t){e.$msg.success("删除成功"),e.getData()}).catch(function(t){e.$msg(t)})},add:function(){this.$router.push({name:"productAdd"})}},created:function(){this.getData()}},i=(n("55e4"),n("2877")),o=function(t){t.options.__source="src/views/product/list/index.vue"},c=Object(i.a)(l,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticStyle:{"margin-top":"10px"}},[n("el-button",{on:{click:e.add}},[e._v("新增产品")]),n("el-button",{on:{click:function(t){return e.toggleSelection()}}},[e._v("取消选择")]),n("el-button",{on:{click:e.deleteProduct}},[e._v("删除专家")])],1),n("el-table",{ref:"multipleTable",staticClass:"table_height",staticStyle:{width:"100%"},attrs:{data:e.tableData,"tooltip-effect":"dark",stripe:""},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55"}}),n("el-table-column",{attrs:{label:"标题",prop:"title",width:"200"}}),n("el-table-column",{attrs:{label:"介绍",prop:"title",width:"200"}}),n("el-table-column",{attrs:{label:"url",prop:"url",width:"200"}}),n("el-table-column",{attrs:{label:"内容"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{domProps:{innerHTML:e._s(t.row.editorContent)}})]}}])})],1)],1)},[],!1,null,"74b7c319",null);"function"==typeof o&&o(c);e.default=c.exports},f6a1:function(t,e,n){}}]);