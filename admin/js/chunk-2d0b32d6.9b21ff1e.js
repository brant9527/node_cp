(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0b32d6"],{"26ea":function(t,e,o){"use strict";o.r(e);var n={data:function(){return{form:{title:"",introduce:"",editorContent:"测试内容"},dialogAddType:!1}},methods:{onSubmit:function(){var e=this;this.$post(this.$api.addNews,this.form).then(function(t){e.$msg.success("发布成功")})}},components:{editor:o("ceb0").a}},i=o("2877"),r=function(t){t.options.__source="src/views/acounts/add/index.vue"},l=Object(i.a)(n,function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticStyle:{padding:"10px"}},[o("el-form",{ref:"form",attrs:{model:e.form,"label-width":"80px"}},[o("el-form-item",{attrs:{label:"标题"}},[o("el-input",{model:{value:e.form.title,callback:function(t){e.$set(e.form,"title",t)},expression:"form.title"}})],1),o("el-form-item",{attrs:{label:"介绍"}},[o("el-input",{model:{value:e.form.introduce,callback:function(t){e.$set(e.form,"introduce",t)},expression:"form.introduce"}})],1),o("el-form-item",{attrs:{label:"内容"}},[o("editor",{model:{value:e.form.editorContent,callback:function(t){e.$set(e.form,"editorContent",t)},expression:"form.editorContent"}})],1),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("立即创建")]),o("el-button",{on:{click:function(t){e.dialogAddType=!1}}},[e._v("取消")])],1)],1)],1)},[],!1,null,null,null);"function"==typeof r&&r(l);e.default=l.exports}}]);