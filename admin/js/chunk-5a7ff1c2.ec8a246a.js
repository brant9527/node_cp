(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5a7ff1c2","chunk-2d0cf53e"],{"62f2":function(e,t,l){"use strict";l.r(t),t.default={list:[{name:"后一",code:"h1"},{name:"后二复式 ",code:"h2fs"},{name:"后二直选",code:"h2zux"},{name:"后二组选",code:"h2zux"},{name:"前二复式",code:"q2fs"},{name:"前二直选",code:"q2zhix"},{name:"后三复式",code:"h3fs"},{name:"后三直选",code:"h3zhix"},{name:"后三组六",code:"h3zu6"},{name:"后三组三",code:"h3zu3"},{name:"前三复式",code:"h3fs"},{name:"前三组六",code:"q3zu6"},{name:"前三组三",code:"q3zu3"},{name:"四星复式",code:"sxfs"},{name:"五星复式",code:"wxfs"}]}},"6d59":function(e,t,l){"use strict";l.r(t);l("7f7f"),l("ac6a");var a=l("62f2"),o={data:function(){return{tableData:[],plays:a.default.list,multipleSelection:[],dialogAddPlays:!1,formInline:{code:"",name:""},formTemp:{playCode:"",tempId:""},czList:[],dialogSetTemp:!1,temps:[],currentSelect:{}}},methods:{toggleSelection:function(e){var t=this;e?e.forEach(function(e){t.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(e){this.multipleSelection=e},onSubmit:function(){var t=this,e=this.temps.filter(function(e){return t.formTemp.tempId===e._id&&e.list}),l=this.plays.filter(function(e){return t.formTemp.playCode===e.code&&e}),a=this.$route.params,o=Object.assign({},this.formTemp,a,{list:e[0].list,index:0,playName:l[0].name});this.$post(this.$api.addPlanPlays,o).then(function(e){t.$msg.success("创建成功"),t.dialogAddPlays=!1,t.getData()})},deletePlays:function(){var t=this,e={list:this.multipleSelection};this.$post(this.$api.delPlanPlays,e).then(function(e){t.$msg.success("删除成功"),t.getData()})},getData:function(){var t=this,e={code:this.$route.params.code,pcode:this.$route.params.pcode};this.$get(this.$api.getPlanPlays,{params:e.pcode?e:{}}).then(function(e){t.tableData=e})},setTemp:function(e){this.dialogSetTemp=!0,this.currentSelect=e},getTemps:function(){var t=this;this.$get(this.$api.getNumTemp).then(function(e){t.temps=e})}},created:function(){this.getData(),this.getTemps()}},n=l("2877"),i=function(e){e.options.__source="src/views/plays/index.vue"},s=Object(n.a)(o,function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("d2-container",[l("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:t.formInline}},[l("el-form-item",[l("el-button",{on:{click:function(e){t.dialogAddPlays=!0}}},[t._v("添加玩法")]),l("el-button",{on:{click:t.deletePlays}},[t._v("删除玩法")])],1)],1),l("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.tableData,"tooltip-effect":"dark",stripe:""},on:{"selection-change":t.handleSelectionChange}},[l("el-table-column",{attrs:{type:"selection",width:"55"}}),l("el-table-column",{attrs:{label:"玩法名称",prop:"name"}}),l("el-table-column",{attrs:{label:"玩法编码",prop:"code"}}),l("el-table-column",{attrs:{label:"所属计划名称",prop:"pname"}}),l("el-table-column",{attrs:{label:"父类编码",prop:"pcode"}}),l("el-table-column",{attrs:{label:"分配玩法",prop:"playCode"}}),l("el-table-column",{attrs:{label:"玩法名称",prop:"playName"}}),l("el-table-column",{attrs:{label:"模板内容",prop:""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.list.toString())+"\n      ")]}}])})],1),l("div",{staticStyle:{"margin-top":"10px"}}),l("el-dialog",{attrs:{visible:t.dialogAddPlays},on:{"update:visible":function(e){t.dialogAddPlays=e}}},[l("el-form",{ref:"formTemp",attrs:{model:t.formTemp,"label-width":"80px"}},[l("el-form-item",{attrs:{label:"玩法"}},[l("el-select",{attrs:{placeholder:"玩法选择"},model:{value:t.formTemp.playCode,callback:function(e){t.$set(t.formTemp,"playCode",e)},expression:"formTemp.playCode"}},t._l(t.plays,function(e){return l("el-option",{key:e.id,attrs:{label:e.name,value:e.code}})}),1)],1),l("el-form-item",{attrs:{label:"模板"}},[l("el-select",{attrs:{placeholder:"码库模板选择"},model:{value:t.formTemp.tempId,callback:function(e){t.$set(t.formTemp,"tempId",e)},expression:"formTemp.tempId"}},t._l(t.temps,function(e){return l("el-option",{key:e._id,attrs:{label:e.name,value:e._id}})}),1)],1),l("el-form-item",[l("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("立即分配")]),l("el-button",{on:{click:function(e){t.dialogSetTemp=!1}}},[t._v("取消")])],1)],1)],1)],1)},[],!1,null,null,null);"function"==typeof i&&i(s);t.default=s.exports}}]);