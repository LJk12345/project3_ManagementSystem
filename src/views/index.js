let files =require.context("./" ,true ,/index.vue$/)//（views以当前文件为参照系的相对位置，是否查询其子文件，查询条件）
//返回值为一个对象，key值：以当前文件为参照物,查找所有满足方法参数的文件所在的相对路径
//files{"./Cart/index.vue": "./src/views/Cart/index.vue"}
let views={};
console.log(files)
files.keys().forEach(filePath =>{
        var key=filePath.match(/.*\/(.*)\/index.vue$/)[1];
        //扣取组件名
        //console.log(filePath.match(/.*\/(.*)\/index.vue$/))
        views[key]=files(filePath).default
});
export default  views;