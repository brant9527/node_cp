(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0a4400"],{"0648":function(t,e,n){"use strict";n.r(e);var o={data:function(){return{form:{wx:"",qq:""}}},methods:{onSubmit:function(){var e=this;this.$post(this.$api.addContact,this.form).then(function(t){e.$msg.success("发布成功")})}},created:function(){var e=this;this.$get(this.$api.getContact).then(function(t){t.map(function(t){1==t.type?e.form.wx=t.contact:e.form.qq=t.contact})})}},i=n("2877"),r=function(t){t.options.__source="src/views/contact/index.vue"},c=Object(i.a)(o,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-form",{ref:"form",staticStyle:{padding:"20px"},attrs:{model:e.form,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"微信账号："}},[n("el-input",{model:{value:e.form.wx,callback:function(t){e.$set(e.form,"wx",t)},expression:"form.wx"}})],1),n("el-form-item",{attrs:{label:"QQ账号："}},[n("el-input",{model:{value:e.form.qq,callback:function(t){e.$set(e.form,"qq",t)},expression:"form.qq"}})],1),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("确定")])],1)],1)],1)},[],!1,null,null,null);"function"==typeof r&&r(c);e.default=c.exports}}]);