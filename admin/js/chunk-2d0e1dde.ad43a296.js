(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0e1dde"],{"7beb":function(e,t,l){"use strict";l.r(t);l("ac6a");var n={data:function(){return{tableData:[],multipleSelection:[],dialogAddTemp:!1,form:{name:"",url:"",code:""},formInline:{type:"",name:""},czList:[]}},methods:{toggleSelection:function(e){var t=this;e?e.forEach(function(e){t.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(e){this.multipleSelection=e},onSubmit:function(){this.$router.push({name:"maku"})},deletePlan:function(){var t=this,e={list:this.multipleSelection};this.$post(this.$api.delNumTemp,e).then(function(e){t.$msg.success("删除成功"),t.getData()})},getData:function(){var t=this,e={type:this.formInline.type};this.$get(this.$api.getNumTemp,{params:e.type?e:{}}).then(function(e){t.tableData=e})},getCzData:function(){var t=this;this.$get(this.$api.getLotteryType).then(function(e){t.czList=e})}},created:function(){this.czList.length,this.getData()}},o=l("2877"),i=function(e){e.options.__source="src/views/numTemp/index.vue"},a=Object(o.a)(n,function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("d2-container",[l("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:t.formInline}},[l("el-form-item",{attrs:{label:"彩种"}},[l("el-select",{attrs:{placeholder:"彩种选择"},model:{value:t.formInline.code,callback:function(e){t.$set(t.formInline,"code",e)},expression:"formInline.code"}},t._l(t.czList,function(e){return l("el-option",{key:e._id,attrs:{label:e.name,value:e.code}})}),1)],1),l("el-form-item",[l("el-button",{attrs:{type:"primary"},on:{click:t.getData}},[t._v("查询")]),l("el-button",{on:{click:t.onSubmit}},[t._v("新增模板")]),l("el-button",{on:{click:t.deletePlan}},[t._v("删除计划")])],1)],1),l("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.tableData,"tooltip-effect":"dark",stripe:""},on:{"selection-change":t.handleSelectionChange}},[l("el-table-column",{attrs:{type:"selection",width:"55"}}),l("el-table-column",{attrs:{label:"玩法名称",prop:"name"}}),l("el-table-column",{attrs:{label:"模板内容"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.list.join())+"\n\n      ")]}}])})],1),l("div",{staticStyle:{"margin-top":"10px"}}),l("el-dialog",{attrs:{visible:t.dialogAddTemp},on:{"update:visible":function(e){t.dialogAddTemp=e}}},[l("el-form",{ref:"form",attrs:{model:t.form,"label-width":"80px"}},[l("el-form-item",{attrs:{label:"模板"}},[l("el-select",{attrs:{placeholder:"模板选择"},model:{value:t.form.pcode,callback:function(e){t.$set(t.form,"pcode",e)},expression:"form.pcode"}},t._l(t.czList,function(e){return l("el-option",{key:e._id,attrs:{label:e.name,value:e.code}})}),1)],1),l("el-form-item",{attrs:{label:"模板"}},[l("el-select",{attrs:{placeholder:"模板选择"},model:{value:t.form.pcode,callback:function(e){t.$set(t.form,"pcode",e)},expression:"form.pcode"}},t._l(t.czList,function(e){return l("el-option",{key:e._id,attrs:{label:e.name,value:e.code}})}),1)],1),l("el-form-item",[l("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("立即创建")]),l("el-button",{on:{click:function(e){t.dialogAddTemp=!1}}},[t._v("取消")])],1)],1)],1)],1)},[],!1,null,null,null);"function"==typeof i&&i(a);t.default=a.exports}}]);