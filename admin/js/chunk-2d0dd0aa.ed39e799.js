(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0dd0aa"],{8062:function(e,t,l){"use strict";l.r(t);l("7f7f"),l("ac6a");var n={data:function(){return{tableData:[],multipleSelection:[],dialogAddPlan:!1,form:{name:"",url:"",code:""},formInline:{code:"",name:""},formTemp:{playCode:"",tempId:""},czList:[],temps:[],currentSelect:{}}},methods:{toggleSelection:function(e){var t=this;e?e.forEach(function(e){t.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(e){this.multipleSelection=e},onSubmit:function(){var t=this,e=this.czList.filter(function(e){return e.code===t.form.pcode});this.form.pname=e[0].name,this.$post(this.$api.addPlan,this.form).then(function(e){t.$msg.success("创建成功"),t.dialogAddPlan=!1,t.getData()})},deletePlan:function(){var t=this,e={list:this.multipleSelection};this.$post(this.$api.delPlan,e).then(function(e){t.$msg.success("删除成功"),t.getData()})},getData:function(){var t=this,e={pcode:this.formInline.code};this.$get(this.$api.getPlan,{params:e.pcode?e:{}}).then(function(e){t.tableData=e})},getCzData:function(){var t=this;this.$get(this.$api.getLotteryType).then(function(e){t.czList=e})},setTemp:function(e){var t={code:e.code,pcode:e.pcode,name:e.name,pname:e.pname};this.$router.push({name:"playsManage",params:t})},getTemps:function(){var t=this;this.$get(this.$api.getNumTemp).then(function(e){t.temps=e})},updateTemp:function(){var t=this,e=this.temps.filter(function(e){return t.formTemp.tempId===e._id&&e.list}),l=Object.assign({},this.currentSelect,this.formTemp,{list:e[0].list,index:0});this.$post(this.$api.updatePlan,l).then(function(e){t.$msg.success("设置成功")})}},created:function(){0===this.czList.length&&this.getCzData(),this.getData(),this.getTemps()}},a=l("2877"),o=function(e){e.options.__source="src/views/plan/index.vue"},i=Object(a.a)(n,function(){var l=this,e=l.$createElement,n=l._self._c||e;return n("d2-container",[n("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:l.formInline}},[n("el-form-item",{attrs:{label:"彩种"}},[n("el-select",{attrs:{placeholder:"彩种选择"},model:{value:l.formInline.code,callback:function(e){l.$set(l.formInline,"code",e)},expression:"formInline.code"}},l._l(l.czList,function(e){return n("el-option",{key:e._id,attrs:{label:e.name,value:e.code}})}),1)],1),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:l.getData}},[l._v("查询")]),n("el-button",{on:{click:function(e){l.dialogAddPlan=!0}}},[l._v("新增计划")]),n("el-button",{on:{click:l.deletePlan}},[l._v("删除计划")])],1)],1),n("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:l.tableData,"tooltip-effect":"dark",stripe:""},on:{"selection-change":l.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55"}}),n("el-table-column",{attrs:{label:"计划名称",prop:"name"}}),n("el-table-column",{attrs:{label:"计划编码",prop:"code"}}),n("el-table-column",{attrs:{label:"父类名称",prop:"pname"}}),n("el-table-column",{attrs:{label:"父类编码",prop:"pcode"}}),n("el-table-column",{attrs:{label:"分配玩法",prop:"playCode"}}),n("el-table-column",{attrs:{label:"分配模板id",prop:"tempId"}}),n("el-table-column",{attrs:{label:"操作"},scopedSlots:l._u([{key:"default",fn:function(t){return[n("el-button",{on:{click:function(e){return l.setTemp(t.row)}}},[l._v("分配模板")])]}}])})],1),n("div",{staticStyle:{"margin-top":"10px"}}),n("el-dialog",{attrs:{visible:l.dialogAddPlan},on:{"update:visible":function(e){l.dialogAddPlan=e}}},[n("el-form",{ref:"form",attrs:{model:l.form,"label-width":"80px"}},[n("el-form-item",{attrs:{label:"计划名称"}},[n("el-input",{model:{value:l.form.name,callback:function(e){l.$set(l.form,"name",e)},expression:"form.name"}})],1),n("el-form-item",{attrs:{label:"计划编码"}},[n("el-input",{model:{value:l.form.code,callback:function(e){l.$set(l.form,"code",e)},expression:"form.code"}})],1),n("el-form-item",{attrs:{label:"彩种"}},[n("el-select",{attrs:{placeholder:"彩种选择"},model:{value:l.form.pcode,callback:function(e){l.$set(l.form,"pcode",e)},expression:"form.pcode"}},l._l(l.czList,function(e){return n("el-option",{key:e._id,attrs:{label:e.name,value:e.code}})}),1)],1),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:l.onSubmit}},[l._v("立即创建")]),n("el-button",{on:{click:function(e){l.dialogAddPlan=!1}}},[l._v("取消")])],1)],1)],1)],1)},[],!1,null,null,null);"function"==typeof o&&o(i);t.default=i.exports}}]);