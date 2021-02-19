<template>
	<div>
		<button @click="$emit('update:a',100)">修改父亲的a</button>
		<button @click="$emit('abc',1000)">修改父亲的bb</button>
		<!--默认插槽，父组件中没用slot命名的标签都将放到此处的插槽中-->
		<slot></slot>
		<!--具名插槽-->
		<div>
			<slot name="a2"></slot>
		</div>
		<div>
			<slot name="a1"  :age="10"  ts="aaa" ></slot>
			<!--所有自定义的属性(name不会被封装)会被vue封装为一个对象，当父组件通过slot-scope接收此处slot上自己定义的属性值时收到的是一个对象-->
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "Demo",
                props: ["a", "b"], //子组件对外公开的变量名
                model: {
                        prop: "b",  //要想自己定义的组件，父组件能够通过v-model完成值得修改，则通过model节点中声明得prop来指定
                        event: "abc" //要修改时，emit发射的事件abc即可完成修改
                }
        }
</script>

<style scoped>
</style>
